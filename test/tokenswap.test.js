const TokenSwap = artifacts.require("TokenSwap");
const STCHTOKEN = artifacts.require("STCHTOKEN");

contract("TokenSwap", ([deployer, ...others]) => {

	let instance;
	let token;
	beforeEach("should set up the contract instance", async() => {
		instance = await TokenSwap.deployed();
		token = await STCHTOKEN.deployed();
	})

	it("should accept Matic/Eth and sell Stch tokens to the buyer", async() => {
		instance = await TokenSwap.deployed();
		const buy_token = await instance.buyToken({from:deployer, value:web3.utils.toWei("0.04", "ether")});
		const exchangeMaticBalance = await web3.eth.getBalance(instance.address);

		let tokenEthPrice = await instance.tokenPriceInEth();
		tokenEthPrice = web3.utils.toBN(tokenEthPrice)
		let maticValue = await web3.utils.toWei("0.04", "ether");
		maticValue = web3.utils.toBN(maticValue)
		const tokenSold = maticValue/tokenEthPrice;
		let exchangeTokenBalance = await token.balanceOf(instance.address);
		exchangeTokenBalance = web3.utils.toBN(exchangeTokenBalance)
		const exchTokenBalanceAfterSale = exchangeTokenBalance - tokenSold;

		assert.equal(exchangeMaticBalance, web3.utils.toWei("0.04", "ether"));	
		assert.equal(exchangeTokenBalance, exchTokenBalanceAfterSale);
	})
})