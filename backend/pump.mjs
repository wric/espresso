import { Gpio } from 'onoff'

const newRunWaitMs = 1000

function initPump (pin, onNotify) {
  let pumpRun = { started: 0, elapsed: 0, timestamp: 0 }
  const pump = new Gpio(pin, 'in', 'both')

  pump.watch(error => {
    if (error) {
      console.error(error)
      return
    }

    const timestamp = Date.now()
    const isNewRun = timestamp - pumpRun.timestamp > newRunWaitMs
    const started = isNewRun ? timestamp : pumpRun.started
    const elapsed = Math.floor((timestamp - started) / 100) / 10
    const shouldBroadcast = isNewRun || elapsed > pumpRun.elapsed

    pumpRun = { started, elapsed, timestamp }

    if (shouldBroadcast) {
      onNotify(pumpRun)
    }
  })

  return { pump }
}

export { initPump }
