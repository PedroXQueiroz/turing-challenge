import React, {Component} from 'react';
import EventEmitter from 'events';

import LocalStorageClient from '../clients/local-storage-client';

import ThemeSwitchableComponent from './theme-switchable-component';

import * as moment from 'moment';

class TimeLineConfig extends ThemeSwitchableComponent{

    constructor(props){
        super();
        
        this.state = {
            id: props.configId,
            userName : props.userName,
            maxTweets: props.maxTweets,
            limitDate: props.limitDate,
        };
        
        this._localStorageClient = new LocalStorageClient();

        this.onDragOver = e => this.onDragOverHandler(e);
    
        this.onDragOverHandler = function(e)
        {
            var timeLineConfigCard = e.target.closest('.time-line-config');
            TimeLineConfig._configToSwap = this;
        }
    
        this.onDragEnd = e => this.onDragEndHandler(e);

        this.onDragEndHandler = async function(e)
        {
            await this._localStorageClient.swapTimeLinesConfigs(this.state.id, TimeLineConfig._configToSwap.state.id);
            TimeLineConfig.swapTimeLinesConfigsEvent.emit('swap-config', {currentId: this.state.id, swapId:  TimeLineConfig._configToSwap.state.id});
            TimeLineConfig.swapTimeLinesConfigsEvent.emit('swap-config', {currentId: TimeLineConfig._configToSwap.state.id, swapId: this.state.id});
        }
    
        this.onChangeUserName = e => this.onChangeUserNameHandler(e);
        
        this.onChangeUserNameHandler = function(e){
            var newUserName = e.target.value;
            this.setState(() => { 
                return { userName: newUserName } 
            }, () => this._localStorageClient.updateTimeLineConfig(this.state));
        }
    
        this.onChangeMaxTweets = e => this.onChangeMaxTweetsHandler(e);
    
        this.onChangeMaxTweetsHandler = function(e){
            var newMaxTweet = e.target.value;
            this.setState(() => { 
                return { maxTweets: newMaxTweet } 
            }, () => this._localStorageClient.updateTimeLineConfig(this.state));
        }
    
        this.onChangeLimitDate = e => this.onChangeLimitDateHandler(e);
    
        this.onChangeLimitDateHandler = function(e){
            var newLimitDateStr = e.target.value;
            var newLimitDate = moment(newLimitDateStr).toDate();
            var newLimitTime = newLimitDate.getTime();
            
            this.setState(() => { 
                return { limitDate: newLimitTime } 
            }, () => this._localStorageClient.updateTimeLineConfig(this.state));
        }

        TimeLineConfig.swapTimeLinesConfigsEvent.addListener('swap-config', (swapTuple) => {
            
            var currentId = swapTuple.currentId;
            var swapId = swapTuple.swapId;
            
            if(currentId != this.state.id)
            {
                return;
            }
            
            this.loadConfigData(swapId);
        });
       
        this.swapToNextConfig = e => this.swapToNextConfigHandler();

        this.swapToNextConfigHandler = async function(){
            var nextConfig = await this._localStorageClient.getNextTimeLineConfig(this.state.id);
            await this._localStorageClient.swapTimeLinesConfigs(this.state.id, nextConfig.id);
            
            TimeLineConfig.swapTimeLinesConfigsEvent.emit('swap-config', {currentId: this.state.id, swapId: nextConfig.id});
            TimeLineConfig.swapTimeLinesConfigsEvent.emit('swap-config', {currentId: nextConfig.id, swapId: this.state.id});
        }
        
        this.swapToPreviousConfig = e => this.swapToPreviousConfigHandler();

        this.swapToPreviousConfigHandler = async function(){
            var previousConfig = await this._localStorageClient.getPreviousTimeLineConfig(this.state.id);
            await this._localStorageClient.swapTimeLinesConfigs(this.state.id, previousConfig.id);
            
            TimeLineConfig.swapTimeLinesConfigsEvent.emit('swap-config', {currentId: this.state.id, swapId: previousConfig.id});
            TimeLineConfig.swapTimeLinesConfigsEvent.emit('swap-config', {currentId: previousConfig.id, swapId: this.state.id});
        }

    }

    async setupNextAndPrevious(configId){
        var nextConfig = await this._localStorageClient.getNextTimeLineConfig(configId);
        var previousConfig = await this._localStorageClient.getPreviousTimeLineConfig(configId);
        
        this.setState((state, props) => { 
            return { 
                hasNext: nextConfig ? true : false, 
                hasPrevious: previousConfig? true : false
            } 
        }, () => console.log(this.state));
    }

    async loadConfigData(configId){
        
        var config = await this._localStorageClient.getTimeLineConfig(configId);
        this.setState(config);

        await this.setupNextAndPrevious(configId)
    }

    formatDate(date){
        return moment(date).format('YYYY-MM-DD');
    }

    componentWillMount(){
        this.setupNextAndPrevious(this.state.id);
    }

    render(){
        return(
            <div id={this.state.id} 
                className="time-line-config" 
                onDragOver={this.onDragOver} 
                onDragEnd={this.onDragEnd}> 
                
                <div class="card card-body" draggable="true" >
                    
                    <div class="row time-line-config-header top">
                        {this.state.hasPrevious ? <i class="fa fa-angle-left" onClick={this.swapToPreviousConfig}/> : <i/>}
                        <span>Index</span>
                        {this.state.hasNext ? <i class="fa fa-angle-right" onClick={this.swapToNextConfig}/> : <i/>}
                    </div>
                    
                    <div>
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

                    <div class="row time-line-config-header side">
                        {this.state.hasPrevious ? <i class="fa fa-angle-up" onClick={this.swapToPreviousConfig}/> : <i/>}
                        <span>Index</span>
                        {this.state.hasNext ? <i class="fa fa-angle-down" onClick={this.swapToNextConfig}/> : <i/>}
                    </div>
                
                </div>                
            </div>
        );
    }
}

TimeLineConfig._configToSwap = null;

TimeLineConfig.swapTimeLinesConfigsEvent = new EventEmitter();

export default TimeLineConfig;