
import { AuthProvider, ThemeProvider } from '@/contexts'
import 'semantic-ui-css/semantic.min.css'
import '@/styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function App(props) {

  const { Component, pageProps } = props

  return(
  
    <Provider store={store}>
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
    </Provider>

  ) 
}