import React, { useState } from "react";
import "./user_data.css";

const User = ({ user, web3, tokenPrice }) => {
	const [balance, setBalance] = useState("")
	if (user && Object.keys(web3).length !== 0) {
		web3.eth.getBalance(user).then(result => {
			result = Number(web3.utils.fromWei(result))
			result = String(result.toFixed(4))
			setBalance(result)
		})
	}

	if (tokenPrice !== "") {
		tokenPrice = Number(tokenPrice)
		tokenPrice = String(tokenPrice.toFixed(7))
	}
	
	return(
		<div className="user_data">
			{/*<div>MATIC: { balance }</div> |*/}
			<div>1 STCH - { tokenPrice } ETH</div> 
			<div>STCH: 0</div>
		</div>
	)
}

export default User;