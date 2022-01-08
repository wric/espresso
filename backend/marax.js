import { Gpio } from 'onoff'
import SerialPort from 'serialport'
import { WebSocketServer } from 'ws'

const debug = process.env.DEBUG === 'true'
const port = process.env.PORT
const pin = process.env.PIN
const serial = process.env.SERIAL

let internalPumpState = { timestamp: 0, isOn: 0 }
let externalPumpState = { timestamp: 0, isOn: 0 }
const wss = new WebSocketServer({ port })

const broadcast = (event, value) => {
  const data = { timestamp: Date.now(), event, value }
  const message = JSON.stringify(data)
  log(`Broadcasting to ${wss.clients.size} clients:`, data)

  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

const pump = new Gpio(pin, 'in', 'both')
pump.watch((error, value) => {
  if (error) {
    console.error(error)
  } else {
    internalPumpState = { timestamp: Date.now(), isOn: value }
  }
})

const pumpEval = () => {
  if (internalPumpState.isOn === externalPumpState.isOn) {
    // State not changed, hence nothing to broadcast.
    return
  }

  if (internalPumpState.timestamp - externalPumpState.timestamp < 100) {
    // The magnetic field that triggers the reed switch is not consistent,
    // hence we add a short grace period before broadcasting.
    return
  }

  broadcast('pump', internalPumpState.isOn)
  externalPumpState = internalPumpState
}

const intervalId = setInterval(pumpEval, 20)

const serialport = new SerialPort(serial, { baudRate: 9600 })
const parser = serialport.pipe(new SerialPort.parsers.Readline())
parser.on('data', data => {
  broadcast('metric', parseMetrics(data))
})

const parseMetrics = data => {
  const metrics = data.split(',')
  return {
    timestamp: Date.now(),
    mode: metrics[0].slice(0, 1),
    version: metrics[0].slice(1),
    steam: Number(metrics[1]),
    steamTarget: Number(metrics[2]),
    boiler: Number(metrics[3]),
    boost: Number(metrics[4]),
    heatOn: Number(metrics[5][0])
  }
}

const log = (message, data = null) => {
  if (debug) {
    console.log(new Date().toISOString(), message, data)
  }
}

process.on('SIGINT', () => {
  if (pump) {
    pump.unexport()
  }
  process.exit(0)
})
