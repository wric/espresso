import { Crosshair } from 'react-feather'
import { TopPanelItem } from './top-panel-item.js'

const MaraxSteamTarget = ({ steamTarget }) => (
  <TopPanelItem icon={<Crosshair size='18' />} value={`${steamTarget}°`} />
)

export { MaraxSteamTarget }
