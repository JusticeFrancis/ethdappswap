const { assert } = require('chai');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()


//helper to reduce decimal places in wei by converting to ether
function tokens(n) {
    return web3.utils.toWei(n,'ether');
}

contract('Token', ([deployer, investor]) => {
    // needed for before hook
    let token,ethSwap

    //before hook , this function occurs first and reduces code repetition
    before(async()=>{
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        await token.transfer(ethSwap.address, tokens('1000000'));
    })

    //check if token has a name
    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, 'DApp Token')
        })
    })

    //check if EthSwap contract has name and token
    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has a token', async()=>{
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(),tokens('1000000'))
        })
    })

    describe('buyTokens()', async()=>{
        let result
        before(async()=>{
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1','Ether')});
        })
        it('Allows user to instantly purchase tokens from ethSwap for a fixed price',async()=>{
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            // check ethswap balance after purchase

            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(),tokens('999900'))

            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'))


            //check logs to ensure event was emitted with the correct data
            const event = result.logs[0].args
            assert.equal(event.account,investor)
            assert.equal(event.token,token.address)
            assert.equal(event.amount.toString(),tokens('100').toString())
            assert.equal(event.rate.toString(),'100')

        })
    })

    describe('sellTokens()', async()=>{
        let result 

        before(async()=>{
            // investor must approve the purchase
            await token.approve(ethSwap.address, tokens('100'),{from : investor});
            result = await ethSwap.sellTokens( tokens('100'), {from: investor});
        })

        it('allows user to instantly sell tokens to ethswap for a fixed price', async()=>{
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            // check ethswap balance after purchase

            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(),tokens('1000000'))

            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0'))


            // check logs to ensure event was emitted with the correct data
            const event = result.logs[0].args
            assert.equal(event.account,investor)
            assert.equal(event.token,token.address)
            assert.equal(event.amount.toString(),tokens('100').toString())
            assert.equal(event.rate.toString(),'100') 


            // failure : investor cant sell more tokens than they have
            await ethSwap.sellTokens(tokens('500'), {from : investor}).should.be.rejected

        })
    })
})