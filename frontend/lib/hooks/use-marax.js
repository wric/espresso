import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

const host = 'ws://raspberrypi:8086'

const initialState = {
  timestamp: 0,
  boiler: null,
  steam: null,
  steamTarget: null,
  timeserie: [],
  pump: 0
}

const websocketFilter = message => message?.data !== undefined

const maraxReducer = (maxAge, wsMessage, state) => {
  if (!wsMessage?.data) {
    return state
  }

  const { event, value: data, timestamp } = JSON.parse(wsMessage.data)
  if (event === 'pump') {
    return { ...state, pump: data }
  }

  const second = Math.floor(timestamp / 1000)
  const { existed, timeserie } = state.timeserie.reduce(
    ({ existed, timeserie }, point) => {
      const index = second - point.second

      if (index > maxAge) {
        return { existed, timeserie }
      }

      timeserie.push({ ...point, index })

      return index === 0 ? { existed: true, timeserie } : { existed, timeserie }
    },
    { existed: false, timeserie: [] }
  )

  if (!existed) {
    const newPoint = {
      second,
      index: 0,
      boiler: data.boiler,
      steam: data.steam,
      boilerY: 50 - Math.min(Math.max(data.boiler - 85, 0), 50),
      steamY: 50 - Math.min(Math.max(data.steam - 85, 0), 50),
      steamTarget: data.steamTarget
    }
    timeserie.push(newPoint)
  }

  return {
    ...data,
    timeserie
  }
}

const useMarax = (timeserieMaxAge = 60) => {
  const [state, setState] = useState(initialState)
  const { lastMessage } = useWebSocket(host, {
    filter: websocketFilter,
    share: true
  })

  useEffect(() => {
    const newState = maraxReducer(timeserieMaxAge, lastMessage, state)
    setState(newState)
  }, [lastMessage])

  return state
}

export { useMarax }
