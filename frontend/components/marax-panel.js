import {
  Activity,
  Crosshair,
  GitPullRequest,
  Power,
  Settings,
  Thermometer,
  Wind,
  Zap
} from 'react-feather'
import { useMarax } from '../lib/hooks/use-marax.js'
import { MaraxStats } from './marax-stats.js'

const MaraxPanel = () => {
  const state = useMarax(1)
  const isConnected = true

  if (!isConnected) {
    return <MaraxStats icon={<Power size='18' />} value={'Powered off'} />
  }

  return (
    <>
      <MaraxStats icon={<Thermometer size='18' />} value={`${state.boiler}°`} />
      <MaraxStats icon={<Wind size='18' />} value={`${state.steam}°`} />
      <MaraxStats
        icon={<Crosshair size='18' />}
        value={`${state.steamTarget}°`}
      />
      <MaraxStats icon={<Zap size='18' />} value={state.boost} />
      <MaraxStats
        icon={<Activity size='18' />}
        value={state.heatOn ? 'on' : 'off'}
      />
      <MaraxStats
        icon={<Settings size='18' />}
        value={state.mode === 'C' ? 'coffee' : 'vapour'}
      />
      <MaraxStats icon={<GitPullRequest size='18' />} value={state.version} />
    </>
  )
}

export { MaraxPanel }
