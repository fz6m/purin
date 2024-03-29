import cx from 'classnames'
import Image from 'next/image'
import xIcon from '@/assets/icons/x.svg'
import { Footer } from '@/components/Footer'
import { FloatButtons } from '@/components/FloatButtons'
import { isDateValid, isListValid } from '@/service/schema'
import { redirect } from 'next/navigation'
import { Contents } from '@/components/Contents'
// import { Suspense } from 'react'
// import { CardioLoading } from '@/components/Contents/CardioLoading'

// FIXME: when we do not visit the web site for a while
//        on the next visit `Suspense` will never be resolved 🤬
export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams?: Record<string, any>
}) {
  const reqDate = searchParams?.date || ''
  const reqList = searchParams?.list || ''

  let shouldRedirect = false
  if (reqDate?.length) {
    const isValid = isDateValid(reqDate)
    if (!isValid) {
      shouldRedirect = true
    }
  }
  if (reqList?.length) {
    const isValid = isListValid(reqList)
    if (!isValid) {
      shouldRedirect = true
    }
  }
  if (shouldRedirect) {
    redirect('/')
  }

  return (
    <div className={cx('min-h-screen w-full', 'overflow-x-hidden')}>
      <div
        className={cx(
          'w-full',
          'px-36 s:px-5',
          'mt-16 s:mt-6',
          'flex flex-col',
        )}
      >
        <h1
          className={cx(
            'm-0 p-0',
            'text-2xl font-bold',
            'cursor-default',
            'flex items-center',
            'font-play',
          )}
        >
          <span>{`Purin`}</span>
          <Image
            src={xIcon.src}
            width={26}
            height={26}
            alt="X"
            className={cx(
              'mx-2 mt-1',
              'flex items-center justify-center shrink-0',
              'max-w-full',
            )}
          />
          <span>{`Explorer`}</span>
        </h1>
        {/* FIXME: if use RSC suspense, it will never get resolved */}
        {/* <Suspense fallback={<CardioLoading />}> */}
        <Contents list={reqList} date={reqDate} />
        {/* </Suspense> */}
      </div>
      <Footer />
      <FloatButtons />
    </div>
  )
}
