import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
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
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    login = (e) => {
        e.preventDefault();
        axios
            .post('/api/users/login', {
                email: this.state.email,
                password: this.state.password,
            })
            .then((res) => {
                const token = res.data.token.replace(/Bearer/g, '').trim();

                this.Auth.setToken(token, () => {
                    this.setState({
                        token: token,
                    });
                });
                this.Auth.setUser(res.data.user, () => {
                    this.setState({ user: res.data.user });
                });
            });
    };

    render() {
        if (this.Auth.loggedIn()) {
            if (this.state.user) return <Navigate to="/hub" user={this.state.user} replace={true} />;
        }

        const { email, password } = this.state;

        return (
            <form className="loginContainer" onSubmit={this.login}>
                <div className="loginMiddle">
                    <div className="loginContent">
                        <input className="formControl" name="email" type="text" onChange={this.handleChange} value={email} />
                        <input className="formControl" name="password" type="password" onChange={this.handleChange} value={password} />
                        <button className="loginBtn" type="submit">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

export default Login;
