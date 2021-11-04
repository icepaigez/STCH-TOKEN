import React, { Component } from "react";
import "./main.css";

class Main extends Component {

	constructor() {
		super()
		this.state = {
			etherAmount:""
		}
	}

	getEtherAmount = e => {
		this.setState({
			etherAmount: e.target.value
		}, () => {
			this.props.sendEtherAmount(this.state.etherAmount) //send the ether amount to the parent
		})
	}

	updateEtherAmount = () => {
		this.setState({
			etherAmount: ""
		})
	}

	render() {
		const { buyTokens } = this.props;
		const { etherAmount } = this.state;
		return(
			<div className="main">
				<input value={etherAmount} onChange={this.getEtherAmount} type="text" placeholder="EtherAmount"/>
				<button onClick={buyTokens} className="buy_token">Buy Stch Tokens</button>
			</div>
		)
	}
}

export default Main;