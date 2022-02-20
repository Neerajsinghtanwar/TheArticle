import React from "react";
import { CKEditor } from "ckeditor4-react";
import { connect } from "react-redux";
import {axios} from "../../Store/actions/actions";
import '../HomePage/Home.css'
import $ from "jquery";

class EditArticle extends React.Component {

  state = {
    show: false,
    content: null,
    thumbnail: null,
    title: null,
    description: null,
    category: null,
    categories: null,

  };

  componentDidMount = () => {
    this.loadCategories()
    this.loadArticleInstance()

  }

  handleFileSelected = (e) => {
    const files = e.target.files[0];
    console.log(files)
    this.setState({thumbnail: files});
  };

  loadCategories = () => {
    let endpoint = `create-article`
    let token = this.props.user.token

    axios
      .get(endpoint, token)
      .then((response) => {

      const responseData = response.data;
      this.setState({categories: responseData.category})
    });
  };

  loadArticleInstance = () => {
    let url = window.location.pathname;

    url = url.split("/");
    let id = url[url.length - 1];
    let endpoint = `edit-article/${id}`
    let token = this.props.user.token

    axios
      .get(endpoint, token)
      .then((response) => {

      const responseData = response.data.blog[0];
      this.setState({title: responseData.title})
      this.setState({category: responseData.category})
      this.setState({description: responseData.description})
      this.setState({content: responseData.content})
      // this.setState({thumbnail: responseData.thumbnail})

    });
  };

  save = () => {
    let data = new FormData();

    if (this.state.title === null) {
      document.getElementById("titlevalid").innerText =
          "*this field is required";
    } else {
      document.getElementById("titlevalid").innerText = "";
    }
    if (this.state.description == null) {
      document.getElementById("descvalid").innerText =
          "*this field is required";
    } else {
      document.getElementById("descvalid").innerText = "";
    }
    if (this.state.content == null) {
      document.getElementById("contentvalid").innerText =
          "*this field is required";
    } else {
      document.getElementById("contentvalid").innerText = "";
    }
    if (
        this.state.title !== null &&
        this.state.description !== null &&
        this.state.content !== null
    ) {

      data.append("title", this.state.title);
      data.append("category", this.state.category);
      data.append("user", this.props.user.username);
      data.append("description", this.state.description);
      data.append("thumbnail", this.state.thumbnail);
      data.append("content", this.state.content);

      let url = window.location.pathname;

      url = url.split("/");
      let id = url[url.length - 1];

      let endpoint = `edit-article/${id}`
      let token = this.props.user.token

      axios
        .patch(endpoint, data, token)
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
      });
    }

  };

  showOutput = () => {
    this.setState({show: !this.state.show})
  };

  render() {
    const show = this.state.show
    return (
        <div>
          <div
              style={{textAlign: "center", position: "relative", width: "100%"}}
              id="last_updated"
          />

          <div className="container-fluid" style={{padding: "35px"}}>

            <div className="section-header container">
                <h1 className="today">Edit Article</h1>
            </div>

            <div style={{marginTop: "-70px"}}>
              <button
                  className="myBtn"

                  onClick={this.showOutput}
                  id="btn1995"
              >
                {this.state.show ? "Hide Output" : "Show Output"}
              </button>
              </div>

            <div className={this.state.show ? "row" : null}
                style={{textAlign: "center", marginTop: "130px"}}
                id="live_editor"
            >
              <div id="myDIV" className={this.state.show ? "col-sm-6" : "container"}>
                <br/>
                <label>Title:</label>
                <input
                    type="text"
                    value={this.state.title}
                    onChange={(e) => this.setState({title: e.target.value})}
                    id="title_write_article"
                    className="form-control"
                    placeholder="Title"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                />
                <p style={{color: "red", textAlign: "left"}} id="titlevalid"></p>
                <br/>
                <label>Category:</label>
                <select className="browser-default custom-select" onChange={(e) => this.setState({category: e.target.value})} >
                  {this.state.categories?this.state.categories.map((item, index) => (
                  <option value={item} selected={this.state.category===item?this.state.category:null}>{item}</option>
                  )):null};
                </select>
                <br/>
                <br/>
                <br/>
                <label>Description:</label>
                <input
                    type="text"
                    value={this.state.description}
                    id="description_write_article"
                    className="form-control"
                    onChange={(e)=>this.setState({description: e.target.value})}
                    placeholder="Concise and catchy description of your article in 250 characters"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                />
                <p style={{color: "red", textAlign: "left"}} id="descvalid"></p>
                <br/>

                <label>Content:</label>
                {this.state.content?
                <CKEditor
                    initData={this.state.content}
                    config={{
                      extraPlugins: [
                        "justify",
                        "showblocks",
                        "preview",
                        "font",
                        "div",
                        "colorbutton",
                        "autogrow",
                        "image",
                        "flash",
                        "smiley",
                        "iframe",
                        "find",
                        "filebrowser",
                        "uploadimage",
                      ],
                      filebrowserUploadMethod: "form",
                      filebrowserImageUploadUrl: "/upload/",
                    }}
                    type="classic"
                    onResize={() => $("#cke_editor1").css("width", "100%")}
                    onChange={(evt) => this.setState({content: evt.editor.getData()})}
                />
                :null}

                <p style={{color: "red", textAlign: "left"}} id="contentvalid"/>
                <br/>

                <label>Thumbnail:</label>
                <input
                    type="file"
                    name="file"
                    id="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    onChange={this.handleFileSelected}
                />
                <p style={{color: "red", textAlign: "left"}} id="thumbnailvalid" ></p>
                <br/>

                <input
                    onClick={this.save}
                    type="submit"
                    className="btn btn-primary"
                    value="Save"
                />
                <br/>
                <br/>
                <br/>
              </div>

              {show ? (
                  <div className="myText col-sm-6">
                    <br/>
                    <h3>Output</h3>
                    <hr/>
                    <div style={{height: "800px"}}>
                      <div
                          style={{textAlign: "justify"}}
                          dangerouslySetInnerHTML={{__html: this.state.content}}
                      ></div>
                    </div>
                  </div>
              ) : null}
            </div>
          </div>
        </div>
    );
  };
};

const mapStateToProps = state =>({
    user:state.userData.cardData
})

export default connect(mapStateToProps)(EditArticle);