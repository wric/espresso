const WithLayout = ({ children }) => (
  <div className='page'>
    <div className='content'>{children}</div>

    <style jsx global>{`
      html {
        height: 100%;
      }

      body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-weight: 400;
        line-height: 1.8;
        color: #333;
        font-family: sans-serif;
        background-color: #f9f9f9;
      }

      h1 {
        font-weight: 700;
      }

      p {
        margin-bottom: 10px;
      }
    `}</style>

    <style jsx>{`
      .page {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 2rem 4rem;
      }

      .content {
        width: 100%;
        max-width: 60rem;
      }
    `}</style>
  </div>
)

export { WithLayout }
