class TweetsColumn extends React.Component{
    
    constructor(props){
        super();
        
        this.state = {
            userName: props.userName,
        }
        
        this._userName = props.userName;
    }
    
    render(){
        return(
            <div className="col-md-4">
                <h3>{this.state.userName}</h3>
                <div className="tweetsContainer">
                    
                    {this.props.children}

                </div>
            </div>
        )
    }
}