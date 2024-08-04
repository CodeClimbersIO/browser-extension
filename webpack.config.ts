import { join } from 'path'
import * as webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import { CODE_CLIMBER_API_URL, CODE_CLIMBER_URL } from './src/constants'

type BrowserTypes = 'chrome' | 'firefox' | 'edge'

const graphicsFolder = join(__dirname, 'graphics')
const srcFolder = join(__dirname, 'src')
const htmlFolder = join(srcFolder, 'html')
const manifestFolder = join(srcFolder, 'manifests')
const browserPolyfill = join(
  __dirname,
  'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
)

const getConfigByBrowser = (
  isProd: boolean,
  browser: BrowserTypes,
): webpack.Configuration => {
  const cfg: webpack.Configuration = {
    devtool: 'source-map',
    entry: {
      background: [join(srcFolder, 'background.ts')],
      codeclimbersScript: [join(srcFolder, 'codeclimbersScript.ts')],
      devtools: [join(srcFolder, 'devtools.ts')],
      options: [join(srcFolder, './routes/options.tsx')],
      popup: [join(srcFolder, './routes/popup.tsx')],
    },
    // mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: join(__dirname, 'dist', browser),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: graphicsFolder, to: 'graphics' },
          { from: htmlFolder },
          // TODO: Create a mechanism to have a firefox manifest vs chrome
          {
            from: join(manifestFolder, `${browser}.json`),
            to: 'manifest.json',
          },
          {
            from: browserPolyfill,
            to: 'public/js/browser-polyfill.min.js',
          },
        ],
      }),
      // eslint-disable-next-line
      new webpack.DefinePlugin({
        ['process.env.API_URL']: JSON.stringify(CODE_CLIMBER_API_URL),
        ['process.env.CODECLIMBERS_URL']: JSON.stringify(CODE_CLIMBER_URL),
        ['process.env.CURRENT_USER_API_URL']: JSON.stringify('/users/current'),
        ['process.env.HEARTBEAT_API_URL']: JSON.stringify(
          '/users/current/heartbeats',
        ),
        ['process.env.NODE_ENV']: JSON.stringify(
          isProd ? 'production' : 'development',
        ),
        ['process.env.SUMMARIES_API_URL']: JSON.stringify(
          '/users/current/summaries',
        ),
      }),
    ],
    resolve: {
      alias: {
        '@src': srcFolder,
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  }
  return cfg
}
export default (
  env: Record<string, string>,
  arv: Record<string, string>,
): webpack.Configuration[] => {
  const isProd = arv.mode !== 'development'
  return [
    getConfigByBrowser(isProd, 'chrome'),
    getConfigByBrowser(isProd, 'firefox'),
    getConfigByBrowser(isProd, 'edge'),
  ]
}
