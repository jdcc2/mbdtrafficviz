/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'
import bulma from 'bulma/css/bulma.css'
import MapWrapper from './MapWrapper.jsx'

class App extends Component {
    render () {
        return (
            <div className="container is-fluid">
                <h1 className="title">Traffic Jam Viewer</h1>
                    <MapWrapper/>
                </div>

        );
    }
}

export default App;
