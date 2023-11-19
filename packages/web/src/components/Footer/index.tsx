import cx from 'classnames'
import ghIcon from '@/assets/icons/github.svg'
import Image from 'next/image'

export const Footer = () => {
  return (
    <div
      className={cx(
        // 'bg-[#f7fafc]',
        'w-full mb-10 mt-5',
        'flex items-center justify-center',
      )}
    >
      <a
        className={cx(
          'p-2',
          'rounded-full',
          'cursor-pointer',
          'hover:bg-gray-200 transition-all duration-300',
          'no-underline',
          'active:scale-95',
          'flex items-center justify-center shrink-0',
        )}
        href="https://github.com/fz6m/purin"
        target="_blank"
      >
        <Image
          width={24}
          height={24}
          src={ghIcon.src}
          className={cx('translate-y-[2px]')}
          alt="GitHub"
        />
      </a>
    </div>
  )
}
