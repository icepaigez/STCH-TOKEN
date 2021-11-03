import React, { Component } from 'react';
import Web3 from 'web3';
import TokenSwap from '../abis/TokenSwap.json';
import Navbar from "./Navbar/Navbar";
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {
      web3: {},
      connectedUser:""
    }
  }

  loadWeb3 = async() => {
    if (window.ethereum) {
      let web3 = await new Web3(Web3.givenProvider || "http://localhost:7545");
      //await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.setState({ web3 });
      await this.loadBlockchainData(web3);
    } else {
      alert('Please install a blockchain wallet')
    }
  }

  loadBlockchainData = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      connectedUser: accounts[0]
    })
  }

  async componentDidMount() {
    await this.loadWeb3()
  }

  render() {
    const { connectedUser } = this.state;
    return (
      <div className="app">
        <Navbar user={connectedUser}/>
      </div>
    );
  }
}

export default App;
