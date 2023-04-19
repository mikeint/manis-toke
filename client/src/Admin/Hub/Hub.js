import React from 'react';
import './Hub.css';
import AuthFunctions from '../../AuthFunctions';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import Loader from '../../components/Loader/Loader';

class Hub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: false,
            user: '',
            cardList: '',
            searchTerm: '',
        };
        this.Auth = new AuthFunctions();
    }

    componentDidMount = () => {
        this.setCardList();
    };

    setCardList = () => {
        axios
            .get('/api/cards/cardList')
            .then((res) => {
                this.setState({
                    cardList: res.data,
                });
                console.log('cards OBJ-->', this.state.cardList);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    isSearched = (searchTerm) => (item) => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    onSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const cards = this.state.cardList
            ? this.state.cardList.filter(this.isSearched(this.state.searchTerm)).map((card, i) => (
                  <Link to={'/addCard/' + card._id} key={card._id} className={'hub ' + card.strain}>
                      <img className="imgStyle" src={'/api/cards/image/' + card._id + '/company_image'} alt={'img' + i} />
                      <div className="cardName">{card.name}</div>
                  </Link>
              ))
            : '';

        return (
            <React.Fragment>
                <NavBar deleteButton={false} />
                <div className="userInfo">
                    <div className="userInfo_name">Name: {this.props.user.name}</div>
                    <div className="userInfo_email">Email:{this.props.user.email}</div>
                </div>

                <div className="adminCarContainer">
                    <form className="searcher">
                        <input
                            name={name}
                            placeholder="Search . . ."
                            type="text"
                            value={this.state.searchTerm}
                            onChange={this.onSearchChange}
                        />
                    </form>

                    {cards ? <div className="hubContainer">{cards}</div> : <Loader />}
                </div>
            </React.Fragment>
        );
    }
}

export default Hub;
