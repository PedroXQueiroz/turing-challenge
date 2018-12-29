class TweetsApp extends React.Component
{
    render(){
        return(
            <TweetsGrid></TweetsGrid>
        );
    };
}

ReactDOM.render(<TweetsApp />, document.querySelector('TweetsApp'));