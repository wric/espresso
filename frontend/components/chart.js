// Most code taken from:
// https://francoisromain.medium.com/smooth-a-svg-path-with-functional-programming-1b9876b8bf7e
// https://codepen.io/francoisromain/pen/XabdZm

const smoothing = 0.001

const xLabels = width => height => {
  const interval = width / 6
  return [
    { label: '0', x: 0 * interval, y: height - 5 },
    { label: '10', x: 1 * interval, y: height - 5 },
    { label: '20', x: 2 * interval, y: height - 5 },
    { label: '30', x: 3 * interval, y: height - 5 },
    { label: '40', x: 4 * interval, y: height - 5 },
    { label: '50', x: 5 * interval, y: height - 5 },
    { label: '60', x: 6 * interval, y: height - 5 },
  ]
};

const yLabels = width => height => temps => {
  const interval = height / (temps.length + 1)
  // console.log({interval, temps, height})
  return [
    { label: '-', x: 0, y: height - 5 },
    ...temps.map((temp, i) =>
      ({ label: `${temp}`, x: 5, y: height - (interval * (i + 1)) })
    )
  ]
}


const Label = (lbl) =>
  <text
    x={lbl.x}
    y={lbl.y}
    style={{ fill: '#ccc', fontFamily: 'Helvetica', fontSize: '0.5rem' }}>
    {lbl.label}
  </text>

export const Chart = ({ points, width, height }) => {
  const temps = [...new Set(points.map(([_, y]) => y))]
  const graphHeight = height
  const graphWidth = width

  const yMin = Math.min(...temps) - 1
  const yMax = Math.max(...temps) + 1
  // console.log({ temps, yMin, yMax })
  // console.log(Math.min(temps))
  const pointsPositions = pointsPositionsCalc(points, graphWidth, graphHeight, { yMin, yMax, xMin: 0, xMax: 200 })
  const bezierCommandCalc = bezierCommand(controlPoint(line, smoothing))
  const path = svgPath(pointsPositions, bezierCommandCalc, graphHeight);
  // const circles = pointsPositions.map(Circle)
  // console.log(path)
  // const lbl = xLabels(graphWidth)(height).map(label)
  const xlbl = xLabels(graphWidth)(height).map(Circle)
  const ylbl = yLabels(graphWidth)(graphHeight)(temps).map(Label)

  return <>
    <svg viewBox={`0 0 ${width} ${height}`} version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d={path} />
      {/* {circles} */}
      {xlbl}
      {ylbl}
    </svg>

    <style jsx>{`
      path {
        stroke: #B4DC7F;
        stroke-width: 2;
        fill-opacity: 0;
        stroke-opacity: 0.8;
      }
    `}</style>
  </>
}

const Circle = ({ x, y }, i) => <>
  <circle
    key={`circle-${i}`}
    cx={x}
    cy={y}
    r="1.5"
    className="svg-circles"
  />
  <style jsx>{`
    circle {
      fill: #ddd;
    }
  `}</style>
</>

const map = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

const pointsPositionsCalc = (points, width, h, options) => points.map(e => {
  const x = map(e[0], options.xMin, options.xMax, 0, width)
  const y = map(e[1], options.yMin, options.yMax, h, 0)
  return [x, y]
})

const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

const controlPoint = (line, smooth) => (current, previous, next, reverse) => {
  const p = previous || current
  const n = next || current
  const l = line(p, n)
  const angle = l.angle + (reverse ? Math.PI : 0)
  const length = l.length * smooth
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

const bezierCommand = (controlPoint) => (point, i, a) => {
  const cps = controlPoint(a[i - 1], a[i - 2], point)
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
  const close = i === a.length - 1 ? ' z' : ''
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
  // return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`
}

const svgPath = (points, command, height) => {
  const paths = points.reduce((acc, e, i, a) => {
    const path = i === 0
      ? `M ${0},${height - a[a.length - 1][1]}`
      // : `${acc} ${command(e, i, a)}`
      : `${command(e, i, a)}`
    return [...acc, path]
  }, [])
  // console.log(paths)
  return paths.join(' ')
}

