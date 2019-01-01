import React, {Component} from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Link, HashRouter } from "react-router-dom";

import ThemeSwitchableComponent from './theme-switchable-component';
import TweetsGrid from './tweets-grid';
import TweetsGridConfig from './tweets-grid-config';

import LocalStorageClient from '../clients/local-storage-client';

class App extends ThemeSwitchableComponent{
    
    constructor(){
        super();

        this._localStorageClient = new LocalStorageClient();
    }

    async componentWillMount(){
        
        var theme = await this._localStorageClient.getTheme();
        ThemeSwitchableComponent.switchTheme(theme);
    }
    
    render(){
        return(
        <HashRouter>
            <div>
                <nav class="app-header">
                    <div>
                        <Link to="">
                            <h2> Tweets </h2>
                        </Link>
                        
                        <Link to="config">
                            <button className="btn btn-default btn-sm edit-grid-button" href="/config">
                                <span className="fa fa-cog"></span> Edit
                            </button>
                        </Link>
                    </div>
                </nav>
                
                <div className="page-container">                    
                    <Route path="" exact={true} component={TweetsGrid} />
                    <Route path="/config" exact={true} component={TweetsGridConfig} />
                </div>
            </div>
        </HashRouter>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.querySelector('.app'));