const TokenSwap = artifacts.require("TokenSwap");
const STCHTOKEN = artifacts.require("STCHTOKEN");

contract("TokenSwap", ([deployer, ...others]) => {

	let instance;
	let token;
	beforeEach("should set up the contract instance", async() => {
		instance = await TokenSwap.deployed();
		token = await STCHTOKEN.deployed();
	})

	it("exchange should have opening balances", async() => {
		let exchangeTokenBalance = await token.balanceOf(instance.address);
		let exchangeMaticBalance = await web3.eth.getBalance(instance.address);

		assert.equal(exchangeTokenBalance, web3.utils.toWei("1000000000", "ether"));
		assert.equal(exchangeMaticBalance, web3.utils.toWei("0", "ether"));
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

		let buyer_token_bal = await instance.tokenHolders(deployer);
		buyer_token_bal = web3.utils.toBN(buyer_token_bal) - (web3.utils.toBN(buyer_token_bal) % 100000000)

		let tokenSoldWei = web3.utils.toWei(tokenSold.toString(), "ether")
		tokenSoldWei = web3.utils.toBN(tokenSoldWei) - (web3.utils.toBN(tokenSoldWei) % 100000000)

		assert.equal(exchangeMaticBalance, web3.utils.toWei("0.04", "ether"));	
		assert.equal(exchangeTokenBalance, exchTokenBalanceAfterSale);
		assert.equal(buyer_token_bal, tokenSoldWei);
	})
})