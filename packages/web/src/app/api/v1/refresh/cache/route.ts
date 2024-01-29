import { apiSend } from '@/utils/api'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

interface IParams {
  path?: string
}

export async function POST(request: NextRequest) {
  let json: IParams = {}
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
