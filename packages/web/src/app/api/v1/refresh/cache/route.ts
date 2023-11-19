import { apiSend } from '@/utils/api'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.search)
  const path = searchParams.get('path')
  if (path?.length) {
    revalidateTag(path)
    return apiSend.success()
  }
  return apiSend.error('path is required')
}
