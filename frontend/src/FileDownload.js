import React, {useState} from "react";
import { resetUserSession } from "./service/AuthService";
import axios from 'axios';

const downloadAPIUrl = 'https://891mazmbm6.execute-api.us-east-1.amazonaws.com/prod/file-download';

const Download = (props) => {

    const [filename, setFilename] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    let state = {
        fileDownloadSuccessfully: false,
        respURL: ''
    }

    const submitHandler = (event) => {
      event.preventDefault();
      if(filename.trim() === ''){
        setErrorMessage('Filename is required!');
        return;
      }

      setErrorMessage(null);
      const requestConfig = {
        headers: {
            'x-api-key': 'AWSOFGYQpg2EwcG41eiyXalnnBTPdhCJ6Q5SLdzy'
        }
      }

      const requestBody = {
        filename: filename
      }

      axios.post(downloadAPIUrl, requestBody, requestConfig).then((response) => {
        state.fileDownloadSuccessfully = true;
        state.respURL = response.data;
        if (window.confirm('Your file is ready, please click "ok" to download!')) {
            window.location.href=state.respURL;
        };
      }).catch((error) => {
        state.fileDownloadSuccessfully = false;
        if(!error.response){
          if (window.confirm('File does not exists, please try again!')) {
            window.location.reload();
          };
        }else if(error.response.status === 401 || error.response.status === 403 || error.response.status === 404){
          setErrorMessage(error.response.data.message);
        }else{
          setErrorMessage('sorry... the backend is down! please try again later!');
        }
      })
    }

    const logoutHandler = () => {
        resetUserSession();
        props.history.push('/login');
    }

    let fileData = () => {
        if(state.fileDownloadSuccessfully){
          return (
            <div>
              <br />
              <h4>Your file has been successfully downloaded! URL: {state.respURL} </h4>
            </div>
          );
        } else {
          return (
            <div>
              <br />
              <h4>Please enter the filename and then press the Download button! </h4>
            </div>
          )
        }
    }
    

    return (
        <div className="container">
            <h2> Filesurfer Converter System </h2>
            <br/>
            <h3> File Upload with React and a Serverless API! </h3>
            <br/><br/>
            <div>
                <form onSubmit={submitHandler}>
                    filename <input type="text" value = {filename} onChange={event => setFilename(event.target.value)}/><br/><br/>
                    <input class="button" style={{'--clr': '#1ab5d4'}} type="submit" value="Download" />
                </form>
            </div>
            
            {fileData()}
            <br/>
            <input class="button" style={{'--clr': '#1ab5d4'}} type="button" value="Logout" onClick={logoutHandler}/>
            {errorMessage && <p className="message">{errorMessage}</p>}
        </div>    
    )
}

export default Download;