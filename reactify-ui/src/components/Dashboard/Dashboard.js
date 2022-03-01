import React from "react";
import {axios, url} from "../../Store/actions/actions";
import './Dashboard.css'
import '../HomePage/Home.css'
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";

class dashboard extends React.Component {
    state = {
        username : null,
        unfollow: null,
        blogger: null,
        blog: null,
        blogLength: null,
        followers: null,
        followings: null,
        slug: null,
        comment: null,
        action: null,
    }

    componentDidMount() {
        this.loadDashboardWithAxios()
    }

    handleFileSelected = (e) => {
        const file = e.target.files[0];
        this.changeImage(file)
    };

    changeImage = (file) => {
        let data = new FormData();

        data.append("action", this.state.action)
        data.append("image", file)

        let endpoint = `change-image`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    this.loadDashboardWithAxios();
                }
            })
    }

    like = () => {
        const data = {
        }
        let endpoint = `like-blog/${this.state.slug}`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    this.loadDashboardWithAxios();
                }
            })
    }

    commentLike = (slug) => {
        // console.log({'-------': slug})
        const data = {
        }
        let endpoint = `like-comment/${slug}`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    this.loadDashboardWithAxios();
                }
            })
    }

    follow = (follow_user) => {
        const data = {
            username: follow_user,
            action: this.state.action,
        }

        let endpoint = `follow`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    // this.setState({slug:null})
                    this.loadDashboardWithAxios();
                }
            })
    }

    postComment = (slug) => {

        const data = {
            text: this.state.comment,
        }

        let endpoint = `post-comment/${slug}`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    this.loadDashboardWithAxios();
                }
            })
    }

    loadDashboardWithAxios = () => {
            let url = window.location.pathname;

            url = url.split("/");
            let id = url[url.length - 1];

            let endpoint = `dashboard/${id}`
            let token = this.props.user.token

            axios
                .get(endpoint, token)
                .then((res)=>{
                    let responseData = res.data;
                    this.setState({blogger: responseData.blogger})
                    this.setState({blog: responseData.blog})
                    this.setState({blogLength: this.state.blog.length})
                    this.setState({unfollow: responseData.unfollow})
                    this.setState({followers: responseData.followers})
                    this.setState({followings: responseData.following})
                    this.setState({username: responseData.username})

                })
        }

    delete = (slug) => {
        let endpoint = `edit-article/${slug}`
        let token = this.props.user.token

        axios
            .delete(endpoint, token)
            .then((response) => {
            this.loadDashboardWithAxios()
            const responseData = response.data;
            let msg = responseData.error || responseData.msg
            if (responseData.success) {
                document.getElementById("last_updated").className = "alert alert-success";
                document.getElementById("last_updated").innerText = msg;
                window.scrollTo(0, 0);
            } else {
                document.getElementById("last_updated").className = "alert alert-danger";
                document.getElementById("last_updated").innerText = msg;
                window.scrollTo(0, 0);
                }
            });
    }

    render(){
        let login = this.props.user.login

        return(
            <div>
                {login?
                    <>
                    <div
                        style={{textAlign: "center", position: "relative", width: "100%"}}
                        id="last_updated"
                    />
                    <div>
                        <div className="padding">
                            <div className="col-md-12">
                                <div className="container card">
                                    {this.state.blogger ? this.state.blogger.map((data, j) => (
                                    <>
                                        <label htmlFor="profilePicId">
                                            <div className={"backg-pic"}>
                                                <img className="card-img-top"
                                                     src={url.slice(0, -1)+data.background_pic} alt="Card_cap"
                                                     onClick={(e)=> {
                                                        this.setState({action: 'background_pic'});
                                                     }}d
                                                />
                                                <i className="changeBackgroundPic fas fa-edit"/>
                                            </div>
                                        </label>

                                        <div className="card-body little-profile row">
                                        <label htmlFor="profilePicId">
                                            <div className=" pro-img col-lg-3">
                                                <img style={{height: "220px", width: "220px" }}
                                                     src={url.slice(0, -1)+data.profile_pic} alt="user"
                                                     onClick={(e)=> {
                                                        this.setState({action: 'profile_pic'});
                                                    }}
                                                />
                                                <>
                                                    <input style={{display:"none"}}
                                                        type="file"
                                                        id="profilePicId"
                                                        accept="image/x-png,image/gif,image/jpeg"
                                                        onChange={this.handleFileSelected}
                                                    />
                                                    <i className="changeProfilePic fas fa-edit"/>
                                                </>
                                            </div>
                                        </label>
                                        <div className="user-detail col-lg-4">
                                            <h3 className="h3 m-b-2">{data.fullname}</h3>
                                            <p>Web Designer &amp; Developer</p>
                                        </div>
                                        <div className=" col-lg-5 row p-box">
                                            <div className="afw col-lg-4">
                                                <h3 className="h4 m-b-1 font-light">{this.state.blogLength}</h3><p>Articles</p>
                                            </div>
                                            <div className="afw col-lg-4" data-toggle="modal" data-target={"#followersModal"+data.username} >
                                                <h3 className="h4 m-b-1 font-light">{data.followers.length}</h3><p>Followers</p>
                                            </div>
                                            <div className="modal fade" id={"followersModal"+data.username} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                    <div className="modal-content">
                                                        <div className="modal-header p-18 pb-1">
                                                            <h2 style={{fontSize:"22px"}}>Followers</h2>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div className="container">
                                                                <div
                                                                    className="d-flex row">
                                                                    <div className="col-md-12">
                                                                        <div className="bg-white text-center">
                                                                            {this.state.followers?this.state.followers.map((items, indx) => (
                                                                                items.blogger.map((item, i) => (
                                                                                    <div className=" mb-3 d-flex flex-row justify-content-between align-items-center">
                                                                                            <div
                                                                                                className="d-flex flex-row align-items-center">
                                                                                                <img
                                                                                                    className="rounded-circle"
                                                                                                    src={url.slice(0, -1)+item.profile_pic}
                                                                                                    width="55"
                                                                                                    height="55"
                                                                                                />
                                                                                                <div className="d-flex flex-column align-items-start ml-2">
                                                                                                    <Link to={'/profile/'+ item.username}><span className="font-weight-bold">{item.fullname}</span></Link>
                                                                                                    <span className="followers">{item.followers.length} Followers</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                ))
                                                                            )):null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="afw col-lg-4" data-toggle="modal" data-target={"#followingsModal"+data.username}>
                                                <h3 className="h4 m-b-1 font-light">{data.following.length}</h3><p>Following</p>
                                            </div>
                                            <div className="modal fade" id={"followingsModal"+data.username} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                    <div className="modal-content">
                                                        <div className="modal-header p-18 pb-1">
                                                            <h2 style={{fontSize:"22px"}}>Followings</h2>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div className="container">
                                                                <div
                                                                    className="d-flex row">
                                                                    <div className="col-md-12">
                                                                        <div className="bg-white text-center">
                                                                            {this.state.followings?this.state.followings.map((items, indx) => (
                                                                                items.blogger.map((item, i) => (
                                                                                    <div className=" mb-3 d-flex flex-row justify-content-between align-items-center">
                                                                                            <div
                                                                                                className="d-flex flex-row align-items-center">
                                                                                                <img
                                                                                                    className="rounded-circle"
                                                                                                    src={url.slice(0, -1)+item.profile_pic}
                                                                                                    width="55"
                                                                                                    height="55"
                                                                                                />
                                                                                                <div className="d-flex flex-column align-items-start ml-2">
                                                                                                    <Link to={'/profile/'+ item.username}><span className="font-weight-bold">{item.fullname}</span></Link>
                                                                                                    <span className="followers">{item.followers.length} Followers</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                ))
                                                                            )):null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                    )) : null}
                                    <hr/>
                                    <div className="container">
                                       <h3 style={{textAlign:'center'}}>Your Articles</h3>
                                    </div>
                                    <hr/>
                                    {this.state.blog?this.state.blog.map((item, k) => (
                                        <div className=" container dashCardBody">
                                            <div className="userDetail row">
                                                <div className="col-sm-3 col-md-2 col-lg-2 ">
                                                    <img className="homeProfile-pic"
                                                         src={url+'media/' + item.profile_pic}/>
                                                </div>

                                                <div className="nameTime col-sm-7 col-md-8 col-lg-8">
                                                    <Link to={item.username===this.props.user.username?'/dashboard/'+ item.username:'/profile/'+ item.username}><h6 className="profile-username">{item.fullname}</h6></Link>
                                                    <p className="home-timestamp">{item.timeStamp}</p>
                                                </div>
                                                {item.username===this.props.user.username?
                                                    <div className="col-sm-2 col-md-2 col-lg-2">
                                                        <div><div className="home-dotButton dropdown"
                                                        >
                                                            <i
                                                                className=" fa fa-ellipsis-h"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            />
                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <Link to={'/edit-article/'+item.slug}><a className="dropdown-item">Edit</a></Link>
                                                                <a onClick={(e)=>this.delete(item.slug)} className="dropdown-item">Delete</a>
                                                            </div>
                                                        </div></div>
                                                    </div>
                                                :null}
                                            </div>
                                            <div className="userDetailSm row"
                                                 style={{display: "none"}}
                                            >
                                                <div className="col-xs-3">
                                                    <img className="homeProfile-pic"
                                                         src={url+'media/' + item.profile_pic}
                                                         style={{marginLeft: "16px"}}
                                                    />
                                                </div>

                                                <div className="nameTime col-xs-7" style={{marginLeft: "10px"}}>
                                                    <Link to={item.username===this.props.user.username?'/dashboard/'+ item.username:'/profile/'+ item.username}><h6 className="profile-username" style={{fontSize: "15px", marginBottom:"0px"}}>{item.fullname}</h6></Link>
                                                    <p className="home-timestamp">{item.timeStamp}</p>
                                                </div>
                                                {item.username===this.props.user.username?
                                                    <div className="col-xs-2" style={{marginLeft: "60px"}}>
                                                        <div><div className="home-dotButton dropdown"
                                                        >
                                                            <i
                                                                className=" fa fa-ellipsis-h"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            />
                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <Link to={'/edit-article/'+item.slug}><a className="dropdown-item">Edit</a></Link>
                                                                <a onClick={(e)=>this.delete(item.slug)} className="dropdown-item">Delete</a>
                                                            </div>
                                                        </div></div>
                                                    </div>
                                                :null}
                                            </div>
                                            {/*<---------------Article---------------->*/}
                                            <article className="postcard light yellow">
                                                <a className="postcard__img_link" href="#">
                                                    <img className="postcard__img"
                                                         src={url.slice(0, -1) + item.thumbnail}
                                                         alt="Image Title"/>
                                                </a>
                                                <div className="postcard__text t-dark">
                                                    <h1 className="postcard__title yellow">{item.title.substring(0, 25) + '...'}</h1>
                                                    <div className="postcard__subtitle small">
                                                        <time dateTime="2020-05-25 12:00:00">
                                                            <i className="fas fa-calendar-alt mr-2"/>{item.timeStamp}</time>
                                                    </div>
                                                    <div className="postcard__bar"></div>
                                                    <div
                                                        className="postcard__preview-txt">{item.description.substring(0, 300) + '......'}
                                                    </div>
                                                    <div className="homeFab3" data-toggle="modal"
                                                         data-target={"#dashContentModal" + item.slug}>Read more...
                                                    </div>

                                                    <div className="row  mt-3">
                                                        <div className="col-3" onClick={(e)=> {
                                                            this.setState({slug:item.slug});
                                                            setTimeout(this.like,1);
                                                        }}>
                                                            {item.CheckLikes?(
                                                                    <img src={url + 'media/images/redHeart.png'} height={'35px'}/>
                                                                ):(
                                                                    <img src={url+'media/images/heart2.png'} height={'35px'}/>
                                                                )}
                                                            <p className="btn_font">{item.like.length} Likes</p>
                                                        </div>

                                                        <div className="col-3"
                                                             onClick={(e)=> this.setState({slug: item.slug})}
                                                             data-toggle="modal"
                                                             data-target={"#dashCommentModal"+item.slug}>
                                                            <i className="far fa-comment fa-2x"></i>
                                                            <p className="btn_font">{item.comments.length} Comments</p>
                                                        </div>

                                                        {/*<---------------comment modal---------------->*/}
                                                        <div className="modal fade" id={"dashCommentModal"+item.slug} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h4>Comments</h4>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className="">
                                                                        <div
                                                                            className="d-flex justify-content-center row">
                                                                            <div className="col-md-11">
                                                                                <div
                                                                                    className="d-flex flex-column comment-section">
                                                                                    <div className="commentsHeight">
                                                                                        {item.comments.map((comnt, num) =>(
                                                                                        <div className="bg-white p-2">
                                                                                            <div className="d-flex flex-row user-info">
                                                                                                <img
                                                                                                    className="rounded-circle"
                                                                                                    src={url+'media/' + comnt.profile_pic}
                                                                                                    width="40"/>
                                                                                                    <div
                                                                                                        className="d-flex flex-column justify-content-start ml-2">
                                                                                                        <span
                                                                                                            className="d-block font-weight-bold name">
                                                                                                            {comnt.fullname}
                                                                                                        </span><span
                                                                                                        className="date text-black-50">
                                                                                                        {/*Shared publicly - Jan 2020*/}
                                                                                                        {'Shared publicly - '+comnt.timeStamp}
                                                                                                    </span>
                                                                                                    </div>
                                                                                            </div>
                                                                                            <div className="mt-2">
                                                                                                <small className="comment-text">{comnt.text}</small>
                                                                                            </div>

                                                                                            <div className="comment-like-button">
                                                                                                <small
                                                                                                    className="comment-like-text"
                                                                                                    onClick={(e)=>this.commentLike(comnt.slug)}
                                                                                                >{!comnt.CheckLike?
                                                                                                    '( '+comnt.like.length+' ) '+'Like'
                                                                                                    :'( '+comnt.like.length+' ) '+'Unlike'}
                                                                                                </small>
                                                                                            </div>

                                                                                        </div>

                                                                                        ))}
                                                                                    </div>

                                                                                    <div className="bg-light p-2">
                                                                                        <div className="d-flex flex-row align-items-start">
                                                                                            <img className="rounded-circle"
                                                                                                src="https://i.imgur.com/RpzrMR2.jpg"
                                                                                                width="40"
                                                                                                alt="none"
                                                                                            />
                                                                                            <input
                                                                                                className="form-control ml-1 shadow-none textarea"
                                                                                                id="comment-text-value"
                                                                                                onChange={(e)=>this.setState({comment:e.target.value})}
                                                                                            />
                                                                                        </div>
                                                                                        <div
                                                                                            className="mt-2 text-right">
                                                                                            <button
                                                                                                className="btn btn-primary btn-sm shadow-none"
                                                                                                type="button"
                                                                                                onClick={(e)=> {
                                                                                                    this.postComment(item.slug);
                                                                                                    document.getElementById("comment-text-value").value = ''
                                                                                                }
                                                                                            }
                                                                                            >Post
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                        {/*<---------------End comment modal---------------->*/}

                                                        <div className="col-3" onClick={this.share}>
                                                            <i className="fa fa-share-alt fa-2x" aria-hidden="true"></i>
                                                            <p className="btn_font">17 Shares</p>
                                                        </div>
                                                    </div>

                                                    {/*<---------------Content modal---------------->*/}
                                                    <div className="modal fade" id={"dashContentModal" + item.slug} tabIndex="-1"
                                                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog modal-xl modal-dialog-scrollable">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <button type="button" className="close"
                                                                            data-dismiss="modal"
                                                                            aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div dangerouslySetInnerHTML={{__html: item.content}}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/*<---------------End content modal---------------->*/}

                                                </div>
                                            </article>
                                            {/*<---------------End Article---------------->*/}
                                            <hr className="dash-hr"/>
                                        </div>
                                    )):null}
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                :<Redirect to={'/login'}/>}
            </div>
        );
    }
}

const mapStateToProps = state =>({
    user:state.userData.cardData
})

export default connect(mapStateToProps)(dashboard);
