import React, {Component} from 'react';
import EventEmitter from 'events';
import ReactDOM from "react-dom";

class ThemeSwitchableComponent extends Component
{
    constructor(){
        super();

        ThemeSwitchableComponent.switchThemeEvent.addListener('switch-theme', (theme) => {
            this.setTheme(theme);
        })
    }
    
    setTheme(theme)
    {
        var classes = this.componentContainer.className;
    
        var cleandClasses = classes.replace(/(ocean)|(minimalist)|(dark)/, '');
        
        var updatedClasses = cleandClasses? cleandClasses + ' ' + theme : theme;
        
        this.componentContainer.setAttribute('class', updatedClasses);
    }

    componentDidMount(){
        this.componentContainer = ReactDOM.findDOMNode(this);
        this.setTheme(ThemeSwitchableComponent.currentTheme);
    }

}

ThemeSwitchableComponent.switchThemeEvent = new EventEmitter();

ThemeSwitchableComponent.switchTheme = function(theme){
    ThemeSwitchableComponent.switchThemeEvent.emit('switch-theme', theme);
    ThemeSwitchableComponent.currentTheme = theme;
}

export default ThemeSwitchableComponent;