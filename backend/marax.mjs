import { Gpio } from 'onoff'
import SerialPort from 'serialport'
import { WebSocketServer } from 'ws'
import { logger } from './logger'

const port = process.env.PORT
const pin = process.env.PIN
const serial = process.env.SERIAL

const wss = new WebSocketServer({ port })
const pump = new Gpio(pin, 'in', 'both')
const serialport = new SerialPort(serial, { baudRate: 9600 })
const parser = serialport.pipe(new SerialPort.parsers.Readline())
let pumpRun = { started: 0, elapsed: 0, timestamp: 0 }

const broadcast = (event, value) => {
  const data = { timestamp: Date.now(), event, value }
  const message = JSON.stringify(data)
  logger(`Broadcasting to ${wss.clients.size} clients:`, data)

  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

pump.watch((error, _) => {
  if (error) {
    console.error(error)
    return
  }

  const timestamp = Date.now()
  const isNewRun = timestamp - pumpRun.timestamp > 1000
  const started = isNewRun ? timestamp : pumpRun.started
  const elapsed = Math.floor((timestamp - started) / 100) / 10
  const shouldBroadcast = isNewRun || elapsed > pumpRun.elapsed

  pumpRun = { started, elapsed, timestamp }

  if (shouldBroadcast) {
    broadcast('pump', pumpRun)
  }
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

process.on('SIGINT', () => {
  if (pump) {
    pump.unexport()
  }
  process.exit(0)
})
