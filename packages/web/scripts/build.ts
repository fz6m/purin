import 'zx/globals'

const run = async () => {
  await $`cd ../.. && pnpm build:deps`
  await $`cd ./packages/web && pnpm build`
}

run()
