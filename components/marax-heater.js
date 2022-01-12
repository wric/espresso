import { TopPanelItem } from './top-panel-item.js'

const MaraxHeater = ({ boost, isOn }) => (
  <TopPanelItem icon={<Zap fill={isOn ? '#ccc' : 'none'} />} value={boost} />
)

// From feather-icons
const Zap = ({ fill }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill={fill}
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'></polygon>
  </svg>
)

export { MaraxHeater }
