import { Clock } from 'react-feather'
import useTimer from '../lib/hooks/use-timer.js'
import { TopPanelItemClickable } from './top-panel-item-clickable.js'

const MaraxTimer = () => {
  const {
    timer,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleReset
  } = useTimer(0)

  const handleClick = () => {
    if (isActive && isPaused) {
      handleReset()
      return
    }

    if (isPaused) {
      handleReset()
      return
    }

    if (isActive && !isPaused) {
      handlePause()
      return
    }

    if (!isActive && !isPaused) {
      handleStart()
    }
  }

  return (
    <TopPanelItemClickable
      icon={<Clock size='18' />}
      value={`${timer.toFixed(1)} s`}
      onClick={handleClick}
    />
  )
}

export { MaraxTimer }
