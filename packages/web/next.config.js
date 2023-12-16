// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isDev && isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

module.exports = nextConfig
