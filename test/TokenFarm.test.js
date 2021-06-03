const TokenFarm = artifacts.require('TokenFarm');
const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');

require('chai')
    .use(require('chai-as-promised'))
    .should()
    
function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}
    
contract('TokenFarm', ([owner, investor1]) => {
   //Write teyt here
   let daiToken;
   let dappToken;
   let tokenFarm;
   before(async () => {
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
        
        // Transfer all Dapp tokens to farm (1million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));
        
        await daiToken.transfer(investor1, tokens('100'), {from: owner});
        
   });
   
    describe('Mock Dai deployed', async() => {
        it('has a name', async () => {
            let name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        });
    });
    
    describe('Mock Dapp deployed', async() => {
        it('has a name', async () => {
            let name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        });
    });
    
    describe('Tokenfarm', async() => {
        it('has a name', async () => {
            let name = await tokenFarm.name();
            assert.equal(name, 'Dapp Token Farm');
        });
        
        it('Has all the 1mill tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            let humreadable = web3.utils.fromWei(balance);
            assert.equal(humreadable, '1000000');
        });
        
        it('rewards investors for staking mDai tokens', async () => {
            let result;
            
            // Check investor balance before staking
            result = await daiToken.balanceOf(investor1);
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')
        
            //Stake Mock DAI tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor1});
            await tokenFarm.stakeTokens(tokens('100'), {from: investor1});
            
            // Check staiking result
            result = await daiToken.balanceOf(investor1);
            assert.equal(result.toString(), tokens('0'), 'Investor don\'t have anny Mock DAI after staking');
            
            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), 'Token farm has 100 Mock DAI token after staking');
            
            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), 'Token farm has 100 Mock DAI token after staking');
            
            result = await tokenFarm.stakingBalance(investor1);
            assert.equal(result.toString(), tokens('100'), 'Investor 1 staked 100 tokens');
            
            result = await tokenFarm.isStaking(investor1);
            assert.equal(result.toString(), 'true', 'Investor 1 staked');
            
            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner});
            
            // Chek if the issuing happened
            result = await dappToken.balanceOf(investor1);
            assert.equal(result.toString(), tokens('100'), 'Investor balance correct after issuing');
            
            await tokenFarm.issueTokens({ from: investor1}).should.be.rejected;
            
            await tokenFarm.unstakeTokens({ from: investor1});
            
            result = await daiToken.balanceOf(investor1);
            assert.equal(result.toString(), tokens('100'), 'Investor unstaked');
            
            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('0'), 'Investor unstaked');
            
            result = await tokenFarm.stakingBalance(investor1);
            assert.equal(result.toString(), tokens('0'), 'Investor unstaked');
            
            result = await tokenFarm.isStaking(investor1);
            assert.equal(result.toString(), 'false', 'Investor unstaked');
            
        });
         
    });
});