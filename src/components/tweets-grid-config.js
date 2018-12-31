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
    }

    async componentWillMount(){
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

    getNextConfigId(index){
        var nextIndex = index + 1;
        
        var configsCount = this.state.timeLinesConfig.length - 1;
        
        return nextIndex <= configsCount? this.state.timeLinesConfig[nextIndex].id : null;
    }

    getPreviousConfigId(index){
        if(index <= 0){
            return null;
        }

        var previousIndex = index - 1;

        var configsCount = this.state.timeLinesConfig.length - 1;
        
        return previousIndex <= configsCount? this.state.timeLinesConfig[previousIndex].id : null;
    }

    render(){
        return (
            <div className="container">
                <div className="row">
                    <h2> Configurations</h2>
                </div>

                <div class="row"> <h3> Theme </h3> </div>
                
                <div class="row">
                    <div class="form-group col-md-6">
                        <select class="form-control" onChange={this.changeTheme}>
                            <option value="minimalist" selected={ThemeSwitchableComponent.currentTheme == 'minimalist'}> minimalist </option>
                            <option value="ocean" selected={ThemeSwitchableComponent.currentTheme == 'ocean'}> ocean </option>
                            <option value="dark" selected={ThemeSwitchableComponent.currentTheme == 'dark'}> dark </option>
                        </select>
                    </div>
                    
                </div>

                <hr class="row"/>
                
                <div class="row"> <h3> TimeLines </h3> </div>

                <div className="config-container row">
                    {this.state.timeLinesConfig.map((config, index) => 
                        <div className="time-line-config-container">
                            <TimeLineConfig
                                configId={config.id}
                                userName={config.userName}
                                maxTweets={config.maxTweets}
                                limitDate={config.limitDate}
                                nextConfigId={this.getNextConfigId(index)}
                                previousConfigId={this.getPreviousConfigId(index)}
                            /> 
                        </div>
                    )}
                </div>

            </div>
        );
    }
}

export default TweetsGridConfig;