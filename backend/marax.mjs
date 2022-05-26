import SerialPort from 'serialport'

function initMarax (serial, onNotify, baudRate = 9600) {
  const serialport = new SerialPort(serial, { baudRate })
  const marax = serialport.pipe(new SerialPort.parsers.Readline())

  marax.on('data', data => {
    onNotify(parseMetrics(data))
  })

  return { marax }
}

function parseMetrics (data) {
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

export { initMarax }
