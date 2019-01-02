import React, {Component} from 'react';
import EventEmitter from 'events';
import ReactDOM from "react-dom";

import LocalStorageClient from '../clients/local-storage-client';

import ThemeSwitchableComponent from './theme-switchable-component';

import * as moment from 'moment';

class TimeLineConfig extends ThemeSwitchableComponent{

    constructor(props){
        super();
        
        if(!props.isNew){
            
            this.state = {
                id: props.configId,
                userName : props.userName,
                maxTweets: props.maxTweets,
                limitDate: props.limitDate,
            };
        }else{
            this.state = {
                isNew: true,
                onSaveCallback: props.onSaveCallback
            };

            TimeLineConfig.timeLineConfigsEvent.addListener('save', async () => {
                
                var newConfig =  { 
                    userName: this.state.userName, 
                    maxTweets: this.state.maxTweets,
                    limitDate: this.state.limitDate
                }
                
                await this._localStorageClient.addTimeLineConfig(newConfig);

                this.state.onSaveCallback();
            })
        }



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
            TimeLineConfig.timeLineConfigsEvent.emit('swap-config', {currentId: this.state.id, swapId:  TimeLineConfig._configToSwap.state.id});
            TimeLineConfig.timeLineConfigsEvent.emit('swap-config', {currentId: TimeLineConfig._configToSwap.state.id, swapId: this.state.id});
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

        TimeLineConfig.timeLineConfigsEvent.addListener('swap-config', (swapTuple) => {
            
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
            
            TimeLineConfig.timeLineConfigsEvent.emit('swap-config', {currentId: this.state.id, swapId: nextConfig.id});
            TimeLineConfig.timeLineConfigsEvent.emit('swap-config', {currentId: nextConfig.id, swapId: this.state.id});
            TimeLineConfig.timeLineConfigsEvent.emit('scroll', nextConfig.id);
        }
        
        this.swapToPreviousConfig = e => this.swapToPreviousConfigHandler();

        this.swapToPreviousConfigHandler = async function(){
            var previousConfig = await this._localStorageClient.getPreviousTimeLineConfig(this.state.id);
            await this._localStorageClient.swapTimeLinesConfigs(this.state.id, previousConfig.id);
            
            TimeLineConfig.timeLineConfigsEvent.emit('swap-config', {currentId: this.state.id, swapId: previousConfig.id});
            TimeLineConfig.timeLineConfigsEvent.emit('swap-config', {currentId: previousConfig.id, swapId: this.state.id});
            TimeLineConfig.timeLineConfigsEvent.emit('scroll', previousConfig.id);

        }

        TimeLineConfig.timeLineConfigsEvent.addListener('scroll', (configId) => {
            if(configId != this.state.id)
            {
                return
            }
            
            this.scrollToThisConfig();
            
        })
        
        this.scrollToThisConfig = function(){
            var scrollContainer = this._timeLineConfigContainer.closest('.config-container-scroll');
            scrollContainer.scrollTo({ left: ( this._timeLineConfigContainer.offsetLeft  - 30), behavior: 'smooth' })
        }

        this.deleteConfig = e => this.deleteConfigHandler(e);

        this.deleteConfigHandler = async function(){
            await this._localStorageClient.deleteTimeLineConfig(this.state.id);
            this._timeLineConfigContainer.remove();
            TimeLineConfig.timeLineConfigsEvent.emit('update-index');
        }

        TimeLineConfig.timeLineConfigsEvent.addListener('update-index', ()=>{
            this.setIndex(this.state.id);
        })

    }

    async setupNextAndPrevious(configId){
        var nextConfig = await this._localStorageClient.getNextTimeLineConfig(configId);
        var previousConfig = await this._localStorageClient.getPreviousTimeLineConfig(configId);
        
        this.setState((state, props) => { 
            return { 
                hasNext: nextConfig ? true : false, 
                hasPrevious: previousConfig? true : false
            } 
        });
    }

    async setIndex(configId){
        var timelineIndex = await this._localStorageClient.getTimeLineConfigIndex(configId);
        var countConfigs = await this._localStorageClient.getCountTimeLinesConfigs();

        this.setState((state, props) => { 
            return { 
                index : timelineIndex, 
                total: countConfigs 
            } 
        });
    }

    async loadConfigData(configId){
        
        var config = await this._localStorageClient.getTimeLineConfig(configId);
 
        this.setState(config);

        await this.setupNextAndPrevious(configId);
        await this.setIndex(configId);
    }

    formatDate(date){
        return moment(date).format('YYYY-MM-DD');
    }

    componentWillMount(){
        this.setupNextAndPrevious(this.state.id);
        this.setIndex(this.state.id);
    }

    componentDidMount(){
        this._timeLineConfigContainer = ReactDOM.findDOMNode(this).closest('.time-line-config-container');
    }

    render(){
        return(
            <div id={this.state.id} 
                className="time-line-config" 
                onDragOver={this.onDragOver} 
                onDragEnd={this.onDragEnd}> 
                
                <div className="card card-body" draggable="true" >
                    {
                        !this.state.isNew &&
                        <div>
                            <div className="row time-line-config-header">
                                {this.state.hasPrevious ? <i className="fa fa-angle-left" onClick={this.swapToPreviousConfig}/> : <i/>}
                                <span> {this.state.index} / {this.state.total} </span>
                                {this.state.hasNext ? <i className="fa fa-angle-right" onClick={this.swapToNextConfig}/> : <i/>}
                                <i className="fa fa-times-circle" onClick={this.deleteConfig}></i>
                            </div>
                        </div>
                    }
                    
                    <div>
                        <div className="form-group floating-label" draggable="false">
                            <input  type="text" 
                                    className="form-control form-control-lg" 
                                    id="userName" 
                                    placeholder="UserName" 
                                    value={this.state.userName} 
                                    onChange={this.onChangeUserName}/>
                            
                            <label>UserName</label>
                        </div>

                        <div className="form-group floating-label" draggable="false">
                            <input  type="number" 
                                    className="form-control form-control-lg" 
                                    id="maxTweet" 
                                    placeholder="MaxTweet" 
                                    value={this.state.maxTweets}
                                    onChange={this.onChangeMaxTweets}/>
                            
                            <label>MaxTweets</label>
                        </div>

                        <div className="form-group floating-label" draggable="false">
                            <input  type="date" 
                                    className="form-control form-control-lg" 
                                    id="limitDateTweet" 
                                    placeholder="LimitDate" 
                                    value={this.formatDate( new Date(this.state.limitDate))}
                                    onChange={this.onChangeLimitDate}
                                    pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"/>
                            <label>LimitDate</label>
                        </div>
                    </div>
                </div>                
            </div>
        );
    }
}

TimeLineConfig._configToSwap = null;

TimeLineConfig.timeLineConfigsEvent = new EventEmitter();

export default TimeLineConfig;