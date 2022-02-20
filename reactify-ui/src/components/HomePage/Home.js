import React, {useCallback} from "react";
import './Home.css'
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {axios} from "../../Store/actions/actions";

class home extends React.Component {

    state = {
        blog: null,
        cat: null,
        selectedCat: null,
        slug: null,
        comment: null,
        searchResult: null,
        notification: null

    }

    componentDidMount() {
        this.loadHomePageWithAxios()
        document.body.style.backgroundColor = "#fff"
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
                    this.loadHomePageWithAxios();
                }
            })
    }

    commentLike = (slug) => {
        const data = {
        }
        let endpoint = `like-comment/${slug}`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    this.loadHomePageWithAxios();
                }
            })
    }

    postComment = () => {
        const data = {
            text: this.state.comment,
        }

        let endpoint = `post-comment/${this.state.slug}`
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                if (responseData.success === true){
                    this.setState({slug:null})
                    this.loadHomePageWithAxios();
                }
            })
    }

    async search(data) {

        let token = await this.props.user.token
        let result = await fetch(`http://127.0.0.1:8000/search/${data===''?'e-m-p-t-y':data}`, token);
        result = await result.json()
        this.setState({searchResult:result.user})
        this.setState({blog:result.blog})

    }

    categoryWiseBlogs = () =>{
        const data = {
            category: this.state.selectedCat,
        }
        console.log(this.state.selectedCat)

        let endpoint = ``
        let token = this.props.user.token

        axios
            .post(endpoint, data, token)
            .then((res)=>{
                let responseData = res.data;
                this.setState({blog: responseData.blog})
            })

    }

    loadHomePageWithAxios = () =>{

        let endpoint = ``
        let token = this.props.user.token

        axios
            .get(endpoint, token)
            .then((res)=>{
                let responseData = res.data;
                this.setState({blog: responseData.blog})
                this.setState({cat: responseData.category})
            })
    }

    render() {

        return(
            <div>
                {this.props.user.login?
                    <>
                <div style={{background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)", height: "67px"}}>
                    <div className="container nav-scroller py-1 mb-2">
                    {this.state.cat?
                    <ul className="nav nav-tabs nav2 d-flex justify-content-between cat_nav" id="myTab" role="tablist">
                        {this.state.cat? this.state.cat.map((item, index) => (
                        <li className="nav-item "
                            role="presentation"
                            onClick={(e)=> {
                                   setTimeout(this.categoryWiseBlogs,0.1);
                                   this.setState({selectedCat: item});
                               }
                            }
                        >
                            <a className="nav-link p-2 h-2" id="profile-tab" data-toggle="tab" role="tab"
                               aria-controls="profile" aria-selected="false">{item}</a>
                        </li>
                        )):null}
                    </ul>
                    :null}
                </div>
                </div>
                <div className="container-fluid row ">
                    <div className="col-lg-2">
                        {this.state.searchResult?
                            <div>
                                <h1 className='today' style={{marginTop: "150px", marginBottom: '32px'}}>USERS</h1>
                                <div className='searchResult'>
                            {this.state.searchResult.map((item, index) =>(

                            <div className=" mb-3 d-flex flex-row justify-content-between align-items-center">
                                <div
                                className="d-flex flex-row align-items-center">
                                    <img
                                    className="rounded-circle"
                                    src={'http://localhost:8000'+item.profile_pic}
                                    width="55"
                                    height="55"
                                    />
                                    <div className="d-flex flex-column align-items-start ml-2">
                                        <Link to={item.username===this.props.user.username?'/dashboard/'+ item.username:'/profile/'+ item.username}><span className="font-weight-bold" style={{color:'black'}}>{item.fullname}</span></Link>
                                        <span className="followers">{item.followers.length} Followers</span>
                                    </div>
                                </div>
                            </div>

                            ))}
                            </div>
                            </div>
                        :null}
                    </div>
                    <div className="cardBody col-lg-8 ">
                        <div className="search-box mt-2">
                            <input className="search-txt" type="text" placeholder="search"
                                onChange={(e)=>this.search(e.target.value)}
                            />
                            <a className="search-btn">
                                <i className="fas fa-search" style={{height: "22px", width: "22px"}}/>
                            </a>
                        </div>

                        <div className="section-header mt-5">
                            <h1 className="today">TODAY {this.state.selectedCat} ARTICLES</h1>
                        </div>

                        {this.state.blog? this.state.blog.map((item, index) => (
                            <div className=" container dashCardBody">
                                <div className="userDetail row">
                                    <div className="col-lg-1">
                                        <img className="homeProfile-pic"
                                             src={'http://127.0.0.1:8000/media/' + item.profile_pic}/>
                                    </div>

                                    <div className="col-lg-9" style={{marginLeft: '-20px'}}>
                                        <Link to={item.username===this.props.user.username?'/dashboard/'+ item.username:'/profile/'+ item.username}><h6 className="profile-username">{item.fullname}</h6></Link>
                                        <p className="home-timestamp">{item.timeStamp}</p>
                                    </div>
                                    {item.username===this.props.user.username?
                                        <div className="col-lg-2">
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
                                             src={'http://localhost:8000' + item.thumbnail}
                                             alt="Image Title"/>
                                    </a>
                                    <div className="postcard__text t-dark">
                                        <h1 className="postcard__title yellow">{item.title.substring(0, 25) + '...'}</h1>
                                        <div className="postcard__subtitle small">
                                            <time dateTime="2020-05-25 12:00:00">
                                                <i className="fas fa-calendar-alt mr-2"></i>{item.timeStamp}</time>
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
                                                        <img src='http://localhost:8000/media/images/redHeart.png' height={'35px'}/>
                                                    ):(
                                                        <img src='http://localhost:8000/media/images/heart2.png' height={'35px'}/>
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
                                                                                        src={'http://127.0.0.1:8000/media/' + comnt.profile_pic}
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
                    <div className="col-lg-2">
                        <Link to={'/write-article'}><button className="myBtn" style={{marginTop: "30px"}}>
                            Write Article
                        </button></Link>
                    </div>
                </div>
            </>
                :<Redirect to={'/login'}/>}
            </div>
            )
    }
};

const mapStateToProps = state =>({
    user:state.userData.cardData
})

export default connect(mapStateToProps)(home)

