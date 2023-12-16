const isProd = process.env.NODE_ENV === 'production'

export const meta = {
  title: 'Purin X Explorer',
  description: 'X(Twitter) list collector',
  author: 'fz6m',
  keywords: ['X', 'Twitter', 'list', 'collector', 'explorer'].join(','),
  // FIXME: nextjs cannot auto add production domain as prefix, it will use preview env domain only
  og_image: isProd ? 'https://purin.sakina.moe/og.png' : '/og.png',
} as const
