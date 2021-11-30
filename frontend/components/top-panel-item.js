const TopPanelItem = ({ icon, value }) => (
  <div className='item'>
    {icon}
    <span className='text'>{value}</span>

    <style jsx>{`
      .item {
        display: flex;
        align-items: center;
        border: none;
        border-radius: 0.5rem;
        bacskground-color: #eee;
      }

      .text {
        font-size: 0.75rem;
        font-weight: bold;
        margin-left: 0.5rem;
        color: #5b5b5b;
      }
    `}</style>
  </div>
)

export { TopPanelItem }
