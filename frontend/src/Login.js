import React, {useState} from "react";
import { setUserSession } from "./service/AuthService";
import axios from 'axios';

const loginAPIUrl = 'https://891mazmbm6.execute-api.us-east-1.amazonaws.com/prod/login';

const Login = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const submitHandler = (event) => {
      event.preventDefault();
      if(email.trim() === '' || password.trim() === ''){
        setErrorMessage('Both username and password are required!');
        return;
      }

      setErrorMessage(null);
      const requestConfig = {
        headers: {
            'x-api-key': 'AWSOFGYQpg2EwcG41eiyXalnnBTPdhCJ6Q5SLdzy'
        }
      }

      const requestBody = {
        email: email,
        password: password
      }
      axios.post(loginAPIUrl, requestBody, requestConfig).then((response) => {
         setUserSession(response.data.user, response.data.token);
         props.history.push('/file-upload');
      }).catch((error) => {
        if(error.response.status === 401 || error.response.status === 403){
          setErrorMessage(error.response.data.message);
        }else{
          setErrorMessage('sorry... the backend is down! please try again later!');
        }
      })
    }

    return (
        <div class="logincss">
          <form onSubmit={submitHandler}>
            <h3 style={{color: 'rgb(163, 0, 203'}}>Login</h3>
            <br/>
            username <input type="text" value = {email} onChange={event => setEmail(event.target.value)}/><br/>
            <br/>
            password <input type="password" value = {password} onChange={event => setPassword(event.target.value)}/><br/>
            <br/><br/>
            <input class="button" style={{'--clr': '#1ab5d4'}} type="submit" value="Login" />
          </form>
          {errorMessage && <p className="message">{errorMessage}</p>}
        </div>
    )
}

export default Login;