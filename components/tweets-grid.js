class TweetsGrid extends React.Component {
    
    constructor(){
        super();
        this._twitterClient = new TwitterClient();
        
        this.state = { 
            userTweetsDict:[
                {
                    userName:'MakeSchool',
                    tweets: [] 
                },{
                    userName: 'newsycombinator',
                    tweets: []
                },{
                    userName: 'ycombinator',
                    tweets: []
                }
            ]
        };


    }
    
    async componentWillMount(){
        
        for(var entryIndex = 0; entryIndex < this.state.userTweetsDict.length; entryIndex++)
        {
            var currentEntry = this.state.userTweetsDict[entryIndex];
            
            var tweets = await this._twitterClient.getTweets(currentEntry.userName, 30);
            this.setState((state, props) => {
                state.userTweetsDict[entryIndex].tweets = tweets;
                return state;
            })
        }
        
    }
    
    render() {
        
        return (
            <div className="container tweets-container">
                
                {this.state.userTweetsDict.map((entry) => 
                    
                    <TweetsColumn
                        userName = {entry.userName}>
                        
                        {
                            entry.tweets.map( tweet => 
                                <Tweet 
                                    content={tweet.text} 
                                    createdAt={tweet.created_at} 
                                    link={ !tweet.entities.urls[0] ? '' : tweet.entities.urls[0].expanded_url} > 
                                </Tweet>
                            )
                        }

                    </TweetsColumn>
                    
                )}

            </div>
        );
    };
}