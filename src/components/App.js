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
      etherAmount:""
    }
  }

  loadWeb3 = async() => {
    if (window.ethereum) {
      let web3 = await new Web3(Web3.givenProvider || "http://localhost:7545");
      this.setState({ web3 });
      await this.loadBlockchainData(web3);
      await this.getTokenPrice();
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
      this.setState({ exch })
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

  buyTokens = async () => {
    const { exch, etherAmount } = this.state;
    console.log(etherAmount)
    this.refs.child.updateEtherAmount() //call the child function to clear the form when button is clicked
  }


  getTokenPrice = async() => {
    const { exch, web3 } = this.state;
    try {
      let tokenPrice = await exch.methods.tokenPriceInEth().call()
      tokenPrice = web3.utils.fromWei(tokenPrice)
      this.setState({ tokenPrice })
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
    const { connectedUser, connected, web3, tokenPrice } = this.state;
    
    return (
      <div className="app">
        <Navbar user={connectedUser} connect={this.connect} connected={connected}/>
        <User tokenPrice={tokenPrice} user={connectedUser} web3={web3}/>
        <Main ref="child" buyTokens={this.buyTokens} sendEtherAmount={this.getEtherAmount}/>
      </div>
    );
  }
}

export default App;
