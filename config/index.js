import { once } from 'lodash'
import { version } from '../package.json'

export const environment = process.env.NODE_ENV || 'development'
export const isTest = environment === 'test'
export const isDev = environment === 'development'
export const isProduction = environment === 'production'
export const onStagingAPI = process.env.API_HOST.includes('staging')

export const sentryConfig = {
  dsn: process.env.SENTRY_DSN_URL,
  enabled: isProduction || (isDev && process.env.ENABLE_SENTRY_IN_DEV),
  // release: current version from package.json + the BITRISE_BUILD_NUMBER if exists
  release: `hyloreactnative@${version}${process.env.BITRISE_BUILD_NUMBER ? '+' + process.env.BITRISE_BUILD_NUMBER : ''}`,
  // environment: indicates which API used
  environment: isDev || isTest
    ? 'local'
    : onStagingAPI
      ? 'staging'
      : 'production'
}

export const filestackKey = process.env.FILESTACK_API_KEY || process.env.FILEPICKER_API_KEY
export const logLevel = process.env.LOG_LEVEL
export const socketHost = process.env.SOCKET_HOST
export const host = process.env.HOST
export const slack = {
  clientId: process.env.SLACK_APP_CLIENT_ID
}
export const s3 = {
  bucket: process.env.AWS_S3_BUCKET,
  host: process.env.AWS_S3_HOST
}
export const google = {
  key: process.env.GOOGLE_BROWSER_KEY,
  clientId: process.env.GOOGLE_CLIENT_ID
}
export const facebook = {
  appId: process.env.FACEBOOK_APP_ID
}
export const segment = {
  writeKey: process.env.SEGMENT_KEY
}
export const intercom = {
  appId: process.env.INTERCOM_APP_ID
}
export const mixpanel = {
  token: process.env.MIXPANEL_TOKEN
}
export const mapbox = {
  token: process.env.MAPBOX_TOKEN
}

export const featureFlags = () => {
  if (!isTest) {
    return once(() =>
      Object.keys(process.env).reduce((flags, key) => {
        if (key.startsWith('FEATURE_FLAG_')) {
          flags[key.replace('FEATURE_FLAG_', '')] = process.env[key]
        }
        return flags
      }, {}))()
  } else {
    return window.FEATURE_FLAGS || {}
  }
}

const config = {
  environment,
  filestackKey,
  logLevel,
  host,
  slack,
  s3,
  google,
  facebook,
  segment,
  featureFlags,
  intercom,
  mixpanel,
  mapbox
}

if (!isTest) window.__appConfig = config

export default config
