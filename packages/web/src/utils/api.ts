import { NextResponse } from 'next/server'
import 'server-only'

export const apiSend = {
  error: (msg: string) => {
    return NextResponse.json(
      {
        code: -1,
        message: msg,
      },
      {
        status: 400,
      },
    )
  },
  success: (data?: any, msg?: string) => {
    return NextResponse.json({
      code: 0,
      message: msg || 'successful',
      data,
    })
  },
}
