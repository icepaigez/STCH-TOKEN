import React from 'react';
import Identicon from "identicon.js"
import "./navbar.css";

const Navbar = ({ user, connect, connected }) => {
	let data;
	if (user) {
		data = new Identicon(user, 420).toString();
	}
	return(
		<div className="navbar">
			<h1 className="logo">STCH</h1>
			{ connected ? <div className="user">
							{ user }
							<img width="30" height="30" alt="" src={`data:image/png;base64,${data}`}/>
						  </div> 
						: <div onClick={connect} className="wallet">Connect Wallet</div> }
		</div>
	)
}

export default Navbar;