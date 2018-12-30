import React, {Component} from 'react';

class Tweet extends Component{

    constructor(props){        
        super();

        this.state = {
            content: props.content,
            createdAt: props.createdAt,
            link: props.link
        }
        
    }

    render(){
        return (
            <a href={this.state.link} className="tweet" target="about_blank">
                <div className="card">
                    <div className="card-body">
                        <div> {this.state.content} </div>
                        <span> <strong> {(new Date(this.state.createdAt).toLocaleDateString())} </strong> </span>
                    </div>
                </div> 
            </a>
        );
    }

}

export default Tweet;