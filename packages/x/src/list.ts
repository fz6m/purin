import qs from 'qs'
import { HttpsProxyAgent } from 'https-proxy-agent'
import axios from 'axios'
import zod from 'zod'
import { IList } from './interface'
import { uniq } from 'lodash'

const getCT0 = (cookie: string) => {
  const reg = /ct0=(.*?);/
  return cookie.match(reg)?.[1]
}

export interface IXAuth {
  cookie: string
  authorization: string
}

export interface IListHotTweets {
  auth: IXAuth
  list: string
}

// https://github.com/jamespacileo/twitter-scraper-edge
// https://github.com/n0madic/twitter-scraper
export const getListHotTweets = async (opts: IListHotTweets) => {
  const schema = zod.object({
    list: zod.string().regex(/^[0-9]+$/),
    auth: zod.object({
      cookie: zod.string().includes('ct0='),
      authorization: zod.string().startsWith('Bearer '),
    }),
  })
  const result = schema.safeParse(opts)
  if (!result.success) {
    console.log('getListHotTweets parse error: ', result.error)
    return
  }

  const { auth, list } = result.data
  const authorization = auth.authorization
  const cookie = auth.cookie
  const csrfToken = getCT0(cookie)
  const params = {
    variables: {
      rawQuery: `list:${list} `,
      count: 20,
      querySource: 'typed_query',
      product: 'Top',
    },
    features: {
      rweb_lists_timeline_redesign_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: true, // !
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: false,
      tweet_awards_web_tipping_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_media_download_video_enabled: false,
      responsive_web_enhance_cards_enabled: false,
    },
    fieldToggles: {
      withArticleRichContentState: false,
    },
  }

  const query = qs.stringify({
    variables: JSON.stringify(params.variables),
    features: JSON.stringify(params.features),
    fieldToggles: JSON.stringify(params.fieldToggles),
  })

  const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7',
    authorization,
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'sec-ch-ua':
      '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-csrf-token': csrfToken,
    'x-twitter-active-user': 'yes',
    'x-twitter-auth-type': 'OAuth2Session',
    'x-twitter-client-language': 'en',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    cookie: cookie,
    Referer: `https://twitter.com/search?${qs.stringify({
      q: params.variables.rawQuery,
    })}`,
    'Referrer-Policy': 'no-referrer-when-downgrade',
  }

  const url = `https://twitter.com/i/api/graphql/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?${query}`

  const getProxyAgent = () => {
    const agent = process.env.HTTP_PROXY
    if (agent) {
      const proxyUrl = agent
      const proxyAgent = new HttpsProxyAgent(proxyUrl)
      return proxyAgent
    }
  }
  const httpsAgent = getProxyAgent()

  const getRes = async () => {
    try {
      const response = await axios.get(url, {
        headers,
        ...(httpsAgent ? { httpsAgent } : {}),
      })
      // TODO: request limit
      // TODO: csrf invalid
      return response
    } catch (e) {
      console.log('getListHotTweets request error: ', e)
    }
  }

  const res = await getRes()
  if (!res) {
    console.log('getListHotTweets cannot get response')
    return
  }
  const listRes = res?.data as Partial<IList>
  const instruction =
    listRes?.data?.search_by_raw_query?.search_timeline?.timeline
      ?.instructions?.[0]
  if (!instruction) {
    console.log('getListHotTweets cannot find instruction: ', listRes)
    return
  }
  const tweetPrefix = 'tweet-'
  const tweets = instruction?.entries?.filter((i) =>
    i?.entryId?.startsWith(tweetPrefix),
  )
  if (!tweets?.length) {
    console.log('getListHotTweets cannot find tweets: ', listRes)
    return
  }
  const ids = uniq(
    tweets.filter(Boolean).map((i) => i.entryId.slice(tweetPrefix.length)),
  )
  return ids
}
