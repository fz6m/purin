import 'server-only'
import { NextResponse } from 'next/server'
import { prisma } from '@purin/db'

const getList = async () => {
  try {
    const list = await prisma.list.findMany()
    return list
  } catch (e) {
    console.error('getList db error', e)
    return []
  }
}

export async function GET(_request: Request) {
  const list = await getList()
  return NextResponse.json({
    code: 0,
    data: list,
  })
}
