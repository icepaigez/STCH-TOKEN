// SPDX-License-Identifier: NO LICENSE
pragma solidity ^0.8.0;

import "./interfaces/StchTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenSwap {

	AggregatorV3Interface internal priceFeed;
	StchTokenInterface internal token;
	uint rate = 1 * 10**18; //$1/token converted to wei

	event TokenPurchased(address receiver, uint amount, uint tokenPriceInEth);
	event TokenSold(address sender, uint tokenAmount, uint etherAmount);

	mapping (address => uint) tokenHolders;

	constructor(address _tokenAddress, address _priceFeedAddress) {
		require(_tokenAddress != address(0x0), "Token address cannot be a null-address");
		priceFeed = AggregatorV3Interface(_priceFeedAddress);
		token = StchTokenInterface(_tokenAddress);
	}

	function currentEthPrice() private view returns (uint) {
    	(,int256 answer, , ,) = priceFeed.latestRoundData();
    	uint ethPrice = uint(answer);
    	return ethPrice / 10**8;
    }

    function tokenPriceInEth() public view returns (uint) {
    	return rate / currentEthPrice();
    }

    function buyToken() public payable {
    	uint tokenPrice = tokenPriceInEth();
    	require(msg.value >= tokenPrice, "You need enough Eth for at least 1 token");
    	uint tokenAmount = msg.value / tokenPrice;
    	require(token.balanceOf(address(this)) >= tokenAmount, "Not enough tokens in the exchange");
    	tokenHolders[msg.sender] += tokenAmount;
    	token.transfer(msg.sender, tokenAmount);
    	emit TokenPurchased(msg.sender, tokenAmount, tokenPrice);
    }

    function sellToken(uint amount) public {
    	address payable seller = payable(msg.sender);
    	require(token.balanceOf(msg.sender) >= amount, "Not enough tokens");
    	require(tokenHolders[msg.sender] > 0, "Only token holders can sell back to the exchange");
    	uint sellRate = (amount * tokenPriceInEth() * 90) / 100; //sell back at a 10% premium
    	require(address(this).balance >= sellRate, "Not enough ether in the exchange");
    	tokenHolders[msg.sender] -= amount;
    	token.approve(address(this), amount);
    	token.transferFrom(msg.sender, address(this), amount); //get the tokens being sold back
    	seller.transfer(sellRate);//send the ether equivalent
    	emit TokenSold(msg.sender, amount, sellRate);
    }
}