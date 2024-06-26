const regex = new RegExp(/at \w*/g)
const getFun = (str: string) => str.match(regex)!![1]

const logger =
  (func: (...args: any) => void) =>
  (...val: any) => {
    const now = new Date(Date.now()).toISOString()
    const errorFunction = getFun(new Error().stack!)
    func(`[${now}](${errorFunction}): `, ...val)
  }

export const log = logger(console.log)
export const error = logger(console.error)
export const info = logger(console.info)
export const warn = logger(console.warn)
