import { Settings } from 'react-feather'
import { TopPanelItem } from './top-panel-item.js'

const MaraxConfiguration = ({ mode, version }) => (
  <TopPanelItem icon={<Settings size='18' />} value={`${mode}.${version}`} />
)

export { MaraxConfiguration }
