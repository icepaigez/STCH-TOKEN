import React, { Component } from 'react';
import Web3 from 'web3';
import TokenSwap from '../abis/TokenSwap.json';
import STCHToken from '../abis/STCHToken.json';
import Navbar from "./Navbar/Navbar";
import User from "./UserData/UserData";
import Main from "./Main/Main";
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {
      web3: {},
      connectedUser:"",
      connected: false,
      exch: {},
      token: {},
      userBalance:"",
      tokenPrice:"",
      etherAmount:"",
      tokenAmount:"",
      exchangeAddress:"",
      tokenPriceLoading: false,
    }
  }

  loadWeb3 = async() => {
    if (window.ethereum) {
      let web3 = await new Web3(Web3.givenProvider || "http://localhost:7545");
      this.setState({ web3 });
      await this.loadBlockchainData(web3);
    } else {
      alert('Please install a blockchain wallet')
    }
  }

  loadBlockchainData = async (web3) => {
    //The token exchange contract
    const exchangeAbi = TokenSwap.abi
    const networkId = await web3.eth.net.getId();
    const exchangeData = TokenSwap.networks;
    if (exchangeData[networkId] !== undefined) {
      const exchangeAddress = exchangeData[networkId].address;
      const exch = new web3.eth.Contract(exchangeAbi, exchangeAddress);
      this.setState({ exch, exchangeAddress })
      await this.getTokenPrice();
    } else {
      alert('Exchange Contract is not deployed to the detected network')
    }

    //The stchtoken contract
    const stchAbi = STCHToken.abi;
    const stchData = STCHToken.networks;
    if (stchData[networkId] !== undefined) {
      const stchAddress = stchData[networkId].address;
      const token = new web3.eth.Contract(stchAbi, stchAddress);
      this.setState({ token })
    }
  }

  connect = async () => {
    try {
      let acc = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (acc.length > 0) {
        localStorage.setItem("connected", true);
        this.setState({
          connectedUser: acc[0],
          connected: JSON.parse(localStorage.getItem("connected"))
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  getEtherAmount = value => {
    this.setState({
      etherAmount: value
    })
  }

  getTokenAmount = value => {
    this.setState({
      tokenAmount: value
    })
  }

  buyTokens = async() => {
    const { exch, etherAmount, connectedUser, web3 } = this.state;
    try {
      let tx = await exch.methods.buyToken().send({from:connectedUser, value:web3.utils.toWei(etherAmount, 'ether')})
      console.log(tx)
      this.refs.child.updateEtherAmount() //call the child function to clear the form when button is clicked
    } catch (err) {
      console.error("An error occurred when buying stch tokens", err)
    }
  }

  sellTokens = async() => {
    const { exch, tokenAmount, connectedUser, web3, token, exchangeAddress } = this.state;
    try {
      let approve = await token.methods.approve(exchangeAddress, web3.utils.toWei(tokenAmount, 'ether')).send({from:connectedUser});
      console.log("approved", approve)
      if (approve.status) {
        let tx = await exch.methods.sellToken(web3.utils.toWei(tokenAmount, 'ether')).send({from:connectedUser})
        console.log(tx)
        this.refs.child.updateTokenAmount()
      }
    } catch (err) {
      console.error("An error occurred when selling stch tokens", err)
    }
  }


  getTokenPrice = async() => {
    const { exch, web3 } = this.state;
    try {
      let tokenPrice = await exch.methods.tokenPriceInEth().call()
      if (tokenPrice !== "") {
        this.setState({
          tokenPriceLoading: true
        })
        tokenPrice = web3.utils.fromWei(tokenPrice)
         this.setState({ tokenPrice })
      }
    } catch (err) {
      console.error("An error occurred in getting the current token price from the blockchain >>", err)
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
  }

  async componentDidUpdate(prevProps, prevState) {
    const { web3 } = this.state;
    let acc = await web3.eth.getAccounts();
    let newConnection = JSON.parse(localStorage.getItem("connected"))
    if (prevState && prevState.connected !== newConnection) {
      this.setState({
        connected: newConnection,
        connectedUser: acc[0]
      })
    }
  }

  render() {
    const { connectedUser, connected, tokenPrice, tokenPriceLoading } = this.state;
    
    return (
      <div className="app">
        <Navbar user={connectedUser} connect={this.connect} connected={connected}/>
        <User tokenPriceLoading={tokenPriceLoading} tokenPrice={tokenPrice}/>
        <Main ref="child" sellTokens={this.sellTokens} buyTokens={this.buyTokens} sendEtherAmount={this.getEtherAmount} sendTokenAmount={this.getTokenAmount}/>
      </div>
    );
  }
}

export default App;
