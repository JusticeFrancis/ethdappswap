import React, { Component } from 'react';
import tokenLogo from '../token_logo.png';
import ethLogo from '../eth_logo.png';
import Web3 from 'web3';

class Sellform extends Component {

    constructor(props){
        super(props)
        this.state = {
            output : '0',
        }
    }
    
  render() {
    return (
      
      <div>
      <form className='mb-3'  onSubmit={(event)=>{
      event.preventDefault();
      console.log(window.web3.utils.fromWei(this.props.ethBalance,'Ether'));
      let tokenAmount;
      tokenAmount = this.input.value.toString();
      tokenAmount = window.web3.utils.toWei(tokenAmount,'Ether')
      this.props.sellTokens(tokenAmount)
  }}>
      <div>
          <label className='float-left'><b>Input</b></label>
          <span className='float-right  text-muted'>
              Balance : {window.web3.utils.fromWei(this.props.tokenBalance,'Ether')}
          </span>
      </div>
      <div className='input-group mb-4'>
          <input
            type='text'
            onChange={(event)=>{
                
                const tokenAmount = this.input.value.toString()
                this.setState({
                    output : tokenAmount / 100
                })
                console.log(this.state.output)
            }}

            ref = {(input)=>{
                this.input = input
            }}
            className=' form-control form-control-lg'
            placeholder='0'
            required
          />
          <div className='input-group-append'>
           <div className='input-group-text'>
               <img src={tokenLogo} height='32' alt=''/>
               &nbsp;&nbsp;&nbsp; DApp
           </div>
          </div>
      </div>
      <div>
          <label className='float-left'><b>Output</b></label>
          <span className='float-right text-muted'>
              Balance : {window.web3.utils.fromWei(this.props.ethBalance,'Ether')}
          </span>
      </div>
      <div className='input-group mb-2'>
          <input 
          type='text'
          className=' form-control form-control-lg'
          placeholder={this.state.output}
          disabled
          />
          <div className='input-group-append'>
           <div className='input-group-text'>
               <img src={ethLogo} height='32' alt=''/>
               &nbsp; Eth
           </div>
          </div>
      </div>
      <div className='mb-5'>
          <span className='float-left text-muted'>Exchange rate</span>
          <span className='float-right text-muted'>1 ETH = 100 DApp</span>
      </div>
      <button type='submit' className='btn btn-primary btn-block btn-lg '>SWAP!</button>
  </form>
  </div>
            
    );
  }
}

export default Sellform;
