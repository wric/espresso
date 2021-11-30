import { WithLayout } from '../components/hoc/with-layout.js'

const MyApp = ({ Component, pageProps }) => {
  return (
    <WithLayout>
      <Component {...pageProps} />
    </WithLayout>
  )
}

export default MyApp
