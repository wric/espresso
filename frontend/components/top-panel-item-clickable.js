import { TopPanelItem } from './top-panel-item.js'

const TopPanelItemClickable = ({ icon, value, onClick, disabled }) => (
  <div className='item-clickable' onClick={onClick}>
    <TopPanelItem icon={icon} value={value} />

    <style jsx>{`
      .item-clickable {
        cursor: pointer;
        background-color: #eee;
        padding: 0.25rem 0.5rem;
        border-radius: 1000px;
        min-width: 8rem;
        display: flex;
        justify-content: center;
      }

      .item-clickable:hover {
        background-color: #e0e0e0;
      }
    `}</style>
  </div>
)

export { TopPanelItemClickable }
