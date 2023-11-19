import { getListHotTweets } from '../src'
const list = require('./list.json').a

const run = async () => {
  const res = await getListHotTweets({
    list,
    auth: require('./auth.json')
  })
  console.log('res: ', res);
}

run()
