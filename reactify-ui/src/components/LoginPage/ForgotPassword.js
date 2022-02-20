import React from "react";
import './Login.css';
import {axios} from "../../Store/actions/actions";
import {Link} from "react-router-dom";


class ForgotPassword extends React.Component {

    state = {
        username: null,
        email: null,
        password1: null,
        password2: null,
        submit: false,
    }

    componentDidMount() {
        document.body.style.backgroundColor = "#ffcaca"
    }

    submit = () => {
        let data = new FormData();

        if (this.state.username === null) {
            document.getElementById("username").innerText = "*this field is required";
        } else {
            document.getElementById("username").innerText = "";
        }
        if (this.state.password1 == null) {
            document.getElementById("password1").innerText = "*this field is required";
        } else {
            document.getElementById("password1").innerText = "";
        }
        if (this.state.password2 == null) {
            document.getElementById("password2").innerText = "*this field is required";
        } else {
            document.getElementById("password2").innerText = "";
        }

        if (
          this.state.username !== null &&
          this.state.password1 !== null &&
          this.state.password2 !== null &&
          this.state.password1 == this.state.password2
        ) {

        data.append("username", this.state.username);
        data.append("password1", this.state.password1);

        let endpoint = `account/forgot-password/`

        axios
          .post(endpoint, data)
          .then((response) => {

          const responseData = response.data;
          let msg = responseData.error || responseData.msg
          if (responseData.success) {
            document.getElementById("last_updated").className =
                "alert alert-success";
            document.getElementById("last_updated").innerText = msg;
            window.scrollTo(0, 0);

            this.setState({submit:true})

          } else {
            document.getElementById("last_updated").className =
                "alert alert-danger";
            document.getElementById("last_updated").innerText = msg;
            window.scrollTo(0, 0);
          }
        })
          .catch((error) => console.log({error}));
        }

    }

    checkPassword = (value) => {
        if (this.state.password1 !== value) {
            document.getElementById("password2").innerText = "*password does not match with previous password.";
        } else {
        document.getElementById("password2").innerText = "";
    }
    }

    render() {
        return(
            <>
                <div style={{textAlign: "center", position: "relative", width: "100%"}}
                    id="last_updated"/>
                <div className="registration-form">
                        <form>
                            <div className="form-icon">
                                <img
                                    style={{height: "110px", width: "110px" }}
                                     src="http://127.0.0.1:8000/media/images/profilePic.png"
                                     alt="user"/>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control item" placeholder="Enter your username or e-mail"
                                    onChange={(e) => this.setState({username: e.target.value})} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="username"></p>

                            <div className="form-group">
                                <input type="password" className="form-control item" id="password"
                                   placeholder="Password"
                                   onChange={(e) => this.setState({password1: e.target.value})} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="password1"></p>

                            <div className="form-group">
                                <input type="password" className="form-control item" id="password"
                                   placeholder="Confirm-Password"
                                   onChange={async (e) => {
                                       this.checkPassword(e.target.value);
                                       await this.setState({password2: e.target.value});
                                   }} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="password2"></p>

                            <div className="form-group">
                                <button type="button" className="btn btn-block create-account"
                                    onClick={this.submit}
                                >Submit</button>
                            </div>
                        </form>
                        <div className="signup-forgot">
                            {this.state.submit===true?
                            <h5>Click to -<Link to='/login'><span className='signup-forgot-text'> Log In...</span></Link></h5>
                            :null}
                        </div>
                    </div>
            </>
        )
    }
}

export default ForgotPassword;
