import React from 'react';
import "./navbar.css";

const Navbar = ({ user }) => {
	return(
		<div className="navbar">
			<h1 className="logo">STCH</h1>
			<div className="wallet">Connect Wallet</div>
		</div>
	)
}

export default Navbar;