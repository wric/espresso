import { NodeBleWrapper } from 'node-ble-wrapper'
import { WebSocketServer } from 'ws'
import { initMarax } from './marax.mjs'
import { initPump } from './pump.mjs'
import { writeMessage } from './store.mjs'
// import { logger } from './logger'
import { parse, write } from './wilfa.mjs'

const scaleUuid = process.env.SCALE_UUID || '08:56:87:15:27:0B'
const port = process.env.WS_PORT || 8086
const pin = process.env.PIN || 24
const serial = process.env.SERIAL || '/dev/serial0'

async function initEsprexxo () {
  const wss = new WebSocketServer({ port })
  wss.on('connection', wssHandleConnection)

  const onEvent = source => data => {
    const message = { timestamp: Date.now(), source, data }
    writeMessage(message)

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message))
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

  const { pump } = initPump(pin, onEvent('pump'))
  const { marax } = initMarax(serial, onEvent('marax'))
  const { getCharacteristics, shutdown } = await NodeBleWrapper(
    scaleUuid,
    event => onEvent('scale')(parse(event))
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
