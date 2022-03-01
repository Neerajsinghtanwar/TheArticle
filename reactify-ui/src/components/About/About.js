import React from "react";
import axios from "axios";
import {connect} from "react-redux";


class About extends React.Component {

    state = {
        response: null,
    }

    componentDidMount() {
        this.test()
    }

    test = () => {
        let endpoint = `testapi/`
        let token = this.props.user.token

        axios
            .get(endpoint, token)
            .then((res)=>{
                    let responseData = res.data;
                    this.setState({response: responseData.data})
                    console.log({data: responseData})
                })
    }

    render() {

        return (
            <div>
              <h1>{this.props.user.username} - About page</h1>
                <div>{this.state.response?this.state.response.map((item, index)=>(
                    item
                )):null}</div>
            </div>
        );
    }

};

const mapStateToProps = state =>({
    user:state.userData.cardData
})


export default connect(mapStateToProps)(About);
