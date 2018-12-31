import ThemeSwitchableComponent from './theme-switchable-component';
import React, {Component} from 'react';

class Tweet extends ThemeSwitchableComponent{

    constructor(props){        
        super();

        this.state = {
            content: props.content,
            createdAt: props.createdAt,
            link: props.link,
            medias: props.medias,
            hashtags: props.hashtags
        }
        
    }

    render(){
        return (
            <div className="card tweet">
                    <div className="card-body">
                        
                        <a href={this.state.link} target="about_blank">
                            <div> {this.state.content} </div>
                        </a>
                        
                        <div class="tweet-hashtags-container">
                            {this.state.hashtags.map( hashtag => <span>@{hashtag.text}</span>)}
                        </div>
                        
                        <span> <strong> {(new Date(this.state.createdAt).toLocaleDateString())} </strong> </span>
                    
                    </div>
            </div>
        );
    }

}

export default Tweet;