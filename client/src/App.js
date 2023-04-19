import React, { Component } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './Admin/Login/Login';
import AddCard from './Admin/AddCard/AddCard';
import CardsContainer from './layout/CardsContainer/CardsContainer';
import Hub from './Admin/Hub/Hub';
import AuthFunctions from './AuthFunctions';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            token: '',
        };
        this.Auth = new AuthFunctions();
    }

    componentDidMount = () => {
        this.setState({
            user: this.Auth.getUser() || '',
            token: this.Auth.getToken() || '',
        });
    };

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path="/hub" element={<Hub user={this.state.user} token={this.state.token} />} />
                    <Route exact path="/addCard/:cardId?" element={<AddCard />} user={this.state.user} token={this.state.token} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/strain/:strain" element={<CardsContainer />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
