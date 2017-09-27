import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './styles/index.css'
import App from './layouts/App'
import registerServiceWorker from './registerServiceWorker'

import { initStore } from './redux/store'

let store = initStore()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
registerServiceWorker()
