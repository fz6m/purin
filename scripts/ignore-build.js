#!/usr/bin/env node

// https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel
// https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE

const SKIP_CI = ['no ci', 'skip ci']

if (SKIP_CI.some((i) => commitMessage?.includes(i))) {
  console.log(`🛑 - Build cancelled`)
  process.exit(0)
}

process.exit(1)
