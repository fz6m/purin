export interface IList {
  data: IListData
}

export interface IListData {
  search_by_raw_query: IListSearchByRawQuery
}

export interface IListSearchByRawQuery {
  search_timeline: IListSearchTimeline
}

export interface IListSearchTimeline {
  timeline: IListTimeline
}

export interface IListTimeline {
  instructions: IListInstruction[]
  responseObjects: IListResponseObjects
}

export interface IListInstruction {
  type: string
  entries: IListEntry[]
}

export type IListEntryId = `tweet-${string}`

export interface IListEntry {
  entryId: IListEntryId
  sortIndex: string
  content: IListContent
}

export interface IListContent {
  entryType: string
  __typename: string
  itemContent?: IListItemContent
  feedbackInfo?: IListFeedbackInfo
  clientEventInfo?: IListClientEventInfo
  value?: string
  cursorType?: string
}

export interface IListItemContent {
  itemType: string
  __typename: string
  tweet_results: IListTweetResults
  tweetDisplayType: string
}

export interface IListTweetResults {
  result: IListTweetResult
}

export interface IListTweetResult {
  __typename: string
  rest_id: string
  core: IListCore
  unmention_data: IListUnmentionData
  edit_control: IListEditControl
  is_translatable: boolean
  views: IListTweetResultViews
  source: string
  legacy: IListTweetResultLegacy
  card?: IListCard
  unified_card?: IListUnifiedCard
  previous_counts?: IListPreviousCounts
  quoted_status_result?: IListQuotedStatusResult
}

export interface IListCore {
  user_results: IListUserResults
}

export interface IListUserResults {
  result: IListUserResult
}

export interface IListUserResult {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: IListAffiliatesHighlightedLabel
  has_graduated_access: boolean
  is_blue_verified: boolean
  profile_image_shape: string
  legacy: IListUserResultLegacy
  verified_phone_status: boolean
  professional?: IListProfessional
}

export interface IListAffiliatesHighlightedLabel {
  label?: IListLabel
}

export interface IListLabel {
  url: IListLabelUrl
  badge: IListBadge
  description: string
  userLabelType: string
  userLabelDisplayType: string
}

export interface IListLabelUrl {
  url: string
  urlType: string
}

export interface IListBadge {
  url: string
}

export interface IListUserResultLegacy {
  following: boolean
  can_dm: boolean
  can_media_tag: boolean
  created_at: string
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: IListEntities
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  location: string
  media_count: number
  name: string
  normal_followers_count: number
  pinned_tweet_ids_str: string[]
  possibly_sensitive: boolean
  profile_banner_url?: string
  profile_image_url_https: string
  profile_interstitial_type: string
  screen_name: string
  statuses_count: number
  translator_type: string
  url: string
  verified: boolean
  want_retweets: boolean
  withheld_in_countries: any[]
  verified_type?: string
}

export interface IListEntities {
  description: IListDescription
  url: IListEntitiesUrl
}

export interface IListDescription {
  urls: IListDescriptionUrl[]
}

export interface IListDescriptionUrl {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface IListEntitiesUrl {
  urls: IListEntitiesUrl[]
}

export interface IListEntitiesUrl {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface IListProfessional {
  rest_id: string
  professional_type: string
  category: IListCategory[]
}

export interface IListCategory {
  id: number
  name: string
  icon_name: string
}

export interface IListUnmentionData {}

export interface IListEditControl {
  edit_tweet_ids?: string[]
  editable_until_msecs?: string
  is_edit_eligible?: boolean
  edits_remaining?: string
  initial_tweet_id?: string
  edit_control_initial?: IListEditControlInitial
}

export interface IListEditControlInitial {
  edit_tweet_ids: string[]
  editable_until_msecs: string
  is_edit_eligible: boolean
  edits_remaining: string
}

export interface IListTweetResultViews {
  count: string
  state: string
}

export interface IListTweetResultLegacy {
  bookmark_count: number
  bookmarked: boolean
  created_at: string
  conversation_id_str: string
  display_text_range: number[]
  entities: IListTweetResultLegacyEntities
  extended_entities?: IListExtendedEntities
  favorite_count: number
  favorited: boolean
  full_text: string
  is_quote_status: boolean
  lang: string
  possibly_sensitive?: boolean
  possibly_sensitive_editable?: boolean
  quote_count: number
  reply_count: number
  retweet_count: number
  retweeted: boolean
  user_id_str: string
  id_str: string
  place?: IListPlace
  quoted_status_id_str?: string
  quoted_status_permalink?: IListQuotedStatusPermalink
}

export interface IListTweetResultLegacyEntities {
  media?: IListMedum[]
  user_mentions: IListUserMention[]
  urls: IListTweetResultLegacyEntitiesUrl[]
  hashtags: any[]
  symbols: any[]
}

export interface IListMedum {
  display_url: string
  expanded_url: string
  id_str: string
  indices: number[]
  media_key: string
  media_url_https: string
  type: string
  url: string
  additional_media_info?: IListAdditionalMediaInfo
  ext_media_availability: IListExtMediaAvailability
  sizes: IListSizes
  original_info: IListOriginalInfo
  video_info?: IListVideoInfo
  ext_alt_text?: string
  features?: IListFeatures
}

export interface IListAdditionalMediaInfo {
  monetizable: boolean
}

export interface IListExtMediaAvailability {
  status: string
}

export interface IListSizes {
  large: IListSizesLarge
  medium: IListSizesMedium
  small: IListSizesSmall
  thumb: IListSizesThumb
}

export interface IListSizesLarge {
  h: number
  w: number
  resize: string
}

export interface IListSizesMedium {
  h: number
  w: number
  resize: string
}

export interface IListSizesSmall {
  h: number
  w: number
  resize: string
}

export interface IListSizesThumb {
  h: number
  w: number
  resize: string
}

export interface IListOriginalInfo {
  height: number
  width: number
  focus_rects: IListFocusRect[]
}

export interface IListFocusRect {
  x: number
  y: number
  w: number
  h: number
}

export interface IListVideoInfo {
  aspect_ratio: number[]
  duration_millis: number
  variants: IListVariant[]
}

export interface IListVariant {
  bitrate?: number
  content_type: string
  url: string
}

export interface IListFeatures {
  large: IListFeaturesLarge
  medium: IListFeaturesMedium
  small: IListFeaturesSmall
  orig: IListFeaturesOrig
}

export interface IListFeaturesLarge {
  faces: IListFace[]
}

export interface IListFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListFeaturesMedium {
  faces: IListFeaturesMediumFace[]
}

export interface IListFeaturesMediumFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListFeaturesSmall {
  faces: IListFeaturesSmallFace[]
}

export interface IListFeaturesSmallFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListFeaturesOrig {
  faces: IListFeaturesOrigFace[]
}

export interface IListFeaturesOrigFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListUserMention {
  id_str: string
  name: string
  screen_name: string
  indices: number[]
}

export interface IListTweetResultLegacyEntitiesUrl {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface IListExtendedEntities {
  media: IListExtendedEntitiesMedum[]
}

export interface IListExtendedEntitiesMedum {
  display_url: string
  expanded_url: string
  id_str: string
  indices: number[]
  media_key: string
  media_url_https: string
  type: string
  url: string
  additional_media_info?: IListExtendedEntitiesMedumAdditionalMediaInfo
  ext_media_availability: IListExtendedEntitiesMedumExtMediaAvailability
  sizes: IListExtendedEntitiesMedumSizes
  original_info: IListExtendedEntitiesMedumOriginalInfo
  video_info?: IListExtendedEntitiesMedumVideoInfo
  ext_alt_text?: string
  features?: IListExtendedEntitiesMedumFeatures
}

export interface IListExtendedEntitiesMedumAdditionalMediaInfo {
  monetizable: boolean
}

export interface IListExtendedEntitiesMedumExtMediaAvailability {
  status: string
}

export interface IListExtendedEntitiesMedumSizes {
  large: IListExtendedEntitiesMedumSizesLarge
  medium: IListExtendedEntitiesMedumSizesMedium
  small: IListExtendedEntitiesMedumSizesSmall
  thumb: IListExtendedEntitiesMedumSizesThumb
}

export interface IListExtendedEntitiesMedumSizesLarge {
  h: number
  w: number
  resize: string
}

export interface IListExtendedEntitiesMedumSizesMedium {
  h: number
  w: number
  resize: string
}

export interface IListExtendedEntitiesMedumSizesSmall {
  h: number
  w: number
  resize: string
}

export interface IListExtendedEntitiesMedumSizesThumb {
  h: number
  w: number
  resize: string
}

export interface IListExtendedEntitiesMedumOriginalInfo {
  height: number
  width: number
  focus_rects: IListExtendedEntitiesMedumOriginalInfoFocusRect[]
}

export interface IListExtendedEntitiesMedumOriginalInfoFocusRect {
  x: number
  y: number
  w: number
  h: number
}

export interface IListExtendedEntitiesMedumVideoInfo {
  aspect_ratio: number[]
  duration_millis: number
  variants: IListExtendedEntitiesMedumOriginalInfoVariant[]
}

export interface IListExtendedEntitiesMedumOriginalInfoVariant {
  bitrate?: number
  content_type: string
  url: string
}

export interface IListExtendedEntitiesMedumFeatures {
  large: IListExtendedEntitiesMedumFeaturesLarge
  medium: IListExtendedEntitiesMedumFeaturesMedium
  small: IListExtendedEntitiesMedumFeaturesSmall
  orig: IListExtendedEntitiesMedumFeaturesOrig
}

export interface IListExtendedEntitiesMedumFeaturesLarge {
  faces: IListExtendedEntitiesMedumFeaturesLargeFace[]
}

export interface IListExtendedEntitiesMedumFeaturesLargeFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListExtendedEntitiesMedumFeaturesMedium {
  faces: IListExtendedEntitiesMedumFeaturesMediumFace[]
}

export interface IListExtendedEntitiesMedumFeaturesMediumFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListExtendedEntitiesMedumFeaturesSmall {
  faces: IListExtendedEntitiesMedumFeaturesSmallFace[]
}

export interface IListExtendedEntitiesMedumFeaturesSmallFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListExtendedEntitiesMedumFeaturesOrig {
  faces: IListExtendedEntitiesMedumFeaturesOrigFace[]
}

export interface IListExtendedEntitiesMedumFeaturesOrigFace {
  x: number
  y: number
  h: number
  w: number
}

export interface IListPlace {
  bounding_box: IListBoundingBox
  country: string
  country_code: string
  full_name: string
  name: string
  id: string
  place_type: string
  url: string
}

export interface IListBoundingBox {
  coordinates: number[][][]
  type: string
}

export interface IListQuotedStatusPermalink {
  url: string
  expanded: string
  display: string
}

export interface IListCard {
  rest_id: string
  legacy: IListCardLegacy
}

export interface IListCardLegacy {
  binding_values: IListCardLegacyBindingValue[]
  card_platform: IListCardLegacyCardPlatform
  name: string
  url: string
  user_refs_results: IListCardLegacyUserRefsResult[]
}

export interface IListCardLegacyBindingValue {
  key: string
  value: IListCardLegacyBindingValueValue
}

export interface IListCardLegacyBindingValueValue {
  image_value?: IListCardLegacyBindingValueValueImageValue
  type: string
  string_value?: string
  scribe_key?: string
  user_value?: IListCardLegacyBindingValueValueUserValue
  image_color_value?: IListCardLegacyBindingValueValueImageColorValue
}

export interface IListCardLegacyBindingValueValueImageValue {
  height: number
  width: number
  url: string
}

export interface IListCardLegacyBindingValueValueUserValue {
  id_str: string
  path: any[]
}

export interface IListCardLegacyBindingValueValueImageColorValue {
  palette: IListCardLegacyBindingValueValueImageColorValuePalette[]
}

export interface IListCardLegacyBindingValueValueImageColorValuePalette {
  rgb: IListCardLegacyBindingValueValueImageColorValuePaletteRgb
  percentage: number
}

export interface IListCardLegacyBindingValueValueImageColorValuePaletteRgb {
  blue: number
  green: number
  red: number
}

export interface IListCardLegacyCardPlatform {
  platform: IListCardLegacyCardPlatformPlatform
}

export interface IListCardLegacyCardPlatformPlatform {
  audience: IListCardLegacyCardPlatformPlatformAudience
  device: IListCardLegacyCardPlatformPlatformDevice
}

export interface IListCardLegacyCardPlatformPlatformAudience {
  name: string
}

export interface IListCardLegacyCardPlatformPlatformDevice {
  name: string
  version: string
}

export interface IListCardLegacyUserRefsResult {
  result: IListCardLegacyUserRefsResultResult
}

export interface IListCardLegacyUserRefsResultResult {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: IListCardLegacyUserRefsResultResultAffiliatesHighlightedLabel
  has_graduated_access: boolean
  is_blue_verified: boolean
  profile_image_shape: string
  legacy: IListCardLegacyUserRefsResultResultLegacy
  verified_phone_status: boolean
}

export interface IListCardLegacyUserRefsResultResultAffiliatesHighlightedLabel {}

export interface IListCardLegacyUserRefsResultResultLegacy {
  following: boolean
  can_dm: boolean
  can_media_tag: boolean
  created_at: string
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: IListCardLegacyUserRefsResultResultLegacyEntities
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  location: string
  media_count: number
  name: string
  normal_followers_count: number
  pinned_tweet_ids_str: string[]
  possibly_sensitive: boolean
  profile_banner_url: string
  profile_image_url_https: string
  profile_interstitial_type: string
  screen_name: string
  statuses_count: number
  translator_type: string
  url: string
  verified: boolean
  verified_type?: string
  want_retweets: boolean
  withheld_in_countries: any[]
}

export interface IListCardLegacyUserRefsResultResultLegacyEntities {
  description: IListCardLegacyUserRefsResultResultLegacyEntitiesDescription
  url: IListCardLegacyUserRefsResultResultLegacyEntitiesUrl
}

export interface IListCardLegacyUserRefsResultResultLegacyEntitiesDescription {
  urls: IListCardLegacyUserRefsResultResultLegacyEntitiesDescriptionUrl[]
}

export interface IListCardLegacyUserRefsResultResultLegacyEntitiesDescriptionUrl {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface IListCardLegacyUserRefsResultResultLegacyEntitiesUrl {
  urls: IListCardLegacyUserRefsResultResultLegacyEntitiesUrlUrl[]
}

export interface IListCardLegacyUserRefsResultResultLegacyEntitiesUrlUrl {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface IListUnifiedCard {
  card_fetch_state: string
}

export interface IListPreviousCounts {
  bookmark_count: number
  favorite_count: number
  quote_count: number
  reply_count: number
  retweet_count: number
}

export interface IListQuotedStatusResult {
  result: IListQuotedStatusResultResult
}

export interface IListQuotedStatusResultResult {
  __typename: string
  rest_id: string
  core: IListQuotedStatusResultResultCore
  unmention_data: IListQuotedStatusResultResultUnmentionData
  edit_control: IListQuotedStatusResultResultEditControl
  is_translatable: boolean
  views: IListQuotedStatusResultResultViews
  source: string
  legacy: IListQuotedStatusResultResultLegacy
}

export interface IListQuotedStatusResultResultCore {
  user_results: IListQuotedStatusResultResultCoreUserResults
}

export interface IListQuotedStatusResultResultCoreUserResults {
  result: IListQuotedStatusResultResultCoreUserResultsResult
}

export interface IListQuotedStatusResultResultCoreUserResultsResult {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: IListQuotedStatusResultResultCoreUserResultsResultAffiliatesHighlightedLabel
  has_graduated_access: boolean
  is_blue_verified: boolean
  profile_image_shape: string
  legacy: IListQuotedStatusResultResultCoreUserResultsResultLegacy
  verified_phone_status: boolean
}

export interface IListQuotedStatusResultResultCoreUserResultsResultAffiliatesHighlightedLabel {}

export interface IListQuotedStatusResultResultCoreUserResultsResultLegacy {
  following: boolean
  can_dm: boolean
  can_media_tag: boolean
  created_at: string
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: IListQuotedStatusResultResultCoreUserResultsResultLegacyEntities
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  location: string
  media_count: number
  name: string
  normal_followers_count: number
  pinned_tweet_ids_str: string[]
  possibly_sensitive: boolean
  profile_image_url_https: string
  profile_interstitial_type: string
  screen_name: string
  statuses_count: number
  translator_type: string
  verified: boolean
  want_retweets: boolean
  withheld_in_countries: any[]
}

export interface IListQuotedStatusResultResultCoreUserResultsResultLegacyEntities {
  description: IListQuotedStatusResultResultCoreUserResultsResultLegacyEntitiesDescription
}

export interface IListQuotedStatusResultResultCoreUserResultsResultLegacyEntitiesDescription {
  urls: any[]
}

export interface IListQuotedStatusResultResultUnmentionData {}

export interface IListQuotedStatusResultResultEditControl {
  edit_tweet_ids: string[]
  editable_until_msecs: string
  is_edit_eligible: boolean
  edits_remaining: string
}

export interface IListQuotedStatusResultResultViews {
  count: string
  state: string
}

export interface IListQuotedStatusResultResultLegacy {
  bookmark_count: number
  bookmarked: boolean
  created_at: string
  conversation_id_str: string
  display_text_range: number[]
  entities: IListQuotedStatusResultResultLegacyEntities
  favorite_count: number
  favorited: boolean
  full_text: string
  is_quote_status: boolean
  lang: string
  quote_count: number
  reply_count: number
  retweet_count: number
  retweeted: boolean
  user_id_str: string
  id_str: string
}

export interface IListQuotedStatusResultResultLegacyEntities {
  user_mentions: any[]
  urls: any[]
  hashtags: any[]
  symbols: any[]
}

export interface IListFeedbackInfo {
  feedbackKeys: string[]
}

export interface IListClientEventInfo {
  component: string
  element: string
  details: IListClientEventInfoDetails
}

export interface IListClientEventInfoDetails {
  timelinesDetails: IListClientEventInfoDetailsTimelinesDetails
}

export interface IListClientEventInfoDetailsTimelinesDetails {
  controllerData: string
}

export interface IListResponseObjects {
  feedbackActions: IListResponseObjectsFeedbackAction[]
}

export interface IListResponseObjectsFeedbackAction {
  key: string
  value: IListResponseObjectsFeedbackActionValue
}

export interface IListResponseObjectsFeedbackActionValue {
  feedbackType: string
  prompt: string
  confirmation: string
  childKeys?: string[]
  hasUndoAction: boolean
  confirmationDisplayType: string
  icon?: string
  clientEventInfo: IListResponseObjectsFeedbackActionValueClientEventInfo
}

export interface IListResponseObjectsFeedbackActionValueClientEventInfo {
  action: string
  component: string
  element: string
}
