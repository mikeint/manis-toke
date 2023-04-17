import React from 'react';
import './Hub.css';  
import AuthFunctions from '../../AuthFunctions';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

class Hub extends React.Component{

    constructor(props){
        super(props);
        this.state={ 
            logout: false,
            user: '',
            cardList: '',
            searchTerm: '',
            tabState: '1',
        }
        this.Auth = new AuthFunctions();
    }

    componentDidMount = () => { 
        this.setCardList();
    }

    setCardList = () => {
        axios.get('/api/cards/cardList')
        .then(res => {
            this.setState({
                cardList: res.data
            });
            console.log("cards OBJ-->", this.state.cardList);
        })
        .catch(function (error) {
          console.log(error);
        }) 
    } 

    setCardId = (id) => {
        console.log(id);
        localStorage.setItem("card_id", id);
    } 

    isSearched = searchTerm => item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    onSearchChange = (event) => {
        //console.log(event.target.value)
        this.setState({ searchTerm: event.target.value });
    }
 
    render(){
        //console.log("HUBS PROPS: ", this.props)
        if(this.state.logout){
            return <Redirect to='/login'/>
        }

        const cards = this.state.cardList ? this.state.cardList.filter(this.isSearched(this.state.searchTerm)).map((card, i) => ( 
            <Link to="/addCard" key={card._id}>
                <div className="hub shadowEffect" onClick={() => this.setCardId(card._id)}>
                    <div className="adminPrimeImg"><img className="imgStyle" src={"/api/cards/image/" + card.primeImg} alt={"img"+i} /></div>
                    <div className="adminCarMake">{card.type}</div> 
                </div>
            </Link>
        )) : "" ;
        
        return (
            <React.Fragment>
                <NavBar deleteButton={false} />  
                <div className="userInfo">
                    <div className="userInfo_name">Name: {this.props.user.name}</div>
                    <div className="userInfo_email">Email:{this.props.user.email}</div>
                </div> 
  
                <div className='adminCarContainer'> 
                    <form className='searcher'>
                        <input
                            name={name} 
                            placeholder="Search . . ."
                            type='text'
                            value={this.state.searchTerm}
                            onChange={this.onSearchChange}
                        />
                    </form>
                     
                    {cards ? cards : <div className="loadingContainer"><div className="loadContainer"><div className="load-shadow"></div><div className="load-box"></div></div></div>}
                </div>

            </React.Fragment>
        );
    }
};

export default Hub;
