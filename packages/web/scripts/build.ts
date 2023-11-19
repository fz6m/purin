import 'zx/globals'

const run = async () => {
  await $`cd ../.. && pnpm build`
}

run()
