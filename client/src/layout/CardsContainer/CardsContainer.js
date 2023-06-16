import { useState, useEffect, useRef } from 'react';
import './CardsContainer.css';
import Loader from '../../components/Loader/Loader';
import Fire from '../../components/Fire/Fire';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import manisGif from '../images/manisGif.gif';
import manisGif21 from '../images/manisGif21.gif';
import manisGif22 from '../images/manisGif22.gif';

const CardsContainer = () => {
    const [cardList, setCardList] = useState([]);
    const isLoading = useRef(false);
    const { strain, type } = useParams();

    const fetchCards = () => {
        if (isLoading.current == false) {
            isLoading.current = true;
            axios
                .get('/api/cards/cardList', { params: { onReserve: true, strain: strain.toLowerCase(), type: type.toLowerCase() } })
                .then((res) => {
                    setCardList(res.data);
                    isLoading.current = false;
                    console.log('cards OBJ-->', res.data);
                })
                .catch(function (error) {
                    isLoading.current = false;
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        fetchCards();
        const interval = setInterval(() => {
            fetchCards();
        }, 720000);
        return () => clearInterval(interval);
    }, []);

    const cards = (
        <div className={'cardsBGcolor cardsBGcolor-' + strain}>
            <div className="cardsContainer">
                {cardList
                    ?.filter(
                        (card) => card.strain?.toLowerCase() === strain.toLowerCase() && card.type?.toLowerCase() === type.toLowerCase(),
                    )
                    // .sort((x, y) => parseFloat(y.thc) - parseFloat(x.thc))
                    .sort((x, y) => {
                        y = y.thc.split('-');
                        x = x.thc.split('-');
                        return parseFloat(y[y.length - 1]) - parseFloat(x[x.length - 1]);
                    })
                    .map((card, a) => {
                        return (
                            <div className="card" key={a}>
                                <div className="front">
                                    <section>
                                        <div className={'card__topContainer ' + card.strain}>
                                            <div className={'card__strain ' + card.strain}>{card.strain}</div>
                                            <div className={'card__strain-smtext ' + card.strain}>{card.type}</div>
                                            <div className={card.newCheckBtn ? 'card__newItem' : 'card__newItemHide'}>NEW</div>
                                            <div
                                                className={
                                                    card.recommendCheckBtn
                                                        ? card.newCheckBtn
                                                            ? 'card__reccoItem'
                                                            : 'card__reccoItem withoutNew'
                                                        : 'card__reccoItemHide'
                                                }
                                            >
                                                STAFF PICK
                                            </div>
                                        </div>
                                        <div className="card__bottomContainer">
                                            <div className="card__name">{card.name}</div>
                                            {card.nameCross ? <div className="card__nameCross">{card.nameCross}</div> : null}
                                            <div className="card__values-container">
                                                <div className={'card__values-thc ' + card.strain}>
                                                    <div className="card__values-thc-name">THC</div>
                                                    <div className="card__values-thc-value">{card.thc}%</div>
                                                </div>
                                                <div className={'card__values-cbd ' + card.strain}>
                                                    <div className="card__values-thc-name">CBD</div>
                                                    <div className="card__values-thc-value">{card.cbd}%</div>
                                                </div>
                                            </div>
                                            <div className="card__description">{card.description}</div>
                                            {card.company_image ? (
                                                <div className="card__image">
                                                    <img src={'/api/cards/image/' + card._id + '/company_image'} alt="company_image" />
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                            <div className="card__price-container">
                                                <div className="card__grams">{card.amount}</div>
                                                <div className="card__price">${card.price}</div>
                                            </div>
                                        </div>
                                        {card.onFire ? <Fire /> : null}
                                    </section>
                                </div>
                            </div>
                        );
                    })}

                {/* STATIC ADS */}
                {strain === 'indica' && type === 'pre-roll' ? (
                    <div className="card">
                        <img className="card__ad" src={manisGif} alt="ad" />
                    </div>
                ) : (
                    ''
                )}
                {strain === 'hybrid' ? (
                    <div className="card">
                        <img className="card__ad" src={manisGif21} alt="ad" />
                    </div>
                ) : (
                    ''
                )}
                {strain === 'hybrid' ? (
                    <div className="card">
                        <img className="card__ad" src={manisGif22} alt="ad" />
                    </div>
                ) : (
                    ''
                )}
                {/* end STATIC ADS */}
            </div>
        </div>
    );

    return cardList ? cards : <Loader />;
};

export default CardsContainer;
