import React, {Component} from 'react';
import ReactDOM from "react-dom";

import LocalStorageClient from '../clients/local-storage-client';

import TimeLineConfig from './time-line-config';
import ThemeSwitchableComponent from './theme-switchable-component';

class TweetsGridConfig extends Component{
    
    constructor(){
        super();

        this.state = {
            timeLinesConfig:[]
        };
        
        this._localStorageClient = new LocalStorageClient();

        this.changeTheme = e => this.changeThemeHandler(e);

        this.onSave = e => this.onSaveCallback();

        this.saveTimeLineConfig = e => this.saveTimeLineConfigHandler();
    }

    async componentWillMount(){
        
        var configs = await this._localStorageClient.getTimeLinesConfig();
        this.setState((staten, props) => {
            return { timeLinesConfig: configs };
        });
    }

    saveTimeLineConfigHandler(){
        TimeLineConfig.timeLineConfigsEvent.emit('save');
        TimeLineConfig.timeLineConfigsEvent.emit('update-index');
    }

    async onSaveCallback(){
        
        var configs = await this._localStorageClient.getTimeLinesConfig();
        this.setState((staten, props) => {
            return { timeLinesConfig: configs };
        });
    }

    async changeThemeHandler(ev){
        
        var selectedTheme = ev.target.value;
        
        ThemeSwitchableComponent.switchTheme(selectedTheme);
        await this._localStorageClient.setTheme(selectedTheme);
    }

    render(){
        return (
            <div class="config-page">
                <div>
                    <h2> Configurations</h2>
                    
                    <h3> Theme </h3>
                    
                    <div class="form-group col-md-6">
                        <select class="form-control" onChange={this.changeTheme}>
                            <option value="minimalist" selected={ThemeSwitchableComponent.currentTheme == 'minimalist'}> minimalist </option>
                            <option value="ocean" selected={ThemeSwitchableComponent.currentTheme == 'ocean'}> ocean </option>
                            <option value="dark" selected={ThemeSwitchableComponent.currentTheme == 'dark'}> dark </option>
                        </select>
                    </div>
                    
                    <hr/>
                    
                    <h3> TimeLines </h3>
                    
                    <div className="config-container-scroll">
                        
                        {this.state.timeLinesConfig.map((config, index) => 
                            <div className="time-line-config-container">
                                <TimeLineConfig
                                    key={config.id}
                                    configId={config.id}
                                    userName={config.userName}
                                    maxTweets={config.maxTweets}
                                    limitDate={config.limitDate}
                                /> 
                            </div>
                        )}
                        
                    </div>

                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-timeline-modal"> Add TimeLine </button>
                </div>

                <div className="modal fade add-timeline-modal" id="add-timeline-modal" role="dialog">
                    <div className="modal-dialog">
                        <div class="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> New TimeLine </h5>
                            </div>

                            <TimeLineConfig 
                                isNew = {true} 
                                onSaveCallback = {this.onSave}/>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.saveTimeLineConfig}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default TweetsGridConfig;