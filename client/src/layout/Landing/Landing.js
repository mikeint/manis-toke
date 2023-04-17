import React from 'react'; 
import { Route, BrowserRouter } from 'react-router-dom';
import './Landing.css';

import CardsContainer from '../CardsContainer/CardsContainer';

const Landing = () =>
	<BrowserRouter>
		<div>
			<Route exact path="/" component={CardsContainer} />
		</div>
	</BrowserRouter>

export default Landing;
