import React from 'react';
import '../index.css';


const imgUrl = '../src/logos/RoboBunny.jpg';

const PageNotFound = () => (
	<>
		<h1>404 Not Found</h1>
		<img src={imgUrl} id="robo-bunny" />
		<h1>Nothing to see here... Keep it movin</h1>

	</>

);

export default PageNotFound;