import React from 'react';
import './AddCard.css'; 
import { Redirect} from "react-router-dom";
import axios from 'axios';
import AuthFunctions from '../../AuthFunctions';
import NavBar from '../NavBar/NavBar';
 
import 'sweetalert2/src/sweetalert2.scss'; 
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'

class AddCard extends React.Component{

    constructor(props){
        super(props);
        this.state={
            strain: '',
            type: '',
            name: '',
            thc: '',
            cbd: '',  
            description: '',
            amount: '',
            price: '',

            data_id: '', 
            thumbnail: '',
            default_img: '',  
            errors: '', 

            images: '',
        };
        this.Auth = new AuthFunctions();
    } 
    
	componentDidMount = () => {
        this.getCarImgs();
        if (localStorage.getItem('card_id') != null) this.setInputFields();
        this.getCardId();
    }
    

    getCardId = () => {
        return localStorage.getItem("card_id");
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

 
	getCarImgs = () => {
        var params = { params: { card_id: this.getCardId() } }
        
		axios.get('/api/cards/getImgs', params)
          .then((res)=>{
			//console.log(res.data)
			//return window.location = "/hub";
			this.setState({
				images: res.data
			})
		})
    }
    setInputFields = () => {
        var params = { params: { card_id: this.getCardId() } } 

        axios.get('/api/cards/getCardData', params)
        .then(res => {
            console.log(res.data[0])
            var data=res.data[0];
            this.setState({ 
                strain: data.strain || "",
                type: data.type || "",
                name: data.name || "",
                thc: data.thc || "",
                cbd: data.cbd || "",
                description: data.description || "",
                amount: data.amount || "",
                price: data.price || "",
            }); 

        })
        .catch(function (error) {
          console.log(error);
        })
    }



	addCarImg = () => {
		var input = document.querySelector('input[type="file"]').files[0];
		const data = new FormData(); 
		data.append('action', 'ADD');
		data.append('param', 0);
		data.append('secondParam', 0);
        data.append('cardid', this.getCardId());
        data.append('file', input, { type: 'multipart/form-data' });
        

		if (input) {
			axios.post('/api/cards/addCardImg', data).then((response) => {
				console.log(response)
				this.getCarImgs();
			});
		}
		this.clearFileInput("file");
	} 
	clearFileInput = (id) => { 
		var oldInput = document.getElementById(id);  
		var newInput = document.createElement("input");  
		newInput.type = "file"; 
		newInput.id = oldInput.id; 
		newInput.name = oldInput.name; 
		newInput.className = oldInput.className; 
		newInput.style.cssText = oldInput.style.cssText; 
		// TODO: copy any other relevant attributes 

		oldInput.parentNode.replaceChild(newInput, oldInput); 
    }
    deleteOneCarImg = (id) => {
		axios.delete('/api/cards/removeImg/'+id).then((response) => {
			console.log(response)
			this.getCarImgs();
		}); 
    }
    

    /* INPUT TEXT */
    addCard = () => {

        Swal({
            title: 'Are you sure?',
            text: "You can edit this card later", 
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!'
        }).then((result) => {
            if (result.value) {
 
                var config = {
                    headers: {'Authorization': 'Bearer ' + this.Auth.getToken(), 'Content-Type': 'application/json' }
                }; 
                var bodyParameters = {
                    strain: this.state.strain,
                    type: this.state.type,
                    name: this.state.name,
                    thc: this.state.thc,
                    cbd: this.state.cbd, 
                    description: this.state.description,
                    amount: this.state.amount,
                    price: this.state.price,
                    card_id: localStorage.getItem('card_id') || ''
                }
                axios.post(
                    '/api/cards/addCard',
                    bodyParameters,
                    config
                ).then((res)=>{
                    console.log("card added: ", res.data);
                    localStorage.removeItem("card_id");
                    return window.location = "/hub";
                }).catch(error => {
                    console.log(error.response.data.join(".\n"));
 
                    Swal({
                        title: "Some errors here:",
                        text: error.response.data.join(".\n"),
                        type: 'error',
                        animation: true,
                        customClass: 'animated tada'
                    }) 
                });
            }
        }) 
    }

    deleteFullCard = () => {
        
        Swal({
            title: 'Are you sure you want to remove this card and all its images?', 
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.value) {
                var config = {
                    headers: {'Authorization': 'Bearer ' + this.Auth.getToken(), 'Content-Type': 'application/json' }
                }; 
                var bodyParameters = {
                    card_id: this.getCardId(), 
                }
                axios.post('/api/cards/deleteFullCard', bodyParameters, config)
                .then((res)=>{
                    console.log("card removed: ", res.data);
                    localStorage.removeItem("card_id");
                    return window.location = "/hub";
                })
            }
        })
    }

    makePrime = (filename) => {
        var config = {
            headers: {'Authorization': 'Bearer ' + this.Auth.getToken(), 'Content-Type': 'application/json' }
        }; 
        var bodyParameters = {
            card_id: this.getCardId(),
            filename: filename,
        }
        axios.post('/api/cards/makePrime', bodyParameters, config)
        .then((res)=>{
            console.log("prime changes: ", res); 
            this.getCarImgs();
        })
    }
 
    render(){    
        if(this.state.logout){
            return <Redirect to='/login'/>
        }

        if (this.state.images) {
			var images = this.state.images.map((image, i) => (
				<div key={i} className="imgContainer">
                    <div className="primeImgBtn" onClick={() => this.makePrime(image.filename)}>
                        {image.metadata.primeImg === "yes" ? <div className="primeBanner">Prime Image</div> : ""}
                        <img id={image._id} className="imgStyle" src={"/api/cards/image/" + image.filename} alt={"img"+i} /> 
                          
                    </div>
					<div className="deleteImgBtn" onClick={() => this.deleteOneCarImg(image._id)}>Delete</div>
				</div>
			))
        }
        
        return (
            
            <React.Fragment>
                <NavBar 
                    deleteFullCard={this.deleteFullCard}
                    deleteButton={true}
                />  


                <div className="addImgContainer">
                    {images ? images : <div className="loadingContainer"><div className="loadContainer"><div className="load-shadow"></div><div className="load-box"></div></div></div>}
                    <div className="imgContainer">  
                        <div className="custom-file mb-3">
                            <input type="file" name="file" id="file" /> 
                        </div>
                        <div className="submitImg" onClick={this.addCarImg}>+</div>
                    </div>
                </div>
                


                <div className="addCarContainer">
                    <div className="inputContainer">
                        <input
                            name='strain'
                            type='text'
                            placeholder='Strain'
                            className='form-control'
                            onChange={this.handleChange}
                            value={this.state.strain}
                        />
                    </div>
                    <div className="inputContainer">
                        <input
                            name='type'
                            type='text'
                            placeholder='type'
                            className='form-control'
                            onChange={this.handleChange}
                            value={this.state.type}
                        />
                    </div>
                </div> 

                <div className='createBtnContainer'>
                    <div className='createBtn' onClick={this.addCard}>
                        <a target="_blank">Save</a>
                    </div>
                </div> 
            </React.Fragment>
        );
    }
};

export default AddCard;
