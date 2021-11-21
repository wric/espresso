import noble from '@abandonware/noble'
import { WebSocketServer } from 'ws'

const debug = process.env.DEBUG === 'true'
const port = process.env.PORT

const events = [
  { name: 'g', write: 'f51100', read: 'fa0400' },
  { name: 'oz', write: 'f51101', read: 'fa0401' },
  { name: 'lb', write: 'f51102', read: 'fa0402' },
  { name: 'tare', write: 'f510', read: '' }
]

let writer = null
let weight = null
const wss = new WebSocketServer({ port })

wss.on('connection', ws => {
  ws.send(statusMessage())
  ws.on('message', data => {
    const message = data.toString()
    const event = events.find(event => event.name === message)
    log('Received message:', { message })

    if (event && writer) {
      writer.write(Buffer.from(event.write, 'hex'), false)
    }
  })
})

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

noble.on('stateChange', async state => {
  log('State changed.', { state })
  if (state === 'poweredOn') {
    await noble.startScanningAsync(['fee7'], false)
  } else {
    await noble.stopScanningAsync()
  }
})

noble.on('discover', async peripheral => {
  log('Dicovered peripheral.')
  await noble.stopScanningAsync()

  peripheral.once('disconnect', async error => {
    log('Peripheral disconnected:', { error })
    writer = null
    weight = null
    broadcast('status', wilfaStatus())
    await noble.startScanningAsync(['fee7'], false)
  })

  await peripheral.connectAsync()
  log('Peripheral connected.')

  const [service] = await peripheral.discoverServicesAsync(['ffb0'])
  log('Service found.')

  const [eventChar, weightChar] = await service.discoverCharacteristicsAsync([
    'ffb1',
    'ffb2'
  ])
  log('Characteristics found.')

  writer = eventChar
  broadcast('status', wilfaStatus())

  eventChar.on('data', buffer => {
    const event = bufferToEvent(buffer)
    if (event) {
      broadcast('event', event)
    }
  })
  log('eventChar set up.')

  weightChar.on('data', buffer => {
    const newWeight = bufferToWeight(buffer)
    if (weight !== newWeight) {
      weight = newWeight
      broadcast('weight', weight)
    }
  })
  log('weightChar set up.')
  log('Characteristic set up.')
})

const toSigned2Complement = hex => {
  const value = parseInt(hex, 16)
  return (value & 0x8000) > 0 ? value - 0x10000 : value
}

const bufferToWeight = buffer => {
  const hex = buffer.toString('hex').slice(4, 8)
  return toSigned2Complement(hex)
}

const bufferToEvent = buffer => {
  const hex = buffer.toString('hex')
  return events.find(unit => unit.read === hex)?.name
}

const log = (message, data = null) => {
  if (debug) {
    console.log(new Date().toISOString(), message, data)
  }
}

const statusMessage = () =>
  JSON.stringify({
    timestamp: Date.now(),
    event: 'status',
    value: wilfaStatus()
  })

const wilfaStatus = () => (writer ? 'connected' : 'disconnected')

process.on('SIGINT', () => {
  if (wss) {
    broadcast('status', wilfaStatus())
  }
  process.exit(0)
})
