import { useCallback, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

const host = 'ws://raspberrypi:8085'

const initialState = {
  timestamp: 0,
  weight: 0,
  unit: 'g',
  status: 'disconnected'
}

const websocketFilter = message => message?.data !== undefined

const wilfaReducer = (message, state) => {
  if (!message?.data) {
    return state
  }

  const { event, value, timestamp } = JSON.parse(message.data)

  if (event === 'weight') {
    return { ...state, timestamp, weight: value }
  }

  if (event === 'event') {
    return { ...state, timestamp, unit: value }
  }

  if (event === 'status') {
    return { ...state, timestamp, status: value }
  }

  return state
}

const useWilfa = () => {
  const [state, setState] = useState(initialState)
  const { lastMessage, sendMessage } = useWebSocket(host, {
    filter: websocketFilter,
    share: true
  })

  useEffect(() => {
    const newState = wilfaReducer(lastMessage, state)
    setState(newState)
  }, [lastMessage])

  const tare = useCallback(() => {
    console.log('qwe')
    sendMessage('tare')
  }, [])

  return { state, tare }
}

export { useWilfa }
