import { useRef, useState } from 'react'

// Credit: https://dev.to/abdulbasit313/how-to-develop-a-stopwatch-in-react-js-with-custom-hook-561b
const useTimer = (initialState = 0.0) => {
  const [timer, setTimer] = useState(initialState)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const countRef = useRef(null)

  const startTime = () => {
    countRef.current = setInterval(() => {
      setTimer(timer => timer + 0.1, 2)
    }, 100)
  }

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
    startTime()
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
    startTime()
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }

  return {
    timer,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleReset
  }
}

export default useTimer
