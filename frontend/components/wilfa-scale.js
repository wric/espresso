import { Download } from 'react-feather'
import { useWilfa } from '../lib/hooks/use-wilfa.js'
import { MaraxStats } from './marax-stats.js'

const WilfaScale = () => {
  const { state, tare } = useWilfa()
  const weight = (state?.weight || 0) / 10
  const value = `${weight.toFixed(1)} g`

  if (state.status === 'disconnected') {
    return <MaraxStats icon={<Download size='18' />} value={'off'} />
  }

  return (
    <>
      <div className='timer' onClick={tare}>
        <MaraxStats icon={<Download size='18' />} value={value} />
      </div>
      <style jsx>{`
        .timer {
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export { WilfaScale }
