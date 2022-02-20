import React from "react";
import './Login.css';
import {axios} from "../../Store/actions/actions";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {userLogin, notifications} from "../../Store/actions/actions";
import {Link} from "react-router-dom";


class login extends React.Component {

    state = {
        username: null,
        password: null,
        login: false,
        notifications: null,
        notificationsQuantity: null
    }

    componentDidMount() {
        document.body.style.backgroundColor = "#dee9ff"
    }

    connectWebsocket = async () => {
        let ws = await new WebSocket(`ws://127.0.0.1:8000/ws/notify/${this.props.user.username}`)

        ws.onopen = await function () {
            console.log('Websocket connection open...')
        }

        ws.addEventListener('message', (event) => {
            let parseData = JSON.parse(event.data)

            console.log({'message recieved.....':parseData.msg})
            this.loadNotificationsWithAxios()
        })

        ws.onerror = function (event) {
            console.log('Websocket error occurred...', event)
        }

        ws.onclose = function (event) {
            console.log('Websocket closed...', event)
        }
    };

    loadNotificationsWithAxios = () => {
        let endpoint = `notification/`
        let token = this.props.user.token

        axios
            .get(endpoint, token)
            .then((res)=>{
                    let responseData = res.data;
                    this.props.userNotificationHandler({
                        data: responseData.notifications,
                        quantity: responseData.quantity
                    })
                })
    }

    submit = async (username) => {

        const data = {
            username: username,
            password: this.state.password
        }

        let endpoint = `get-token/`
        await axios
            .post(endpoint, data)
            .then((res) =>{
                let responseData = res.data;
                console.log({'res-data............': responseData})
                window.localStorage.setItem('token', responseData.access)
                window.localStorage.setItem('username', username)

                this.props.userLoginHandler({
                    username: username,
                    login: true,
                    Authorization: 'Bearer ' + responseData.access
                            ,
                    token: {
                            headers: {
                                'Authorization': 'Bearer ' + responseData.access
                            }
                    }

                })

                this.loadNotificationsWithAxios()

                this.setState({login: responseData?true:null})

            })
            .catch((error) => console.log({error}));
        this.connectWebsocket()
    }

    login = () => {
        let data = new FormData();

        if (this.state.username === null || this.state.password == null) {
            document.getElementById("login-error").innerText = "*both fields are required";
        } else {
            document.getElementById("login-error").innerText = "";
        }

        if (
          this.state.username !== null &&
          this.state.password !== null
        ) {

        data.append("username", this.state.username);
        data.append("password", this.state.password);

        let endpoint = `account/login/`

        axios
          .post(endpoint, data)
          .then((response) => {

          const responseData = response.data;
          let msg = responseData.error
          if (responseData.success) {
            this.submit(responseData.username);

          } else {
            // document.getElementById("last_updated").className =
            //     "alert alert-danger";
            // document.getElementById("last_updated").innerText = msg;
            document.getElementById("login-error").innerText = responseData.msg;
            // window.scrollTo(0, 0);
          }
        })
          .catch((error) => console.log({error}));
        }

}

    render() {

        return(
            <>
                {this.state.login===false? (
                <div className="registration-form">
                        <form>
                            <div className="form-icon">
                                <img
                                    style={{height: "110px", width: "110px" }}
                                     src="http://127.0.0.1:8000/media/images/profilePic.png"
                                     alt="user"/>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control item" id="username" placeholder="Username or E-mail"
                                    onChange={(e) => this.setState({username: e.target.value})} required/>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control item" id="password"
                                   placeholder="Password"
                                   onChange={(e) => this.setState({password: e.target.value})} required/>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-block create-account"
                                    onClick={this.login}
                                >Login</button>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id='login-error'></p>
                        </form>
                        <div className="signup-forgot">
                            <Link to='/signup'><h5 className='signup-forgot-text'>Register user</h5></Link>
                            <h3>or</h3>
                            <Link to='/forgot-password'><h5 className='signup-forgot-text'>Forgot Password</h5></Link>
                        </div>
                    </div>
                ):(
                <Redirect to={'/'}/>
                )};
            </>
        )
    }
}

const mapStateToProps = state =>({
    user:state.userData.cardData
})

const mapDispatchToProps = dispatch => ({
    userLoginHandler: data => dispatch(userLogin(data)),
    userNotificationHandler: data => dispatch(notifications(data)),
})

export default connect(mapStateToProps,mapDispatchToProps)(login)
