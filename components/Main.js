import React, { Component } from 'react';
import Buyform from './Buyform';
import Sellform from './sellForm';

class Main extends Component {

    constructor(props){
        super(props)
        this.state = {
            currentForm : 'buy',
        }
    }
    
  render() {
    let form  
    if (this.state.currentForm === 'buy') {
        form = <Buyform  
                ethBalance ={this.props.ethBalance} 
                tokenBalance ={this.props.tokenBalance} 
                buyTokens = {this.props.buyTokens}
                />
    } else {
        form = <Sellform 
                ethBalance ={this.props.ethBalance} 
                tokenBalance ={this.props.tokenBalance} 
                sellTokens = {this.props.sellTokens}
               />
        
    }  
    return (
      <div id='content'>
        <div className='d-flex justify-content-between mb-3'>
          <button onClick={(event)=>{this.setState({currentForm : 'buy'})}} className='btn btn-light'>Buy</button>
          <span className='text-muted'>&lt; &nbsp; &gt;</span>
          <button onClick={(event)=>{this.setState({currentForm : 'sell'})}}  className='btn btn-light'>Sell</button>
        </div>
        
                
        <div className='card mb-4'>
            <div className='card-body'>
               {form}
            </div>
        </div>
      </div>
    );
  }
}

export default Main;
