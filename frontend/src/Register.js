import React, {useState} from "react";
import axios from 'axios';

const registerUrl = 'https://891mazmbm6.execute-api.us-east-1.amazonaws.com/prod/register';

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const submitHandler = (event) => {
        event.preventDefault();
        if(email.trim() === '' || password.trim() === ''){
            setMessage('All field are required!');
            return;
        }
        
        setMessage(null);
        const requestConfig = {
            headers: {
                'x-api-key': 'AWSOFGYQpg2EwcG41eiyXalnnBTPdhCJ6Q5SLdzy'
            }
        }

        const requestBody = {
            email: email,
            password: password
        }

        axios.post(registerUrl, requestBody, requestConfig).then(response => {
            setMessage('Registration successful');
        }).catch(error => {
            if(error.response.status === 401 || error.response.status === 403){
                setMessage(error.response.data.message);
            } else {
                setMessage('sorry... the backend server is down!, please try again later!'); 
            }
        })
    } 

    return (
        <div class="registercss">
            <form onSubmit={submitHandler}>
                <h3>Register</h3>
                <br/>
                username <input type="email" value={email} onChange={event => setEmail(event.target.value)} /> <br/>
                <br/>
                password <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
                <br/><br/>
                <input class="button" style={{'--clr': '#1ab5d4'}} type="submit" value="Register" />
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    )
}

export default Register;