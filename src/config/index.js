export const environment = process.env.NODE_ENV || 'development'
export const isDev = __DEV__ && environment !== 'test'
export const isProduction = environment === 'production'
