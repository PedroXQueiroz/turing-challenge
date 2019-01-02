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
    }

    async appIsInitiated(){
        var isInitiated = await this._storage.getItem('initiated');
        return isInitiated;
    }

    async initiateApp()
    {
        await this.setIimeLinesConfig(LocalStorageClient.defaultTimeLinesConfig);
        await this.setTheme('minimalist');
        await this._storage.setItem('initiated', true);
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

    async getTimeLineConfigIndex(configId){
        var configs = await this.getTimeLinesConfig();

        var timeLineIndex = configs.findIndex(config => config.id == configId);

        return timeLineIndex;
    }

    async getCountTimeLinesConfigs(){
        var configs = await this.getTimeLinesConfig();
        return configs.length;
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

    async addTimeLineConfig(config){
        var configs = await this.getTimeLinesConfig();

        var lastId = configs.map(config => config.id ).reduce((a, b) => Math.max(a, b));
        var currentId = lastId + 1;
        config.id = currentId;

        configs.push(config);

        await this.setIimeLinesConfig(configs);
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

    async deleteTimeLineConfig(configId)
    {
        var configs = await this.getTimeLinesConfig();

        var configIndex = configs.findIndex(config => config.id == configId);

        var updatedConfigList =  configs.splice(configIndex, 1);

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