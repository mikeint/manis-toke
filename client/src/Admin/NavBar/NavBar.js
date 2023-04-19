import React from 'react';
import './NavBar.css';
import { Navigate } from 'react-router-dom';
import AuthFunctions from '../../AuthFunctions';
import { Link } from 'react-router-dom';
import axios from 'axios';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: false,
        };
        this.Auth = new AuthFunctions();
    }

    /* ...NAV BAR functions... */
    addTempCar = () => {
        const config = {
            headers: { Authorization: 'Bearer ' + this.Auth.getToken(), 'Content-Type': 'application/json' },
        };

        if (localStorage.getItem('card_id') === null) {
            axios.post('/api/cards/addCar_temp', '', config).then((res) => {
                console.log('temp card added to db and local: ', res.data);
                localStorage.setItem('card_id', res.data._id);
            });
        } else {
            console.log('card_id already set');
            // localStorage.removeItem("card_id");
        }
    };

    handleLogout = () => {
        this.Auth.logout();
        this.setState({ logout: true });
    };
    /* ...NAV BAR functions... */

    render() {
        if (this.state.logout) {
            return <Navigate to="/login" />;
        }
        return (
            <React.Fragment>
                <header className="navbar">
                    <Link to="/hub">
                        <div className="topTitle">Hub</div>
                    </Link>
                    <ul>
                        <li>
                            <div className="admNavBtn" onClick={this.handleLogout}>
                                <a target="_blank">Log Out</a>
                            </div>
                        </li>
                        {this.props.deleteButton ? (
                            <li>
                                <div className="removeFullCarButton" onClick={this.props.deleteFullCard}>
                                    REMOVE CARD
                                </div>
                            </li>
                        ) : (
                            ''
                        )}
                        {!this.props.deleteButton ? (
                            <li>
                                <Link to="/addCard">
                                    <div onClick={() => this.addTempCar} className="admNavBtn">
                                        Add Card
                                    </div>
                                </Link>
                            </li>
                        ) : (
                            ''
                        )}
                    </ul>
                </header>
            </React.Fragment>
        );
    }
}

export default NavBar;
