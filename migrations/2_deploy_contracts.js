const STCHTOKEN = artifacts.require("STCHTOKEN");
const TokenSwap = artifacts.require("TokenSwap");

const initialSupply = '1000000000000000000000000000'  //1 billion tokens in wei

module.exports = async function(deployer, network) {
	await deployer.deploy(STCHTOKEN, initialSupply);
	const token = await STCHTOKEN.deployed();

	let chainlink_aggr;
	let exchange; 
	let deployedBy = deployer["networks"][network]["from"]

	if (network === 'matic') {
		chainlink_aggr = '0x0715A7794a1dc8e42615F059dD6e406A6594651A';
		await deployer.deploy(TokenSwap, token.address, chainlink_aggr);
		exchange = await TokenSwap.deployed();
	} else if (network === 'kovan') {
		chainlink_aggr = '0x9326BFA02ADD2366b30bacB125260Af641031331';
		await deployer.deploy(TokenSwap, token.address, chainlink_aggr);
		exchange = await TokenSwap.deployed();
	}

	let tokenBalance = await token.balanceOf(deployedBy);
	tokenBalance = web3.utils.toBN(tokenBalance);
	if (exchange !== undefined) {
		await token.transfer(exchange.address, tokenBalance);
	}
}