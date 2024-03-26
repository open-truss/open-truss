import type { AppProps } from 'next/app'

import '../styles.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />
}
