// from https://github.com/mirrorz-org/mirrorz-help

import React from 'react'
import { avatar_base64 } from './avatar'
import { bg_base64 } from './backgroud'

interface DefaultProps {
  siteName: string
  domain?: string
}

export const Default = ({ siteName, domain }: DefaultProps) => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {bg_base64?.length ? (
        <img
          src={bg_base64}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.4,
            zIndex: -1,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#fff',
            zIndex: -1,
          }}
        />
      )}
      {!!domain && (
        <div
          style={{
            right: 64,
            bottom: 64,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: 28,
              letterSpacing: 0.1,
            }}
          >
            {`https://`}
          </span>
          <span
            style={{
              marginLeft: 1,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 0.1,
              color: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            {domain}
          </span>
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            borderRadius: '50%',
            borderWidth: 10,
            borderStyle: 'solid',
            borderColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <img style={{ width: 200, height: 200 }} src={avatar_base64} />
        </div>
      </div>
      <div
        lang="zh-CN"
        style={{
          display: 'flex',
          fontSize: 70,
          fontFamily: 'NotoSans SC',
          color: '#000',
          fontWeight: 800,
          marginLeft: 36,
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
        }}
      >
        {siteName}
      </div>
    </div>
  )
}
