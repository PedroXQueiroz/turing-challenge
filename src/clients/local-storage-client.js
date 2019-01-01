import ThemeSwitchableComponent from "../components/theme-switchable-component";

class LocalStorageClient{

    static getDefaultDate()
    {
        var currentDate = new Date();
        var limitDate = currentDate.setMonth(currentDate.getMonth() - 1);
        return limitDate;
    }

    constructor(){
        this._storage = localStorage;

        if(!this._storage.getItem('timeLinesConfig'))
        {
            this.setIimeLinesConfig(LocalStorageClient.defaultTimeLinesConfig);
        }
    }

    async getTimeLinesConfig(){
        
        var configData = await this._storage.getItem('timeLinesConfig');
        var configs = JSON.parse(configData);
        
        return configs;
    }

    async getTimeLineConfig(configId){
        var configs = await this.getTimeLinesConfig();
        return configs.find(config => config.id == configId);
    }

    async getNextTimeLineConfig(configId){
        var configs = await this.getTimeLinesConfig();
        var configIndex = configs.findIndex(config => config.id == configId);

        if(configIndex >= configs.length)
        {
            return null;
        }

        return configs[configIndex + 1];
    }

    async getPreviousTimeLineConfig(configId){
        var configs = await this.getTimeLinesConfig();
        var configIndex = configs.findIndex(config => config.id == configId);

        if(configIndex <= 0)
        {
            return null;
        }

        return configs[configIndex - 1];
    }

    async setIimeLinesConfig(configs){
        
        var configsData = JSON.stringify(configs);
        this._storage.setItem('timeLinesConfig', configsData);
    }

    async updateTimeLineConfig(config){
        var configs = await this.getTimeLinesConfig();
        
        var configIndex = configs.findIndex(currentConfig => currentConfig.id == config.id);
        
        if(configIndex == -1)
        {
            return;
        }
        
        configs[configIndex] = config;

        this.setIimeLinesConfig(configs);
    }

    async swapTimeLinesConfigs(configId, configToSwapId){
            
        var configs = await this.getTimeLinesConfig();
        
        var configIndex = configs.findIndex(config => config.id == configId);
        var configToSwapIndex = configs.findIndex(config => config.id == configToSwapId);

        var config = configs[configIndex];
        configs[configIndex] = configs[configToSwapIndex];
        configs[configToSwapIndex] = config;

        await this.setIimeLinesConfig(configs);
    }

    async getTheme(theme){
        return await this._storage.getItem('theme', theme);
    }
    
    async setTheme(theme){
        await this._storage.setItem('theme', theme);
    }
}

LocalStorageClient.defaultTimeLinesConfig = [
    { 
        id:0,
        userName:'MakeSchool',
        maxTweets: 30,
        limitDate: LocalStorageClient.getDefaultDate()
    },{ 
        id:1,
        userName: 'newsycombinator',
        maxTweets: 30,
        limitDate: LocalStorageClient.getDefaultDate()
    },{
        id:2,
        userName: 'ycombinator',
        maxTweets: 30,
        limitDate: LocalStorageClient.getDefaultDate()
    }
];

export default LocalStorageClient;