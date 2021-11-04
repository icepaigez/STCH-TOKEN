import React, { useState } from "react";

import "./user_data.css";

const User = ({ tokenPrice, tokenPriceLoading, connectedUser, token, web3 }) => {
	const [tokenBalance, getTokenBalance] = useState("")
	if (tokenPrice !== "") {
		tokenPrice = Number(tokenPrice)
		tokenPrice = String(tokenPrice.toFixed(7))
	}

	if (Object.keys(token).length !== 0 && connectedUser !== "") {
		token.methods.balanceOf(connectedUser).call().then(result => {
			result = web3.utils.fromWei(result)
			getTokenBalance(result)
		})
	}
	
	return(
		<div className="user_data">
			{ tokenPriceLoading ? (<div>1 STCH - Getting Cost in Eth... </div>) : (<div>1 STCH - { tokenPrice } ETH</div>) }
			{ tokenBalance === "" ? (<div>STCH: loading...</div>) : (<div>STCH: { tokenBalance }</div>) }
		</div>
	)
}

export default User;