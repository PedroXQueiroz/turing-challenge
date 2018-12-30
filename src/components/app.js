import React, {Component} from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

import TweetsGrid from './tweets-grid';
import TweetsGridConfig from './tweets-grid-config';

class App extends Component{
    render(){
        return(
        <BrowserRouter>
            <div>
                <nav>
                    <Link to="/">
                        <h2> Tweets </h2>
                    </Link>
                    
                    <Link to="/config">
                        <button className="btn btn-default btn-sm edit-grid-button" href="/config">
                            <span className="fa fa-cog"></span> Edit
                        </button>
                    </Link>
                </nav>
                <div>
                        <Switch>
                            <Route path="/" exact={true} component={TweetsGrid} />
                            <Route path="/config" component={TweetsGridConfig} />
                        </Switch>
                </div>
            </div>
        </BrowserRouter>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.querySelector('.app'));