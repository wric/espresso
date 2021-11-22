import { MaraxTempGraph } from '../components/marax-temp-graph.js'
import { useMarax } from '../lib/hooks/use-marax.js'

const MaraxGraph = ({ maxAge = 120 }) => {
  const { timeserie } = useMarax(maxAge)
  return <MaraxTempGraph points={timeserie} maxAge={maxAge} />
}

export { MaraxGraph }
