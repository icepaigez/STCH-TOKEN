import React from "react";
//import React, { useState } from "react";

import "./user_data.css";

const User = ({ tokenPrice, tokenPriceLoading }) => {
	// const [balance, setBalance] = useState("")
	// if (user && Object.keys(web3).length !== 0) {
	// 	web3.eth.getBalance(user).then(result => {
	// 		result = Number(web3.utils.fromWei(result))
	// 		result = String(result.toFixed(4))
	// 		setBalance(result) 
	// 	})
	// }

	if (tokenPrice !== "") {
		tokenPrice = Number(tokenPrice)
		tokenPrice = String(tokenPrice.toFixed(7))
	}
	
	return(
		<div className="user_data">
			{ tokenPriceLoading ? (<div>1 STCH - { tokenPrice } ETH</div>) : (<div>1 STCH - Getting Cost in Eth... </div>) }
			<div>STCH: 0</div>
		</div>
	)
}

export default User;