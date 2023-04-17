import React, { Component } from "react";
import './Login.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import AuthFunctions from '../../AuthFunctions';

class Login extends Component {
    constructor() {
        super();
		this.state = {
            user: '',
			email: '',
			password: '',
            errors: {},
		};
        this.Auth = new AuthFunctions();
    }
 
    handleChange = (event) => {
        const target = event.target;
        const value = target.type==='checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    login = () => {
        axios.post('/api/users/login', {
            email: this.state.email,
            password: this.state.password
        })
        .then((res)=>{
            let token = res.data.token.replace(/Bearer/g, '').trim();

            this.Auth.setToken(token, ()=>{
                this.setState({
                    token: token
                })
            });
            this.Auth.setUser(res.data.user, ()=> {
                this.setState({
                    user: res.data.user
                })
            });
        })
    };

  
    render() {
 
        if(this.Auth.loggedIn()){
            if (this.state.user)
                return <Redirect to='/Hub' user={this.state.user}/>
        }

        const { email, password } = this.state
 
        return (
            <React.Fragment> 
                <div className="loginContainer">
                    <div className="loginMiddle">
                        <div className="loginContent">
                            <div className="formItem">
                                <label>Username</label>
                                <input className="formControl" name='email' type='text' onChange={this.handleChange} value={email} />
                            </div>
                            <div className="formItem">
                                <label>Password</label>
                                <input className="formControl" name='password' type='password' onChange={this.handleChange} value={password} />
                            </div> 
                            <button className='loginBtn' onClick={this.login}>Login</button> 
                        </div> 
                    </div>  
                </div> 
            </React.Fragment>
        );
    }
}

export default Login;