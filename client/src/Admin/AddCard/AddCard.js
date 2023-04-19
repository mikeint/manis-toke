import { useState, useMemo, useEffect } from 'react';
import './AddCard.css';
import axios from 'axios';
import AuthFunctions from '../../AuthFunctions';
import NavBar from '../NavBar/NavBar';
import 'sweetalert2/src/sweetalert2.scss';
import swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const AddCard = () => {
    const { cardId } = useParams();
    const [state, setState] = useState({
        strain: '',
        type: '',
        name: '',
        nameCross: '',
        thc: '',
        cbd: '',
        description: '',
        amount: '',
        price: '',
        data_id: '',
        thumbnail: '',
        default_img: '',
        errors: '',
        company_image: '',
        newCheckBtn: false,
        recommendCheckBtn: false,

        isloaded: false,
    });
    const Auth = useMemo(() => new AuthFunctions(), []);

    useEffect(() => {
        console.log(cardId);
        if (cardId != null) setInputFields();
    }, []);

    const handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setState({
            ...state,
            [name]: value,
        });
    };

    const setInputFields = () => {
        const params = { params: { card_id: cardId } };

        axios
            .get('/api/cards/getCardData', params)
            .then((res) => {
                console.log(res.data[0]);
                const data = res.data[0];
                setState({
                    ...state,
                    strain: data.strain || '',
                    type: data.type || '',
                    name: data.name || '',
                    nameCross: data.nameCross || '',
                    thc: data.thc || '',
                    cbd: data.cbd || '',
                    description: data.description || '',
                    amount: data.amount || '',
                    price: data.price || '',
                    newCheckBtn: data.newCheckBtn || false,
                    recommendCheckBtn: data.recommendCheckBtn || false,
                    isloaded: true,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const clearFileInput = (id) => {
        const oldInput = document.getElementById(id);
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.id = oldInput.id;
        newInput.name = oldInput.name;
        newInput.className = oldInput.className;
        newInput.style.cssText = oldInput.style.cssText;
        // TODO: copy any other relevant attributes

        oldInput.parentNode.replaceChild(newInput, oldInput);
    };

    /* INPUT TEXT */
    const addCard = () => {
        swal({
            title: 'Are you sure?',
            text: 'You can edit this card later',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!',
        }).then((result) => {
            if (result.value) {
                const input = document.querySelector('input[type="file"]').files[0];
                const data = new FormData();

                const config = {
                    headers: { Authorization: 'Bearer ' + Auth.getToken(), 'Content-Type': 'application/json' },
                };

                data.append('strain', state.strain);
                data.append('type', state.type);
                data.append('name', state.name);
                data.append('nameCross', state.nameCross);
                data.append('thc', state.thc);
                data.append('cbd', state.cbd);
                data.append('description', state.description);
                data.append('amount', state.amount);
                data.append('price', state.price);
                data.append('card_id', cardId || '');
                data.append('newCheckBtn', state.newCheckBtn || false);
                data.append('recommendCheckBtn', state.recommendCheckBtn || false);
                input ? data.append('company_image', input, { type: 'multipart/form-data' }) : '';

                axios
                    .post('/api/cards/addCard', data, config)
                    .then((res) => {
                        console.log('card added: ', res.data);
                        cardId;
                        return (window.location = '/hub');
                    })
                    .catch((error) => {
                        swal({
                            title: 'Some errors here:',
                            text: error.response.data,
                            type: 'error',
                            animation: true,
                            customClass: 'animated tada',
                        });
                    });
                clearFileInput('company_image');
            }
        });
    };

    const deleteFullCard = () => {
        swal({
            title: 'Are you sure you want to remove this card and all its images?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
        }).then((result) => {
            if (result.value) {
                const config = {
                    headers: { Authorization: 'Bearer ' + Auth.getToken(), 'Content-Type': 'application/json' },
                };
                const bodyParameters = {
                    card_id: cardId,
                };
                axios.post('/api/cards/deleteFullCard', bodyParameters, config).then((res) => {
                    console.log('card removed: ', res.data);
                    return (window.location = '/hub');
                });
            }
        });
    };

    const handleImageChange = (e) => {
        const files = e.target.files[0];

        if (files) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(files);
            fileReader.addEventListener('load', function () {
                setState({
                    ...state,
                    company_image_new: this.result,
                });
            });
        }
    };
    {
        return state.isloaded || cardId === undefined ? (
            <>
                <NavBar deleteFullCard={deleteFullCard} deleteButton={true} />

                <div className="cardsContainer cardsContainer_static">
                    <div className="card card_static">
                        <div className="front">
                            <section>
                                <div className={'card__topContainer ' + state.strain}>
                                    <div className="card__strain">
                                        <select
                                            name="strain"
                                            type="text"
                                            placeholder="Strain"
                                            className={'form-strain ' + state.strain}
                                            onChange={handleChange}
                                            value={state.strain}
                                        >
                                            <option value="Indica">Indica</option>
                                            <option value="Sativa">Sativa</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    <div className={'card__strain-smtext ' + state.strain}>
                                        <input
                                            name="type"
                                            type="text"
                                            placeholder="type"
                                            className="form-type"
                                            onChange={handleChange}
                                            value={state.type}
                                        />
                                    </div>
                                </div>
                                <div className="card__bottomContainer">
                                    <div className="card__name card__name_static">
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Strain Name"
                                            className="form-name"
                                            onChange={handleChange}
                                            value={state.name}
                                        />
                                    </div>
                                    <div className="card__name card__name_static">
                                        <input
                                            name="nameCross"
                                            type="text"
                                            placeholder="Cross Name"
                                            className="form-name"
                                            onChange={handleChange}
                                            value={state.nameCross}
                                        />
                                    </div>
                                    <div className="card__values-container">
                                        <div className={'card__values-thc card__values-thc_static ' + state.strain}>
                                            <div className="card__values-thc-name">THC</div>
                                            <div className="card__values-thc-value">
                                                <input
                                                    name="thc"
                                                    type="text"
                                                    placeholder="thc"
                                                    className="form-thc"
                                                    onChange={handleChange}
                                                    value={state.thc}
                                                />
                                                %
                                            </div>
                                        </div>
                                        <div className={'card__values-cbd card__values-thc_static ' + state.strain}>
                                            <div className="card__values-thc-name">CBD</div>
                                            <div className="card__values-thc-value">
                                                <input
                                                    name="cbd"
                                                    type="text"
                                                    placeholder="cbd"
                                                    className="form-thc"
                                                    onChange={handleChange}
                                                    value={state.cbd}
                                                />
                                                %
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card__description card__description_static">
                                        <textarea
                                            name="description"
                                            type="text"
                                            placeholder="description"
                                            className="form-description"
                                            onChange={handleChange}
                                            value={state.description}
                                        />
                                    </div>
                                    <div className="card__image card__image_static">
                                        <div className="addImgContainer">
                                            <div className="imgContainer imgContainer_static">
                                                <input
                                                    type="file"
                                                    name="company_image"
                                                    id="company_image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <img
                                                    className="imgStyle"
                                                    src={
                                                        state.company_image_new
                                                            ? state.company_image_new
                                                            : '/api/cards/image/' + cardId + '/company_image'
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card__price-container card__price-container_static">
                                        <div className="card__grams">
                                            <input
                                                name="amount"
                                                type="text"
                                                placeholder="amount"
                                                className="form-amount"
                                                onChange={handleChange}
                                                value={state.amount}
                                            />
                                        </div>
                                        <div className="card__price">
                                            $
                                            <input
                                                name="price"
                                                type="text"
                                                placeholder="price"
                                                className="form-price"
                                                onChange={handleChange}
                                                value={state.price}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="back">
                            <section>
                                <div className="weed_image"></div>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="setNewContainer">
                    <input type="checkbox" className="newCheckBtn" name="newCheckBtn" onChange={handleChange} checked={state.newCheckBtn} />
                    <label htmlFor="newCheckBtn" className="newCheckLbl">
                        New
                    </label>
                </div>

                <div className="setNewContainer">
                    <input
                        type="checkbox"
                        className="newCheckBtn"
                        name="recommendCheckBtn"
                        onChange={handleChange}
                        checked={state.recommendCheckBtn}
                    />
                    <label htmlFor="recommendCheckBtn" className="newCheckLbl">
                        Recommend
                    </label>
                </div>

                <div className="createBtnContainer">
                    <div className="createBtn" onClick={addCard}>
                        <a target="_blank">SAVE</a>
                    </div>
                </div>
            </>
        ) : (
            <>
                <NavBar />
                <Loader />
            </>
        );
    }
};

export default AddCard;
