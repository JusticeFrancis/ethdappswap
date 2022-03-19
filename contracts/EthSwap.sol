pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap{
    string public name = "EthSwap Instant Exchange";
    Token public token;

    //rate state , unsigned means it cant be negative or integer no decimals
    uint public rate = 100;

    event tokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event tokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public{
        token = _token;
    }
    function buyTokens() public payable {
        //redemption rate = #number of tokens they recieve for one ether

        //amount of ethereum * redemption rate ,
        // value tell us how much ether was sent when the function was called
        //calculate the number of tokens to buy

        uint tokenAmount = msg.value * rate;

        // makes sure ethSwap has enough tokens before a transaction
        require(token.balanceOf(address(this)) >= tokenAmount);



        token.transfer(msg.sender, tokenAmount);


        //emit an event
        emit tokensPurchased(msg.sender,address(token),tokenAmount,rate);
    }

    function sellTokens(uint _amount) public{
        //user cant sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);


        //calculate the amount of ether to redeem
        uint etherAmount = _amount/ rate;

        //require that ethswap has enough ether for the transaction
        require(address(this).balance >= etherAmount);


        // perform sale
        token.transferFrom(msg.sender,address(this), _amount);
        msg.sender.transfer(etherAmount);

        //emit event
        emit tokensSold(msg.sender,address(token),_amount,rate);
   
    }
}