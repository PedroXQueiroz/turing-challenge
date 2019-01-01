import React, {Component} from 'react';
import ReactDOM from "react-dom";
import EventEmitter from 'events';

import Tweet from './tweet';

import TwitterClient from '../clients/twitter-client';
import LocalStorageClient from '../clients/local-storage-client';

class TimeLine extends Component{
    
    constructor(props){
        super();
        
        this.state = {
            timeLineId : props.timeLineId,
            userName: props.userName,
            isEditing: props.isEditing,
            maxTweets: props.maxTweets,
            limitDate: props.limitDate,
            tweets: []
        }

        this._twitterClient = new TwitterClient();
        this._localStorageClient = new LocalStorageClient()

        this.onTouchStart = e => this.onTouchStartHandler(e);
        this.onTouchMove = e => this.onTouchMoveHandler(e);
        this.onTouchEnd = e => this.onTouchEndHandler(e);

        TimeLine.swipeEvent.addListener('swipe', (swipeToTimeLineId) => {
            
            if(swipeToTimeLineId != this.state.timeLineId)
            {
                return;
            }
            
            this.swipeToThisTimeLine();
        })
    }
    
    swipeToThisTimeLine(){
        this._scrollContainer.scrollTo({ left: this._timeLineElement.offsetLeft - 30, behavior: 'smooth' });
    }

    onTouchStartHandler(e){
        this.initialXPosition = e.touches[0].clientX;
    }
    
    onTouchMoveHandler(e){
        this.lastXPosition = e.touches[0].clientX;
    }

    async onTouchEndHandler(e){
        var motion = this.lastXPosition - this.initialXPosition;

        var absoluteMotion = Math.abs(motion);

        var motionLimit = ( window.innerWidth * 25 ) / 100;

        //the movement has traveled more than 75% of the screen
        if(absoluteMotion > motionLimit)
        {
            var timeLineToSwipe = null;
            
            //the slide went to the right
            if( motion > 0 ) 
            {
                timeLineToSwipe = await this._localStorageClient.getPreviousTimeLineConfig(this.state.timeLineId);
            }else{                
                timeLineToSwipe = await this._localStorageClient.getNextTimeLineConfig(this.state.timeLineId);
            }

            if(timeLineToSwipe)
            {
                console.log('swipping');
                TimeLine.swipeEvent.emit('swipe', timeLineToSwipe.id);
            }
        }

    }

    async componentWillMount(){
        var tweets = await this._twitterClient.getTweets(this.state.userName, this.state.maxTweets);
        this.setState((state, props) => {
            return {
                tweets: tweets
            };
        })
    }

    componentDidMount(){
        this._timeLineElement = ReactDOM.findDOMNode(this);
        this._scrollContainer = this._timeLineElement.closest('.time-lines-container');
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
            <div className="col-lg-4" 
                onTouchStart={this.onTouchStart} 
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}>
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

TimeLine.swipeEvent = new EventEmitter();

export default TimeLine;