'use client'

import styles from './index.module.scss'
import cx from 'classnames'

export const CardioLoading = () => {
  return (
    <div className={cx(styles.cardio,
      'w-full min-h-[50vh]',
      'flex justify-center items-center'
    )}>
      <svg
        className={styles.cardio_container}
        x="0px"
        y="0px"
        viewBox="0 0 50 31.25"
        height="31.25"
        width="50"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          className={styles.cardio_track}
          strokeWidth="4"
          fill="none"
          pathLength="100"
          d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
        />
        <path
          className={styles.cardio_car}
          strokeWidth="4"
          fill="none"
          pathLength="100"
          d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
        />
      </svg>
    </div>
  )
}
