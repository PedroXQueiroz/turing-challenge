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
            <div className="time-lines-container-scroll">
            
                <div className="time-lines-container">
                    
                        {this.state.timeLinesConfig.map((entry) => 
                            
                            <TimeLine
                                key= {entry.id}
                                timeLineId = {entry.id}
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