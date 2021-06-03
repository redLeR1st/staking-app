const TokenFarm = artifacts.require('TokenFarm');
const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');

module.exports = async function(deployer, network, accounts) {
  // Deplyo mock DaiToken
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  // Deplyo DappToken
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();
  
  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();
  
  //Transfer all token to TokenFarm  (1million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');
                                            // 1000000000000000000000000 
  
  
  // Transfer 100 Mock DAI to investor 
  //await daiToken.transfer(accounts[1], '100000000000000000000');
  //
  //// Transfer 100 Mock DAI to investor 
  //await daiToken.transfer(accounts[2], '100000000000000000000');
  //
  //// Transfer 100 Mock DAI to investor 
  //await daiToken.transfer(accounts[3], '100000000000000000000');
  
  await daiToken.transfer('0x146C091D9AD7CCeC080f9806027728E7DF97AB05', '100000000000000000000');
  await daiToken.transfer('0xc54AC1935f7fcC7bcD4e315DF5d85CCc3c8172c7', '100000000000000000000');
  await daiToken.transfer('0x30729745fF2B81B39E1B46d5F8e11b5c43224F44', '100000000000000000000');
  
};
