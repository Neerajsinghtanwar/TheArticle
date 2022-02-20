import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Home from "./components/HomePage/Home"
import About from "./components/About/About";
import WriteArticle from "./components/Article/WriteArticle";
import EditArticle from "./components/Article/EditArticle";
import Dashboard from './components/Dashboard/Dashboard'
import Profile from "./components/Profile/Profile";
import Login from './components/LoginPage/Login'
import Signup from "./components/LoginPage/Signup";
import ForgotPassword from "./components/LoginPage/ForgotPassword";
import "./App.css"
import Navbar from "./components/Navbar/navbar";

class App extends React.Component {

    render() {
        return (
            <Router>
                <Navbar />
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/about' component={About}/>
                        <Route exact path='/dashboard/:username' component={Dashboard}/>
                        <Route exact path='/profile/:username' component={Profile}/>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/signup' component={Signup}/>
                        <Route exact path='/forgot-password' component={ForgotPassword}/>
                        <Route exact path='/write-article' component={WriteArticle}/>
                        <Route exact path='/edit-article/:slug' component={EditArticle}/>
                    </Switch>
            </Router>
        );
    }
}

export default App;


