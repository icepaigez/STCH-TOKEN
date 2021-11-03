import React from 'react';
import Identicon from "identicon.js"
import "./navbar.css";

const Navbar = ({ user, connect, connected }) => {
	let data;
	let shortenedUser;
	if (user) {
		data = new Identicon(user, 420).toString();
		shortenedUser = user.slice(0, 5) + "..." + user.slice(38, )
	}
	
	return(
		<div className="navbar">
			<h1 className="logo">STCH</h1>
			{ connected ? <div className="user">
							{ window.innerWidth < 611 ? shortenedUser : user }
							<img width="35" height="35" alt="" src={`data:image/png;base64,${data}`}/>
						  </div> 
						: <div onClick={connect} className="wallet">Connect Wallet</div> }
		</div>
	)
}

export default Navbar;