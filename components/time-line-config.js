class TimeLineConfig extends React.Component{

    static _configToSwap = null;
    
    constructor(props){
        super();
        
        this.state = {
            id: props.configId,
            userName : props.userName,
            maxTweets: props.maxTweets,
            limitDate: props.limitDate,
            onDropCallback: props.onDropCallback
        };

        this._localStorageClient = new LocalStorageClient();
    }

    onDragOver = e => this.onDragOverHandler(e);
    
    onDragOverHandler = function(e)
    {
        var timeLineConfigCard = e.target.closest('.time-line-config');
        TimeLineConfig._configToSwap = this;
    }

    onDragEnd = e => this.onDragEndHandler(e);

    onDragEndHandler = async function(e)
    {
        var configs = await this._localStorageClient.getTimeLinesConfig();
        
        var currentDroppedConfigIndex = configs.findIndex(config => config.id == this.state.id);
        var configToSwapIndex = configs.findIndex(config => config.id == TimeLineConfig._configToSwap.state.id);

        var currentConfig = configs[currentDroppedConfigIndex];
        configs[currentDroppedConfigIndex] = configs[configToSwapIndex];
        configs[configToSwapIndex] = currentConfig;

        await this._localStorageClient.setIimeLinesConfig(configs);
            
        var swapState = TimeLineConfig._configToSwap.state;
        var currentConfigState = this.state;
        this.setState((state, props) => swapState );
        TimeLineConfig._configToSwap.setState((state, props) => currentConfigState );
    }

    onChangeUserName = e => this.onChangeUserNameHandler(e);
    
    onChangeUserNameHandler = function(e){
        var newUserName = e.target.value;
        this.setState(() => { 
            return { userName: newUserName } 
        }, () => this._localStorageClient.updateTimeLineConfig(this.state));
    }

    onChangeMaxTweets = e => this.onChangeMaxTweetsHandler(e);

    onChangeMaxTweetsHandler = function(e){
        var newMaxTweet = e.target.value;
        this.setState(() => { 
            return { maxTweets: newMaxTweet } 
        }, () => this._localStorageClient.updateTimeLineConfig(this.state));
    }

    onChangeLimitDate = e => this.onChangeLimitDateHandler(e);

    onChangeLimitDateHandler = function(e){
        var newLimitDateStr = e.target.value;
        var newLimitDate = moment(newLimitDateStr).toDate();
        var newLimitTime = newLimitDate.getTime();
        
        this.setState(() => { 
            return { limitDate: newLimitTime } 
        }, () => this._localStorageClient.updateTimeLineConfig(this.state));
    }

    formatDate(date){
        return moment(date).format('YYYY-MM-DD');
    }

    render(){
        return(
            <div id={this.state.id} 
                className="time-line-config" 
                onDragOver={this.onDragOver} 
                onDragEnd={this.onDragEnd}> 

                <div class="card card-body" draggable="true" >
                    <div className="form-group floating-label" draggable="false">
                        <input  type="text" 
                                className="form-control form-control-lg" 
                                id="userName" 
                                placeholder="UserName" 
                                value={this.state.userName} 
                                onChange={this.onChangeUserName}/>
                        
                        <label for="userName">UserName</label>
                    </div>

                    <div className="form-group floating-label" draggable="false">
                        <input  type="number" 
                                className="form-control form-control-lg" 
                                id="maxTweet" 
                                placeholder="MaxTweet" 
                                value={this.state.maxTweets}
                                onChange={this.onChangeMaxTweets}/>
                        
                        <label for="maxTweet">MaxTweets</label>
                    </div>

                    <div className="form-group floating-label" draggable="false">
                        <input  type="date" 
                                className="form-control form-control-lg" 
                                id="limitDateTweet" 
                                placeholder="LimitDate" 
                                value={this.formatDate( new Date(this.state.limitDate))}
                                onChange={this.onChangeLimitDate}
                                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"/>
                        <label for="limitDateTweet">LimitDate</label>
                    </div>
                </div>
                
            </div>
        );
    }
}