import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBloackchaindata();
    }


    async loadBloackchaindata() {
        const web3 = window.web3;
        
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        this.setState({account: accounts[0]});
        
        const newtWorkId = await web3.eth.net.getId();
        console.log(newtWorkId);
        
        const daiTokenData = DaiToken.networks[newtWorkId];
        if (daiTokenData) {
            const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
            this.setState({daiToken});
            let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
            this.setState({daiTokenBalance});
            console.log('daiTokenBalance', daiTokenBalance);
            
        } else {
            window.alert('DaiToken not deplyoyed to the detected network')
        }
        
        const dappTokenData = DappToken.networks[newtWorkId];
        if (dappTokenData) {
            const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
            this.setState({dappToken});
            let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
            this.setState({dappTokenBalance});
            console.log('dappTokenBalance', dappTokenBalance);
            
        } else {
            window.alert('DappToken not deplyoyed to the detected network')
        }
        
        const tokenFarmData = TokenFarm.networks[newtWorkId];
        if (tokenFarmData) {
            const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
            this.setState({tokenFarm});
            let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
            this.setState({stakingBalance});
            console.log('stakingBalance', stakingBalance);
            
        } else {
            window.alert('TokenFarm not deplyoyed to the detected network')
        }
        this.setState({loading: false});
    }
    
    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Hustone we got a problem here');
        }
    }

    stakeTokens = (amount) => {
        this.setState({loading: true});
        this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account}).on('transactionHash', (hash) => {
            this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
                this.setState({loading: false});
            })
        })
    }
    
    unstakeTokens = () => {
        this.setState({loading: true});        
        this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false});
        })
        
    }
    
    issueTokens = () => {
        this.setState({loading: true});        
        this.state.tokenFarm.methods.issueTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false});
        })
        
    }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
   let content = null;
     
   if (this.state.loading) {
       content = <p id ="loader" className="text-center">Loading...</p>;
   } else if (!this.state.loading) {
        content = <Main
            daiTokenBalance = {this.state.daiTokenBalance}
            dappTokenBalance = {this.state.dappTokenBalance}
            stakingBalance = {this.state.stakingBalance}
            stakeTokens = {this.stakeTokens}
            unstakeTokens = {this.unstakeTokens}
            issueTokens = {this.issueTokens}
            // stakeTokens = {this.stakeTokens}
            // unstakeTokens = {this.unstakeTokens}
        />;
   }
      
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                
                {content}
                

              </div>
            </main>
          </div>
        </div>
      </div>
    );;
  }
}

export default App;
