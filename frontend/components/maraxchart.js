const normalize = (range, minY) => value =>
  range - (Math.max(minY, value) - minY) + 1

const normalizePoint = (range, minY) => point => ({
  ...point,
  normalizedBoiler: normalize(range, minY)(point.boiler),
  normalizedSteam: normalize(range, minY)(point.steam),
  normalizedSteamTarget: normalize(range, minY)(point.steamTarget),
})

export const MaraxChart = ({ width, minY, maxY, data }) => {
  const range = maxY - minY
  const columnData = data.map(normalizePoint(range, minY))

  return <>
    <div className="graph">
      {columnData.map(Column(range))}
    </div>
    <style jsx>{`
      .graph {
        display: grid;
        grid-template-columns: repeat(${width}, 1fr);
        grid-column-gap: 0rem;
      }
    `}</style>
  </>
}

const Column = range => (point) => {
  const { timestamp,
    normalizedBoiler,
    normalizedSteam,
    normalizedSteamTarget
  } = point

  return <>
    <div key={timestamp} className="column">
      {[...Array(range)].map((_, i) =>
        <div key={`${timestamp}-${i}`} className="square">
          <div className="content">
            <div className="dot" />
          </div>
        </div>
      )}</div>

    <style jsx>{`
      .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dot {
        width: 0.25rem;
        height: 0.25rem;
      }

      .square {
        width: 1rem;
        height: 1rem;
        position: relative;
      }

      .square:nth-child(${normalizedSteamTarget}) .dot  {
        background-color: #555;
      }

      .square:nth-child(${normalizedSteam}) {
        background-color: #FF6600;
      }

      .square:nth-child(${normalizedBoiler}) {
        background-color: #FF6600;
      }

      .square:not(:first-child) {
        margin-top: 0px;
      })
    `}</style>
  </>
}