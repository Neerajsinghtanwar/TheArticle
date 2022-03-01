import React from "react";
import './Login.css';
import {axios, url} from "../../Store/actions/actions";
import {Link, Redirect} from "react-router-dom";

class signup extends React.Component {

    state = {
        username: null,
        firstName: null,
        lastName: null,
        email: null,
        password1: null,
        password2: null,
        login: false
    }

    componentDidMount() {
        document.body.style.backgroundColor = "#efffde"
    }


    submit = () => {
        let data = new FormData();

        if (this.state.username === null) {
            document.getElementById("username").innerText = "*this field is required";
        } else {
            document.getElementById("username").innerText = "";
        }
        if (this.state.firstName == null) {
            document.getElementById("firstName").innerText = "*this field is required";
        } else {
            document.getElementById("firstName").innerText = "";
        }
        if (this.state.lastName == null) {
            document.getElementById("lastName").innerText = "*this field is required";
        } else {
            document.getElementById("lastName").innerText = "";
        }
        if (this.state.email == null) {
            document.getElementById("email").innerText = "*this field is required";
        } else {
            document.getElementById("email").innerText = "";
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
          this.state.firstName !== null &&
          this.state.lastName !== null &&
          this.state.email !== null &&
          this.state.password1 !== null &&
          this.state.password2 !== null &&
          this.state.password1 == this.state.password2
        ) {

        data.append("username", this.state.username);
        data.append("firstName", this.state.firstName);
        data.append("lastName", this.state.lastName);
        data.append("email", this.state.email);
        data.append("password1", this.state.password1);

        let endpoint = `account/register-user/`

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
                {this.state.login===false? (
                <div className="registration-form">
                        <form>
                            <div className="form-icon">
                                <img
                                    style={{height: "110px", width: "110px" }}
                                     src={url+"media/images/profilePic.png"}
                                     alt="user"/>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control item" placeholder="Username"
                                    onChange={(e) => this.setState({username: e.target.value})} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="username"></p>

                            <div className="form-group">
                                <input type="text" className="form-control item" placeholder="First-Name"
                                    onChange={(e) => this.setState({firstName: e.target.value})} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="firstName"></p>

                            <div className="form-group">
                                <input type="text" className="form-control item" id="last-name" placeholder="Last-Name"
                                    onChange={(e) => this.setState({lastName: e.target.value})} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="lastName"></p>

                            <div className="form-group">
                                <input type="text" className="form-control item" placeholder="Email"
                                    onChange={(e) => this.setState({email: e.target.value})} required/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="email"></p>

                            <div className="form-group">
                                <input type="password" className="form-control item"
                                    onChange={(e) => this.setState({password1: e.target.value})} required
                                    placeholder="Password"/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="password1"></p>

                            <div className="form-group">
                                <input type="password" className="form-control item"
                                    onChange={async (e) => {
                                        this.checkPassword(e.target.value);
                                        this.setState({password2: e.target.value});
                                    }
                                } required

                                    placeholder="Confirm-Password"/>
                            </div>
                            <p style={{color: "red", textAlign: "left"}} id="password2"></p>

                            <div className="form-group">
                                <button type="button" onClick={(e)=> {
                                    this.submit();
                                }} className="btn btn-block create-account">Create Account</button>
                            </div>
                        </form>
                        <div className="signup-forgot">
                            <h5>If you have already an account please click on -<Link to='/login'><span className='signup-forgot-text'> Log In...</span></Link></h5>
                        </div>
                    </div>
                ):(
                <Redirect to={'/'}/>
                )};
            </>
        )
    }
}

export default signup;
