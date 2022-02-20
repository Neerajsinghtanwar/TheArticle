import React from "react";
import { CKEditor } from "ckeditor4-react";
import { connect } from "react-redux";
import {axios} from "../../Store/actions/actions";
import '../HomePage/Home.css'
import $ from "jquery";

class WriteArticle extends React.Component {

  state = {
    show: false,
    content: null,
    thumbnail: null,
    title: null,
    description: null,
    category: null,
    categories: null
  };

  componentDidMount() {
    this.loadCategories()
  }

  handleFileSelected = (e) => {
    const files = e.target.files[0];
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

    let endpoint = `create-article`
    let token = this.props.user.token

    axios
      .post(endpoint, data, token)
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
    console.log({"cat":this.state.category})

    return (
        <div>
          <div
              style={{textAlign: "center", position: "relative", width: "100%"}}
              id="last_updated"
          />

          <div className="container-fluid" style={{padding: "35px"}}>

            <div className="section-header container">
                <h1 className="today">Publish New Article</h1>
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
                    // onChange={this.setState({content: e.target.value})}
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
                  // <option selected>Open this select menu</option>
                  <option value={item} >{item}</option>
                  )):null};
                </select>
                <br/>
                <br/>
                <br/>
                <label>Description:</label>
                <input
                    type="text"
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
                <CKEditor
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


export default connect(mapStateToProps)(WriteArticle);