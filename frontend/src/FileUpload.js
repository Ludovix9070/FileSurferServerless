import React, {Component} from "react";
import {getUser, resetUserSession} from './service/AuthService';
import axios from "axios";

class FileUpload extends Component {

    user = getUser();
    state = {
        selectedFile: null,
        fileUploadSuccessfully: false,
        email: ''
    }
    
    onFileChange = event => {
        this.setState({selectedFile: event.target.files[0]});
    }

    onFileUpload = () => {
        const formData = new FormData();
        if (this.state.selectedFile === null){
          if (window.confirm('Please choose a file to convert!')) {
            window.location.reload();
          };
        }
        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name,
        )

        formData.append("email", this.state.email);
        
        //call api to upload the file
        axios.post(" https://891mazmbm6.execute-api.us-east-1.amazonaws.com/prod/file-upload", formData).then(() => {
            this.setState({selectedFile: null});
            this.setState({fileUploadSuccessfully: true});
        }) 
    }

    fileData = () => {
        if(this.state.selectedFile){
          var date = new Date(this.state.selectedFile.lastModified);
          return(
            <div>
              <br/>
              <h3>File Details:</h3>
              
              <p>File Name: {this.state.selectedFile.name}</p>
              <p>File Type: {this.state.selectedFile.type}</p>
              <p>Last Modified: {" "}
                  {date.getDate()+ "-" + date.getMonth() + "-" + date.getFullYear() + " at time: " + date.getHours() + ":" + date.getMinutes()}
              </p>
              <br/>
            </div>
          );
        
        } else if(this.state.fileUploadSuccessfully){
          return (
            <div>
              <br />
              <br/>
              <h4>Your file has been successfully uploaded! </h4>
              <br/>
            </div>
          );
        } else {
          return (
            <div>
              <br /><br/>
              <h4>Choose a file and then press the Upload button! </h4><br/>
            </div>
          )
        }
    }

    ///////////////////////////////////////////////////////////
    
    render(){

        let user = getUser();
        let email = user !== 'undefined' && user ? user.email : '';
        this.state.email = email;

        const logoutHandler = () => {
            resetUserSession();
            this.props.history.push('/login');
        }

        return (
            <div className="container">
                <h2> Filesurfer Converter System </h2>
                <br/>
                <h3> File Upload with React and a Serverless API! </h3>
                <br/><br/>
                <div>
                    <input type="file" accept=".csv" onChange={this.onFileChange}/>
                    <button onClick={this.onFileUpload}>
                        Upload
                    </button>
                </div>
                {this.fileData()}
                Hello <p class="emailclass">{this.state.email}!</p> <br/>You have been loggined in!!! Welcome to the jungle! <br/>
                <br/><br/>
                <input class="button" style={{'--clr': '#1ab5d4'}} type="button" value="Logout" onClick={logoutHandler}/>
            </div>    
        )
    }
    
    
}

export default FileUpload;