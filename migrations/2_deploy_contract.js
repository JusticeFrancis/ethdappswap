const Token = artifacts.require("Token");

const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
    
  // deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed();

  //deploy ethswap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed();

  // transfer all tokens to ethswap(1 million)
  await token.transfer(ethSwap.address,'1000000000000000000000000');
};
