import React, {Component} from 'react';
import ReactDOM from "react-dom";

import TimeLine from './time-line';
import TwitterClient from '../clients/twitter-client';
import LocalStorageClient from '../clients/local-storage-client';

class TweetsGrid extends Component {
    
    constructor(){
        super();
        this._twitterClient = new TwitterClient();
        
        this._localStorageClient = new LocalStorageClient();

        this.state = {
            isEditing: false,
            timeLinesConfig: []
        };
    }
    
    async componentWillMount(){
        var configs = await this._localStorageClient.getTimeLinesConfig();
        this.setState(() => {
            return { timeLinesConfig: configs };
        })
    }

    render() {
        
        return (
            <div className="container tweets-container">
                <div className="row edition-painel">
                    <a className="btn btn-default btn-sm edit-grid-button" href="/grid-config">
                        <span className="fa fa-cog"></span> Edit
                    </a>
                </div>
                
                <div className="row">
                    {this.state.timeLinesConfig.map((entry) => 
                        
                        <TimeLine
                            userName = {entry.userName}
                            maxTweets = {entry.maxTweets}
                            isEditing = {this.state.isEditing} 
                            limitDate = {entry.limitDate}>
                        </TimeLine>
                        
                    )}
                </div>
            </div>
        );
    };
}

export default TweetsGrid;

ReactDOM.render(<TweetsGrid />, document.querySelector('TweetsGrid'));
