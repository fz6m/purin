import { Default } from './component/template'
import { meta } from '../src/constants/metadata'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import path from 'path'
import fs from 'fs-extra'
import * as Log from 'next/dist/build/output/log'

const VENDOR_PATH = path.join(__dirname, './vendors')
const NOTO_FONT_PATH = path.join(VENDOR_PATH, 'Noto_Sans_SC')
const NOTO_FONTS = {
  regular: path.join(NOTO_FONT_PATH, 'NotoSansSC-Regular.otf'),
  medium: path.join(NOTO_FONT_PATH, 'NotoSansSC-Medium.otf'),
  bold: path.join(NOTO_FONT_PATH, 'NotoSansSC-Bold.otf'),
}
const OUTPUT_PATH = path.join(__dirname, '../public/og.png')

interface IOgOpions<T> {
  template: (props: T) => JSX.Element
  props: T
  id: string
  outputPath: string
}

async function generateOpengraph<T = any>({
  template,
  props,
  id,
  outputPath,
}: IOgOpions<T>) {
  Log.info(
    `[OG] Cache miss for open graph image "${id}" from ./node_modules/.cache/`
  )

  const [notoSansRegularData, notoSansBoldData, notoSansMediumData] =
    await Promise.all([
      fs.readFile(NOTO_FONTS.regular),
      fs.readFile(NOTO_FONTS.bold),
      fs.readFile(NOTO_FONTS.medium),
    ])
  const svg = await satori(template(props), {
    embedFont: true,
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'NotoSans SC',
        data: notoSansRegularData,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'NotoSans SC',
        data: notoSansMediumData,
        weight: 500,
        style: 'normal',
      },
      {
        name: 'NotoSans SC',
        data: notoSansBoldData,
        weight: 700,
        style: 'normal',
      },
    ],
  })

  const pngBuffer = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  })
    .render()
    .asPng()

  return fs.writeFile(outputPath, pngBuffer)
}

const run = async () => {
  await generateOpengraph({
    template: Default,
    props: {
      siteName: meta.title,
    },
    id: 'default',
    outputPath: OUTPUT_PATH,
  })
  // TODO: compress
}

run()
