import { MaraxBoiler } from '../components/marax-boiler.js'
import { MaraxConfiguration } from '../components/marax-configuration.js'
import { MaraxTempGraph } from '../components/marax-graph.js'
import { MaraxHeater } from '../components/marax-heater.js'
import { MaraxSteamTarget } from '../components/marax-steam-target.js'
import { MaraxSteam } from '../components/marax-steam.js'
import { MaraxTimer } from '../components/marax-timer.js'
import { TopPanel } from '../components/top-panel.js'
import { WilfaScale } from '../components/wilfa-scale.js'
import { useMarax } from '../lib/hooks/use-marax.js'
import { useWilfa } from '../lib/hooks/use-wilfa.js'

const TIMESERIE_AGE = 120

const Index = () => {
  const marax = useMarax(TIMESERIE_AGE)
  const { state: wilfa, tare } = useWilfa()

  return (
    <>
      <TopPanel>
        <div className='left'>
          <WilfaScale
            weight={wilfa.weight}
            isConnected={wilfa.status !== 'disconnected'}
            onClick={tare}
          />
          <MaraxTimer />
        </div>

        <div className='right'>
          <MaraxBoiler boiler={marax.boiler} />
          <MaraxSteam steam={marax.steam} />
          <MaraxSteamTarget steamTarget={marax.steamTarget} />
          <MaraxHeater boost={marax.boost} isOn={marax.heatOn} />
          <MaraxConfiguration mode={marax.mode} version={marax.version} />
        </div>
      </TopPanel>

      <MaraxTempGraph points={marax.timeserie} maxAge={TIMESERIE_AGE} />

      <style jsx>{`
        .left {
          display: flex;
          gap: 1rem;
        }

        .right {
          display: flex;
          gap: 2rem;
        }
      `}</style>
    </>
  )
}

export default Index
