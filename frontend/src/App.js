import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import FileUpload from "./FileUpload";
import FileDownload from "./FileDownload";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoutes";
import React, { useEffect, useState } from "react";
import { getUser, getToken, setUserSession, resetUserSession } from "./service/AuthService";
import axios from "axios";

const verifyTokenAPIUrl = 'https://891mazmbm6.execute-api.us-east-1.amazonaws.com/prod/verify';

function App() {

 
  document.title="FileSurfer";
  

  const [isAuthenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const token = getToken();
    if(token === 'undefined' || token === undefined || token === null || !token){
      return;
    }

    const requestConfig = {
      headers: {
          'x-api-key': 'AWSOFGYQpg2EwcG41eiyXalnnBTPdhCJ6Q5SLdzy'
      }
    }

    const requestBody = {
      user: getUser(),
      token: token
    }

    axios.post(verifyTokenAPIUrl, requestBody, requestConfig).then(response => {
      setUserSession(response.data.user, response.data.token);
      setAuthenticating(false); //se il token è stato validato
    }).catch(() => {
      resetUserSession();
      setAuthenticating(false); //se l'autenticazione è completata
    })

  }, []);

  const token = getToken();
  if(isAuthenticating && token){
    return <div className="content"> Authenticating ...</div>
  }

  return (
    
    <div className="App">
      <br/>
      <div id="logo">
			  <center><img class="logocss" src={require('./static/fss.png')} width="200px" height="130px" alt="FileSurfer" /></center>
		  </div>
      <BrowserRouter>
      <div>
        <nav class="links" style={{'--items': 4}}>
          <NavLink activeClassName="selected" to="/register">Register</NavLink>
          <NavLink exact activeClassName="selected" to="/login">Login</NavLink>
          <NavLink activeClassName="selected" to="/file-upload">Upload</NavLink>
          <NavLink activeClassName="selected" to="/file-download">Download</NavLink>
          <span class="line"></span>
        </nav>
        
      </div>
      <div className="content">
        <Switch>
          <PublicRoute exact path="/" component={Login}/>
          <PublicRoute path="/register" component={Register}/>
          <PublicRoute path="/login" component={Login}/>
          <PrivateRoute path="/file-upload" component={FileUpload}/>
          <PrivateRoute path="/file-download" component={FileDownload}/>
        </Switch>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
