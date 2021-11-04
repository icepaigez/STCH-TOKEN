import React, { Component } from "react";
import "./main.css";

class Main extends Component {

	constructor() {
		super()
		this.state = {
			etherAmount:"",
			tokenAmount:""
		}
	}

	getEtherAmount = e => {
		this.setState({
			etherAmount: e.target.value
		}, () => {
			this.props.sendEtherAmount(this.state.etherAmount) //send the ether amount to the parent
		})
	}

	getTokenAmount = e => {
		this.setState({
			tokenAmount: e.target.value
		}, () => {
			this.props.sendTokenAmount(this.state.tokenAmount)
		})
	} 

	updateEtherAmount = () => {
		this.setState({
			etherAmount: ""
		})
	}

	updateTokenAmount = () => {
		this.setState({
			tokenAmount:""
		})
	}

	render() {
		const { buyTokens, sellTokens } = this.props;
		const { etherAmount, tokenAmount } = this.state;
		return(
			<div className="main">
				<div className="buying">
					<input value={etherAmount} onChange={this.getEtherAmount} type="text" placeholder="EtherAmount"/>
					<button onClick={buyTokens} className="buy_token">Buy Stch Tokens</button>
				</div>
				<div className="selling">
					<input onChange={this.getTokenAmount} value={tokenAmount} type="text" placeholder="TokenAmount"/>
					<button onClick={sellTokens} className="sell_token">Sell Stch Tokens</button>
				</div>
			</div>
		)
	}
}

export default Main;