import ThemeSwitchableComponent from './theme-switchable-component';
import React, {Component} from 'react';

class Tweet extends ThemeSwitchableComponent{

    constructor(props){        
        super();

        this.state = {
            userName: props.userName,
            tweetId: props.tweetId,
            content: props.content,
            createdAt: props.createdAt,
            medias: props.medias,
            hashtags: props.hashtags
        }
        
    }

    createMediaElement(media){
        
        switch(media.type)
        {
            case 'video':
                var videoSource = media.video_info.variants.find( vari => vari.content_type.indexOf('video') > -1 );
                
                return (
                    <video autoPlay loop muted>
                        <source src={videoSource.url} type={videoSource.content_type} />
                    </video>
                )
            break;

            case 'photo':
                return <img src={media.media_url_https}/>
            break;
        }
        
    }

    getTweetLink(){
        return 'https://twitter.com/' + this.state.userName + '/status/' + this.state.tweetId;
    }

    render(){
        return (
            <div className="card tweet">
                    <div className="card-body">

                        <div class="tweet-header">
                            <span> <strong> {(new Date(this.state.createdAt).toLocaleDateString())} </strong> </span>
                            <a href={ this.getTweetLink() } target="_blank"> Go to tweet </a>
                        </div>
                        
                        { 
                            ( this.state.medias && this.state.medias.length > 0 ) &&
                            <div class="tweet-media-container">

                                {this.state.medias.map( media => this.createMediaElement(media))}

                            </div>
                        }

                        <div> {this.state.content} </div>
                        
                        <div class="tweet-hashtags-container">
                            {this.state.hashtags.map( hashtag => <span>@{hashtag.text}</span>)}
                        </div>
                        
                    </div>
            </div>
        );
    }

}

export default Tweet;