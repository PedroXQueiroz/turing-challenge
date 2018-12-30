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