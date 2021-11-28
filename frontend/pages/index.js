import { MaraxGraph } from '../components/marax-graph.js'
import { MaraxPanel } from '../components/marax-panel.js'
import { MaraxTimer } from '../components/marax-timer.js'
import { WilfaScale } from '../components/wilfa-scale.js'

const Index = () => {
  return (
    <>
      <div className='index'>
        <div className='info'>
          <WilfaScale />
          <MaraxTimer />
          <MaraxPanel />
        </div>
        <MaraxGraph />
      </div>

      <style jsx>{`
        .index {
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 2rem 4rem;
        }

        .info {
          width: 100%;
          max-width: 60rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
      `}</style>
    </>
  )
}

export default Index