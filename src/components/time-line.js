import React, {Component} from 'react';

import Tweet from './tweet';
import TwitterClient from '../clients/twitter-client';

class TimeLine extends Component{
    
    constructor(props){
        super();
        
        this.state = {
            userName: props.userName,
            isEditing: props.isEditing,
            maxTweets: props.maxTweets,
            limitDate: props.limitDate,
            tweets: []
        }

        this._twitterClient = new TwitterClient();
    }

    async componentWillMount(){
        var tweets = await this._twitterClient.getTweets(this.state.userName, this.state.maxTweets);
        this.setState((state, props) => {
            return {
                tweets: tweets
            };
        })
    }

    getMediasArray(tweet)
    {
        if(tweet.extended_entities)
        {
            return tweet.extended_entities.media || []
        }
        
        if( tweet._entities)
        {
            return tweet._entities || [];
        }

        return [];
    }
    
    render(){
        return(
            <div className="col-lg-4">
                <h3>{this.state.userName}</h3>

                <div className="tweets-container">
                    
                    {this.state.tweets
                        .filter((tweet) => {
                            var tweetDate = new Date(tweet.created_at);
                            var limitDate = new Date(this.state.limitDate);

                            var tweetTime = tweetDate.getTime();
                            var limitTime = limitDate.getTime();

                            return tweetTime > limitDate;
                        })
                        .map(tweet =>
                        <Tweet
                            userName = { this.state.userName }
                            tweetId = { tweet.id_str }
                            content={ tweet.text || tweet.full_text } 
                            createdAt={ tweet.created_at } 
                            medias = { this.getMediasArray(tweet) }
                            hashtags = { tweet.entities.hashtags } 
                            >
                        </Tweet>
                    )}
                    
                </div>
            </div>
        )
    }
}

export default TimeLine;