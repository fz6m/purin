import { getListHotTweets } from '../src'
const list = '233096513'

const run = async () => {
  const res = await getListHotTweets({
    list,
    auth: require('./auth.json')
  })
  console.log('res: ', res);
}

run()
