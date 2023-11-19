import { NextResponse } from 'next/server'

// https://stackoverflow.com/questions/75362636/how-can-i-get-the-url-pathname-on-a-server-component-next-js-13
export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-url', request.url)

  const res = NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  })

  return res
}
