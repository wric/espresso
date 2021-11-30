import { Thermometer } from 'react-feather'
import { TopPanelItem } from './top-panel-item.js'

const MaraxBoiler = ({ boiler }) => (
  <TopPanelItem icon={<Thermometer size='18' />} value={`${boiler}°`} />
)

export { MaraxBoiler }
