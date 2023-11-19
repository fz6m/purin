import 'server-only'
import { prisma } from '@purin/db'
import { apiSend } from '@/utils/api'
import { NextRequest } from 'next/server'

const getList = async () => {
  try {
    const list = await prisma.list.findMany()
    return list
  } catch (e) {
    console.error('getList db error', e)
    return []
  }
}

export async function GET(_request: NextRequest) {
  const list = await getList()
  return apiSend.success(list)
}
