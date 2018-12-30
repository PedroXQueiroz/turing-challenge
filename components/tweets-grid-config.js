
class TweetsGridConfig extends React.Component{
    
    constructor(){
        super();

        this.state = {
            timeLinesConfig:[]
        };
        this._localStorageClient = new LocalStorageClient();
    }

    async componentWillMount(){
        var configs = await this._localStorageClient.getTimeLinesConfig();
        this.setState((state, props) => {
            return { timeLinesConfig: configs };
        });
    }

    render(){
        return (
            <div className="container">
                <div className="row">
                    <h2> Configurations</h2>
                </div>

                <div class="row"> <h3> TimeLines </h3> </div>

                <div className="config-container row">
                    {this.state.timeLinesConfig.map(config => 
                        <div className="time-line-config-container">
                            <TimeLineConfig
                                configId={config.id}
                                userName={config.userName}
                                maxTweets={config.maxTweets}
                                limitDate={config.limitDate}
                            /> 
                        </div>
                    )}
                </div>

            </div>
        );
    }
}

ReactDOM.render(<TweetsGridConfig />, document.querySelector('TweetsGridConfig'));