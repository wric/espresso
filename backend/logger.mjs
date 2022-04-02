const debug = process.env.DEBUG === 'true'

export const logger = (message, data = null) => {
  if (debug) {
    console.log(new Date().toISOString(), message, data)
  }
}
