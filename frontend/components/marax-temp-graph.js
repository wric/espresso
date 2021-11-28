import useMeasure from 'react-use-measure'

const minMax = (min, max) => value => Math.max(Math.min(value, min), max)

const MaraxTempGraph = ({ points, maxAge, xLines = 12, yLines = 6 }) => {
  const [ref, { width }] = useMeasure()

  const maxTemp = 130
  const padleft = 0
  const padright = 0
  const padtop = 5
  const graphWidth = width - padleft - padright
  const rows = yLines - 1
  const gridWidth = Math.max(graphWidth / xLines, 1)

  const xLabels = [...Array(xLines + 1)].map((_, i) => i * gridWidth + padleft)
  const xMin = padleft
  const xMax = padleft + graphWidth
  const xStep = graphWidth / maxAge
  const xStepTime = maxAge / xLines

  const yLabels = [...Array(yLines)].map((_, i) => i * gridWidth + padtop)
  const yMin = padtop + rows * gridWidth
  const yMax = padtop
  const yStep = gridWidth / 20
  const height = yMin + 25

  return (
    <>
      <svg
        ref={ref}
        className='graph'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g className='grid x-grid'>
          {xLabels.map(x => (
            <line key={`xgrid_${x}`} x1={x} x2={x} y1={yMin} y2={yMax}></line>
          ))}
        </g>

        <g className='labels x-labels'>
          {xLabels.map((x, i) =>
            i !== xLabels.length - 1 ? (
              <text key={`xscale_${x}`} x={x + 2} y={yMin - 2}>
                {i * xStepTime} s
              </text>
            ) : null
          )}
        </g>

        <g className='grid y-grid'>
          {yLabels.map(y => (
            <line key={`ygrid_${y}`} x1={xMin} x2={xMax} y1={y} y2={y}></line>
          ))}
        </g>

        <g className='labels y-labels'>
          {yLabels.map((y, i) =>
            i < yLabels.length - 1 ? (
              <text key={`yscale_${y}`} x={xMax - 2} y={y + 10}>
                {maxTemp - i * 20}°
              </text>
            ) : (
              ''
            )
          )}
        </g>

        <polyline
          className='steam-target'
          points={points
            .map(
              point =>
                `${padleft + point.index * xStep},${minMax(
                  yMin,
                  yMax
                )(padtop + (maxTemp - point.steamTarget) * yStep)}`
            )
            .join(' ')}
        />

        <polyline
          className='steam'
          points={points
            .map(
              point =>
                `${padleft + point.index * xStep},${minMax(
                  yMin,
                  yMax
                )(padtop + (maxTemp - point.steam) * yStep)}`
            )
            .join(' ')}
        />

        <polyline
          className='boiler'
          points={points
            .map(
              point =>
                `${padleft + point.index * xStep},${minMax(
                  yMin,
                  yMax
                )(padtop + (maxTemp - point.boiler) * yStep)}`
            )
            .join(' ')}
        />
      </svg>
      <style jsx>{`
        .graph {
          width: 100%;
          height: ${height}px;
          min-width: 100px;
        }

        .grid {
          stroke: #eaeaea;
          strokewidth: 1;
        }

        .labels {
          font-family: Arial;
          font-size: 0.625rem;
          fill: #aaa;
          kerning: 1;
        }

        .x-labels {
          text-anchor: start;
        }

        .y-labels {
          text-anchor: end;
        }

        .boiler {
          stroke: red;
          fill: none;
          stroke-width: 2;
        }

        .steam {
          stroke: #5b5b5b;
          fill: none;
          stroke-width: 2;
        }

        .steam-target {
          stroke: #5b5b5b;
          opacity: 25%;
          fill: none;
          stroke-width: 2;
        }
      `}</style>
    </>
  )
}

export { MaraxTempGraph }
