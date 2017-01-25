/**
 * Created by jd on 22-1-17.
 */
import React, {Component} from 'react'
import bulma from 'bulma/css/bulma.css'
import MapGL from './MapGL.jsx'

class App extends Component {
    render () {
        return (
            <div className="container">
                <h1 className="title">Traffic Jam Viewer</h1>
                <div className="columns">
                    <div className="column is-three-quarters">
                        <MapGL/>
                    </div>
                    <div className="column">
                        Menu stuffs
                    </div>
                </div>

            </div>

        );
    }
}

export default App;
