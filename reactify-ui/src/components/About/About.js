import React from "react";
import axios from "axios";
import {connect} from "react-redux";


class About extends React.Component {

    state = {
        response: null,
    }

    componentDidMount() {
        this.test()
        console.log(this.state.response)
    }

    test = () => {
        let endpoint = `http://127.0.0.1:8000/query-test/`
        let token = this.props.user.token

        axios
            .get(endpoint, token)
            .then((res)=>{
                    let responseData = res.data;
                    this.setState({response: JSON.stringify(responseData.data)})
                })
    }

    render() {

        return (
            <div>
              <h1>{this.props.user.username} - About page</h1>
                <div>{this.state.response}</div>
            </div>
        );
    }

};

const mapStateToProps = state =>({
    user:state.userData.cardData
})


export default connect(mapStateToProps)(About);
