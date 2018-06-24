import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import BeWellAway from './components/BeWellAway/BeWellAway'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<BeWellAway />, document.getElementById('root'))
registerServiceWorker()
