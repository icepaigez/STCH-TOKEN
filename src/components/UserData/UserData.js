import React, { useState } from "react";
import "./user_data.css";

const User = ({ user, web3 }) => {
	const [balance, setBalance] = useState("")
	if (user && Object.keys(web3).length !== 0) {
		web3.eth.getBalance(user).then(result => {
			result = Number(web3.utils.fromWei(result))
			result = String(result.toFixed(4))
			setBalance(result)
		})
	}
	
	return(
		<div className="user_data">
			<div>MATIC: { balance }</div>
			<div>STCH TOKENS: 0</div>
		</div>
	)
}

export default User;