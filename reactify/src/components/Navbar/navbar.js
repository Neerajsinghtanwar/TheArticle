import React from "react";
import './navbar.css'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {notifications, userLogin} from "../../Store/actions/actions";
import {axios, url, wsUrl} from "../../Store/actions/actions";

class navbar extends React.Component {

    state = {
        data: this.props.notifications.data,
        quantity: this.props.notifications.quantity,
    }

    componentDidMount = () => {
        this.loadNotificationsWithAxios()
        this.realTimeNotifications()
    };

    seen = (slug) => {
        const data = {
            slug: slug
        }
        let endpoint = `notification/seen/`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                    let responseData = res.data;
                    if (responseData.success) {
                        this.loadNotificationsWithAxios()
                    };
                })

    }

    realTimeNotifications = async () => {
        let ws = await new WebSocket(`${wsUrl}ws/notify/${this.props.user.username}`)

        ws.onopen = await function () {
            console.log('Websocket connection open...')
        }

        ws.addEventListener('message', (event) => {
            let parseData = JSON.parse(event.data)
            this.props.userNotificationHandler({
                data: parseData.msg,
                quantity: parseData.msg[0].quantity
            })
            console.log({'message recieved.....':parseData.msg})
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

    logout = () =>{
        window.localStorage.clear();
        this.props.userLoginHandler({undefined})
        this.props.userNotificationHandler({undefined})
    };

    render() {
        let username = this.props.user.username
        let quantity = this.props.notifications.quantity
        let login = this.props.user.login
        let notifications = this.props.notifications.data

        return(
            <>
                <div className="NavBody">
                    <nav className="navbar navbar-dark navbar-expand-lg navigationWrap startHeader startStyle" style={{backgroundColor: "black"}}>
                        <div className="container-fluid cuCon">
                            <Link to='/' className="navbar-brand">The-Articles</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                          data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                          aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ml-auto">
                      <li className="nav-item nav-item_2 pl-4 pl-md-0 ml-0 ml-md-4" >
                          <Link to='/' className="nav-link nav_link_2">Home <span className="sr-only">(current)</span></Link>
                      </li>
                      <li className="nav-item nav-item_2 pl-4 pl-md-0 ml-0 ml-md-4">
                          <Link to= {'/dashboard/'+ username} className="nav-link nav_link_2" >Dashboard</Link>
                      </li>
                      <li className="nav-item nav-item_2 pl-4 pl-md-0 ml-0 ml-md-4">
                          <Link to='/about' className="nav-link nav_link_2">About</Link>
                      </li>
                      <li className="nav-item nav-item_2 pl-4 pl-md-0 ml-0 ml-md-4 dropdown">
                          <Link to={username?null:'/login'} className="nav-link nav_link_2 dropdown-toggle dropdown_toggle_2" id="navbarDropdownMenuLink" role="button"
                             aria-expanded="false">
                              {username?username:'Login/Signup'}
                          </Link>

                          {username?
                              <div className="dropdown-menu dropdown_menu_2" aria-labelledby="navbarDropdownMenuLink">
                                  <a className="dropdown-item dropdown_item_2">Accounts</a>
                                  <a className="dropdown-item  dropdown_item_2" href="#">Another action</a>
                                  <a className="dropdown-item  dropdown_item_2" onClick={this.logout} style={{cursor: 'pointer'}}>Logout</a>
                              </div>
                          :null}
                      </li>
                      {login?
                        <li className="nav-item nav-item_2 pl-4 pl-md-0 ml-0 ml-md-4 dropdown">
                          {/*<Link to={''} className="nav-link nav_link_2 dropdown-toggle dropdown_toggle_2" id="navbarDropdownMenuLink" role="button"*/}
                          {/*   aria-expanded="false">*/}
                              <img src={url+'media/images/bell2.png'} height={'28px'}/>
                              {quantity || quantity > 0?
                                <span className="notiDot">
                                <p className='notiDotText' id='notiDotText'>{quantity}</p>
                              </span>
                              :null}
                          {/*</Link>*/}
                              <div className="dropdown-menu dropdown_menu_2 noti" aria-labelledby="navbarDropdownMenuLink">
                                  <h3 style={{fontFamily: "Oswald, sans-serif", marginLeft: "2%", marginTop: "3%"}}>Notifications</h3>
                                  <hr/>
                                  {notifications?notifications.map((item, index) =>(
                                      <div className="notifications-item"
                                           style={{backgroundColor: item.seen?'white':'rgba(255,227,227,0.82)'}}
                                           onClick={(e) => {
                                               this.seen(item.slug);
                                           }
                                      }>

                                          <img className="notiImage" src={url+item.image_url} alt="img"/>
                                          <div className="notiText">
                                          <p><span style={{fontWeight:'bold'}}>{item.username}</span>{' '+item.text}</p>
                                          <p>{item.msg}</p>
                                          <p className='notiTime'>{item.time_stamp}</p>

                                          </div>
                                      </div>
                                  )):
                                      <div id="menu_map" className="menu_open_notification">
                                          <div style={{textAlign: "center", marginTop: "35%"}}>
                                              <img src="https://www.ymgrad.com/static/base/no_notfication.png" height="70" width="70"/>
                                              <h6 style={{marginTop: "3%"}}>Nothing to see here yet!</h6>
                                          </div>
                                      </div>
                                      }
                              </div>
                      </li>
                      :null}
                    </ul>
                    </div>
                    </div>
                    </nav>
                </div>
            </>
        );

    }
}

const mapStateToProps = state =>({
    user:state.userData.cardData,
    notifications:state.notificationData.notifyData
})

const mapDispatchToProps = dispatch => ({
    userLoginHandler: data => dispatch(userLogin(data)),
    userNotificationHandler: data => dispatch(notifications(data)),
})

export default connect(mapStateToProps,mapDispatchToProps)(navbar)
