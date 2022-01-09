import { throttle } from 'lodash'
import { Gpio } from 'onoff'
import SerialPort from 'serialport'
import { WebSocketServer } from 'ws'

const debug = process.env.DEBUG === 'true'
const port = process.env.PORT
const pin = process.env.PIN
const serial = process.env.SERIAL

const wss = new WebSocketServer({ port })
const pump = new Gpio(pin, 'in', 'both')
const serialport = new SerialPort(serial, { baudRate: 9600 })
const parser = serialport.pipe(new SerialPort.parsers.Readline())
let pumpRun = { started: 0, updated: 0 }

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

const updatePump = () => {
  const now = Date.now()

  pumpRun = {
    started: now - pumpRun.updated > 1000 ? now : pumpRun.started,
    updated: now
  }

  broadcast('pump', pumpRun)
}

pump.watch((error, _) => {
  if (error) {
    console.error(error)
    return
  }

  throttle(updatePump, 200, { leading: true, trailing: true })
})

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
