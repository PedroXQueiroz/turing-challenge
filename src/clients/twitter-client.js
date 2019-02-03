class TwitterClient{
    
    constructor(){
        this._twitterProxyHost = window.location.protocol + '//' + window.location.hostname;
    }

    async getTweets(userName, tweetsCount){
        
        var getTweetsUrl = this._twitterProxyHost + ':7890/1.1/statuses/user_timeline.json?count=' + tweetsCount + '&screen_name=' + userName + '&tweet_mode=extended'

        var getTweetsRequest = new Request(getTweetsUrl);

        var tweets = await fetch(getTweetsRequest).then(response => response.json());

        return tweets;
    }

    async getProfile(userName)
    {
        var profileUrl = this._twitterProxyHost + ':7890/1.1/users/show.json?&screen_name=' + userName;

        var profileRequest = new Request(profileUrl);

        var profileData = await fetch(profileRequest).then(response => response.json());

        return profileData;
    }
}

export default TwitterClient;