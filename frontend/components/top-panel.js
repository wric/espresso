const TopPanel = ({ children }) => (
  <div className='top-panel'>
    {children}

    <style jsx>{`
      .top-panel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
    `}</style>
  </div>
)

export { TopPanel }
