// components/Layout.js
const Layout = props => <>
  <div className="page-layout">
    {props.children}
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
        background-color: #F9F9F9;
      }
      h1 {
        font-weight: 700;
      }
      p {
        margin-bottom: 10px;
      }
    `}</style>
  </div>
</>

export { Layout }
