/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'

import MapGL from './MapGL.jsx'

class App extends Component {
    render () {
        return (
            <div>
                <h1>Traffic Jam Viewer</h1>
                <MapGL/>
            </div>

        );
    }
}

export default App;