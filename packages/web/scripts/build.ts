import 'zx/globals'

const run = async () => {
  await $`cd ../.. && pnpm build:deps`
  await $`pnpm build`
}

run()
