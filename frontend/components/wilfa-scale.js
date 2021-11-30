import { Download } from 'react-feather'
import { TopPanelItemClickable } from './top-panel-item-clickable.js'

const WilfaScale = ({ weight, onClick, isConnected }) => {
  const value = isConnected ? `${formatWeight(weight)} g` : 'Offline'
  return (
    <TopPanelItemClickable
      icon={<Download size='18' />}
      value={value}
      disabled={!isConnected}
      onClick={onClick}
    />
  )
}

const formatWeight = weight => ((weight || 0) / 10).toFixed(1)

export { WilfaScale }
