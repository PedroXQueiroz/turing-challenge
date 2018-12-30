class TimeLine extends React.Component{
    
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
    
    render(){
        return(
            <div className="col-md-4">
                <h3>{this.state.userName}</h3>

                <div className="tweetsContainer">
                    
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
                            content={tweet.text} 
                            createdAt={tweet.created_at} 
                            link={ !tweet.entities.urls[0] ? '' : tweet.entities.urls[0].expanded_url} >
                        </Tweet>
                    )}
                    
                </div>
            </div>
        )
    }
}