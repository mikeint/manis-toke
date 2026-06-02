import { useState, useEffect, useRef } from 'react';
import './CardsContainer.scss';
import Loader from '../../components/Loader/Loader';
import Fire from '../../components/Fire/Fire';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import manisGif from '../images/manisGif.gif';
import manisGif21 from '../images/manisGif21.gif';
import manisGif22 from '../images/manisGif22.gif';
import manis from '../images/manis.png';
import logo from '../images/logo.png';

const CardsContainer = () => {
    const [cardList, setCardList] = useState([]);
    const isLoading = useRef(false);
    const { strain, type } = useParams();

    // A strain of "*" means "show every strain" (e.g. /strain/*/type/edibles).
    const allStrains = strain === '*';

    // Map URL type tokens to the type value stored on the card (set by the AddCard dropdown).
    // Lets short/alternate URLs like /type/vape and /type/eddible match "Vapes" / "Edibles".
    const typeAliases = {
        vape: 'vapes',
        vapes: 'vapes',
        edible: 'edibles',
        edibles: 'edibles',
        eddible: 'edibles',
    };
    const normalizedType = typeAliases[type?.toLowerCase()] || type?.toLowerCase();

    const fetchCards = () => {
        if (!isLoading.current) {
            isLoading.current = true;
            axios
                .get('/api/cards/cardList', {
                    params: { onReserve: true, ...(allStrains ? {} : { strain: strain.toLowerCase() }), type: normalizedType },
                })
                .then((res) => {
                    setCardList(res.data);
                    isLoading.current = false;
                    // console.log('cards OBJ-->', res.data);
                })
                .catch((error) => {
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
        <div className={'cardsBGcolor cardsBGcolor-' + (allStrains ? 'all' : strain)}>
            <div className="cardsContainer">
                {(() => {
                    const filteredCards = cardList?.filter(
                        (card) =>
                            (allStrains || card.strain?.toLowerCase() === strain.toLowerCase()) &&
                            card.type?.toLowerCase() === normalizedType,
                    );

                    // All cards except 14g and 28g, sort by THC descending
                    const non14or28gCards = filteredCards
                        .filter((card) => card.amount !== '14g' && card.amount !== '28g')
                        .sort((x, y) => {
                            const yTHC = (y.thc || '').split('-');
                            const xTHC = (x.thc || '').split('-');
                            return (parseFloat(yTHC[yTHC.length - 1]) || 0) - (parseFloat(xTHC[xTHC.length - 1]) || 0);
                        });

                    // All 14g cards sorted by price ascending
                    const only14gCards = filteredCards
                        .filter((card) => card.amount === '14g')
                        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

                    // All 28g cards sorted by price ascending
                    const only28gCards = filteredCards
                        .filter((card) => card.amount === '28g')
                        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

                    // Final cards with spacers between groups in correct order
                    const isFlower = type?.toLowerCase() === 'flower';
                    const isEdibles = type?.toLowerCase() === 'edibles';
                    const isVapes = normalizedType === 'vapes';

                    let cardsWithSpacer;
                    if (isVapes) {
                        // Split vapes by vapeType, each group introduced by a labeled arrow spacer
                        const vapeCards = non14or28gCards.filter((card) => card.vapeType === 'vape');
                        const disposibleCards = non14or28gCards.filter((card) => card.vapeType === 'disposible');
                        const otherVapes = non14or28gCards.filter(
                            (card) => card.vapeType !== 'vape' && card.vapeType !== 'disposible',
                        );
                        cardsWithSpacer = [
                            vapeCards.length ? { isSpacer: true, id: 'spacerVapes', label: 'Vapes' } : null,
                            ...vapeCards,
                            disposibleCards.length ? { isSpacer: true, id: 'spacerDisposibles', label: 'Disposables' } : null,
                            ...disposibleCards,
                            ...otherVapes,
                        ].filter(Boolean);
                    } else if (isEdibles) {
                        // Split edibles by edibleType, each group introduced by a labeled arrow spacer
                        const gummieCards = non14or28gCards.filter((card) => card.edibleType === 'gummie');
                        const chocolateCards = non14or28gCards.filter((card) => card.edibleType === 'chocolate');
                        const otherEdibles = non14or28gCards.filter(
                            (card) => card.edibleType !== 'gummie' && card.edibleType !== 'chocolate',
                        );
                        cardsWithSpacer = [
                            gummieCards.length ? { isSpacer: true, id: 'spacerGummies', label: 'Gummies' } : null,
                            ...gummieCards,
                            chocolateCards.length ? { isSpacer: true, id: 'spacerChocolate', label: 'Chocolate' } : null,
                            ...chocolateCards,
                            ...otherEdibles,
                        ].filter(Boolean);
                    } else {
                        cardsWithSpacer = [
                            ...non14or28gCards,
                            isFlower ? { isSpacer: true, id: 'spacer1' } : null,
                            ...only14gCards,
                            isFlower ? { isSpacer: true, id: 'spacer2' } : null,
                            ...only28gCards,
                        ].filter(Boolean);
                    }

                    return cardsWithSpacer.map((card, index) => {
                        if (card.isSpacer)
                            return (
                                <div
                                    key={card.id}
                                    className={clsx('card card-flower card-spacer', card.id, { 'card-grid14x5': isVapes || isEdibles })}
                                >
                                    {card.label ? <div className="card-spacer__label">{card.label}</div> : null}
                                    <div className="arrow">
                                        <div className="arrow__wrapper">
                                            <span></span>
                                        </div>
                                        <div className="arrow__wrapper">
                                            <span></span>
                                        </div>
                                        <div className="arrow__wrapper">
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            );

                        const cardType = card.type?.toLowerCase();
                        const isGrid14x5 = cardType === 'vapes' || cardType === 'edibles';
                        return (
                            <div
                                className={clsx('card', {
                                    'card-flower': cardType === 'flower' || isGrid14x5,
                                    'card-grid14x5': isGrid14x5,
                                })}
                                key={card._id || index}
                            >
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
                                            {card.type === 'Edibles' && card.edibleType ? (
                                                <div className="card__edibleType">{card.edibleType}</div>
                                            ) : null}
                                            {card.type === 'Vapes' && card.vapeType ? (
                                                <div className="card__edibleType">
                                                    {card.vapeType === 'disposible' ? 'Disposable' : 'Vape'}
                                                </div>
                                            ) : null}
                                            {card.nameCross ? <div className="card__nameCross">{card.nameCross}</div> : null}
                                            {(() => {
                                                const values = [
                                                    { name: 'THC', value: card.thc },
                                                    { name: 'CBD', value: card.cbd },
                                                    { name: 'CBG', value: card.cbg },
                                                    { name: 'CBN', value: card.cbn },
                                                ].filter((v) => v.value);
                                                return (
                                                    <div className={'card__values-container card__values-container--' + values.length}>
                                                        {values.map((v) => (
                                                            <div className={'card__values-thc ' + card.strain} key={v.name}>
                                                                <div className="card__values-thc-name">{v.name}</div>
                                                                <div className="card__values-thc-value">{v.value}%</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                            {card.terpenes ? (
                                                <div className="card__terpenes">Terpenes {card.terpenes}%</div>
                                            ) : null}
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
                    });
                })()}

                {/* STATIC ADS */}
                {strain === 'indica' && type === 'pre-roll' ? (
                    <div className="card">
                        <img className="card__ad" src={manisGif} alt="ad" />
                    </div>
                ) : (
                    ''
                )}
                {strain === 'hybrid' && type === 'pre-roll' ? (
                    <div className="card">
                        <img className="card__ad" src={manisGif21} alt="ad" />
                    </div>
                ) : (
                    ''
                )}
                {strain === 'hybrid' && type === 'pre-roll' ? (
                    <div className="card">
                        <img className="card__ad" src={manisGif22} alt="ad" />
                    </div>
                ) : (
                    ''
                )}

                {type === 'flower' ? (
                    <div className="card card-flower">
                        <span className="card__ad-wrap">
                            <img className="card__ad card__ad_s card__ad__img" src={logo} alt="ad" />
                        </span>
                        <img className="card__ad_st" src={manis} alt="ad" />
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
