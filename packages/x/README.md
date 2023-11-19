# purin

X (Twitter) list API for getting the top tweets of the day.

### Install

```bash
  pnpm add purin
```

### Usage

```ts
import { getListHotTweets } from 'purin'

const result = await getListHotTweets({
  list: '...',
  auth: { ... }
})
```

### License

MIT
