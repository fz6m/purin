import axios from 'axios'
const list = require('./list.json')

const run = async () => {
  const res = await axios.post(
    `http://localhost:3000/api/v1/tweets/update`,
    // `https://purin-web.vercel.app/api/v1/tweets/update`,
    {
      token: list.token,
      // list: list.a,
      // list: list.b,
      ...require('./auth.json'),
    },
    {
      validateStatus: () => true,
    }
  )
  // console.log('res: ', res);
  console.log('res.data: ', res.data)
}

run()
