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
      connectedUser:"",
      connected: false,
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
    // const accounts = await web3.eth.getAccounts();
    
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
    const { connectedUser, connected } = this.state;
    return (
      <div className="app">
        <Navbar user={connectedUser} connect={this.connect} connected={connected}/>
      </div>
    );
  }
}

export default App;
