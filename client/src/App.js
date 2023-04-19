import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './Admin/Login/Login';
import AddCard from './Admin/AddCard/AddCard';
import CardsContainer from './layout/CardsContainer/CardsContainer';
import Hub from './Admin/Hub/Hub';
import AuthFunctions from './AuthFunctions';
import './App.css';

const App = () => {
    const Auth = new AuthFunctions();
    const [user, setUser] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        setUser(Auth.getUser() || ''), setToken(Auth.getToken() || '');
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/hub" element={<Hub user={user} token={token} />} />
                <Route exact path="/addCard/:cardId?" element={<AddCard />} user={user} token={token} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/strain/:strain" element={<CardsContainer />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
