const writerObject =
  '/org/bluez/hci0/dev_08_56_87_15_27_0B/service0017/char0018'
const weightObject =
  '/org/bluez/hci0/dev_08_56_87_15_27_0B/service0017/char001b'

const events = [
  { name: 'g', write: 'f51100', read: 'fa0400' },
  { name: 'oz', write: 'f51101', read: 'fa0401' },
  { name: 'lb', write: 'f51102', read: 'fa0402' },
  { name: 'tare', write: 'f510', read: '' },
  { name: 'disconnect', write: '', read: 'fa03' }
]

async function write (characteristics, message) {
  const event = events.find(event => event.name === message.value)
  const writer = characteristics.find(
    characteristic => characteristic.helper.object === writerObject
  )

  if (event && writer) {
    const buffer = Buffer.from(event.write, 'hex')
    writer.writeValue(buffer)
  }
}

function parse ({ timestamp, source, value }) {
  const parsed =
    source === weightObject ? bufferToWeight(value) : bufferToEvent(value)

  return {
    timestamp,
    source,
    value: parsed
  }
}

function toSigned2Complement (hex) {
  const value = parseInt(hex, 16)
  return (value & 0x8000) > 0 ? value - 0x10000 : value
}

function bufferToWeight (buffer) {
  const hex = buffer.toString('hex').slice(4, 8)
  return toSigned2Complement(hex)
}

function bufferToEvent (buffer) {
  const hex = buffer.toString('hex')
  return events.find(unit => unit.read === hex)?.name
}

export { write, parse }
