import { apiSend } from '@/utils/api'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  let json: Record<string, any> = {}
  try {
    json = await request.json()
  } catch {
    return apiSend.error('invalid json')
  }
  const path = json?.path
  if (path?.length) {
    revalidatePath(path)
    return apiSend.success()
  }
  return apiSend.error('path is required')
}
