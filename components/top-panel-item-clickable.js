import { TopPanelItem } from './top-panel-item.js'

const TopPanelItemClickable = ({ icon, value, onClick, disabled }) => (
  <div className='item-clickable' onClick={onClick} disabled={disabled}>
    <TopPanelItem icon={icon} value={value} />

    <style jsx>{`
      .item-clickable {
        cursor: pointer;
        background-color: #eee;
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 1000px;
        min-width: 8rem;
        display: flex;
        justify-content: center;
        color: #333;
      }

      .item-clickable:hover:not([disabled]) {
        background-color: #e0e0e0;
      }

      .item-clickable[disabled] {
        cursor: not-allowed;
      }
    `}</style>
  </div>
)

export { TopPanelItemClickable }
