import argv from 'minimist'
const options = argv(process.argv.slice(2))
export const isDevelopment = Boolean(options.development)
export const isProduction = Boolean(options.production)
