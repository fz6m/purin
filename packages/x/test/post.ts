import axios from 'axios'
const list = require('./list.json')

const run = async () => {
  const res = await axios.post(
    `http://localhost:3000/api/v1/tweets`,
    {
      // list: list.a,
      list: list.b,
      ...require('./auth.json'),
    },
    {
      validateStatus: () => true,
    },
  )
  console.log('res.data: ', res.data)
}

run()
