// https://github.com/vercel/react-tweet/blob/main/apps/next-app/app/api/tweet/%5Bid%5D/route.ts
import { NextResponse } from 'next/server'
import { getTweet } from 'react-tweet/api'
import cors from 'edge-cors'

type RouteSegment = { params: { id: string } }

export async function GET(req: Request, { params }: RouteSegment) {
  try {
    const tweet = await getTweet(params.id)
    return cors(
      req,
      NextResponse.json({ data: tweet ?? null }, { status: tweet ? 200 : 404 })
    )
  } catch (error: any) {
    return cors(
      req,
      NextResponse.json(
        { error: error.message ?? 'Bad request.' },
        { status: 400 }
      )
    )
  }
}