import React, { Component } from 'react';
import './CardsContainer.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';

class CardsContainer extends Component {
    constructor(props){
        super(props);
        this.state={ 
            cardList: '', 
        } 
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
 
    render() {
        var i, j, slideArray=[], groupSize=12;

        for(i=0,j=this.state.cardList.length; i<j; i+=groupSize) 
            slideArray.push(this.state.cardList.slice(i, i+groupSize));

        const cards = slideArray.map((group, a) => {
            return (
                <div key={a} className="outerBox">
                    {group.map((card, b) => {
                        return (
                            <div key={b} className="box">
                                <figure className="effect-marley">
                                    <img src={"/api/cards/image/" + card.primeImg} alt="primeImg"/>
                                    <figcaption>
                                        <h2><span>{card.strain}</span></h2>
                                        <p>{card.type}</p>
                                    </figcaption>           
                                </figure>
                            </div>
                        )
                    })}
                </div>
            )
        })
 
        return (
            <div className='cardsContainer'>
                {this.state.cardList ?  
                    cards
                :
                <div className="loadingContainer"><div className="loadContainer"><div className="load-shadow"></div><div className="load-box"></div></div></div>   
                }
            </div>
        );
    }
}

export default CardsContainer;
