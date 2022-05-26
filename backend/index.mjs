import { WebSocketServer } from 'ws'
// import { logger } from './logger'
import { parse, write } from './wilfa.mjs'
import { initPump } from './pump.mjs'
import { initMarax } from './marax.mjs'
import { NodeBleWrapper } from 'node-ble-wrapper'

const scaleUuid = process.env.SCALE_UUID || '08:56:87:15:27:0B'
const port = process.env.WS_PORT || 8086
const pin = process.env.PIN || 24
const serial = process.env.SERIAL || '/dev/serial0'

async function initEsprexxo () {
  const wss = new WebSocketServer({ port })
  wss.on('connection', wssHandleConnection)

  const broadcast = source => value => {
    const data = { timestamp: Date.now(), source, value }
    const message = JSON.stringify(data)

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(message)
      }
    })
  }

  function wssHandleConnection (ws) {
    // TODO: add pong heartbeats
    ws.on('message', wsHandleMessage)
  }

  function wsHandleMessage (data) {
    const message = JSON.parse(data)
    if (message.target === 'scale') {
      write(getCharacteristics(), message)
    }
  }

  const { pump } = initPump(pin, broadcast('pump'))
  const { marax } = initMarax(serial, broadcast('marax'))
  const { getCharacteristics, shutdown } = await NodeBleWrapper(
    scaleUuid,
    event => broadcast('scale')(parse(event))
  )

  process.on('SIGINT', () => {
    console.log('SIGINT >> shutdown graceful')
    if (pump) pump.unexport()
    if (shutdown) shutdown()

    process.exit(0)
  })

  while (true) {
    await sleep(100)
  }
}

function sleep (ms) {
  return new Promise(_ => setTimeout(_, ms))
}

initEsprexxo()
