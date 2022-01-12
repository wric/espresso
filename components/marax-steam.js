import { Wind } from 'react-feather'
import { TopPanelItem } from './top-panel-item.js'

const MaraxSteam = ({ steam }) => (
  <TopPanelItem icon={<Wind size='18' />} value={`${steam}°`} />
)

export { MaraxSteam }
