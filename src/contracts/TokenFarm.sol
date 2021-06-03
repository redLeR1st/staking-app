pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // all Code geose here...
    // State variables
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    
    
    address[] public stakers;
    // Address => how many tokens currently staking
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    // Step1: Deploy DaiToken
    // Step2: Deploy DappToken
    // Step3: Deploy TokenFarm
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }
    
    // 1. stake Token
    function stakeTokens(uint _amount) public {
        // code goes here for staking
        // Cannot stake 0 tokens
        require(_amount > 0, "Amount cannot be 0");
        
        // Transfer mock Dai to this contract for stacking
        // msg global variable
        // address(this) we convert this smarctonract to an address
        daiToken.transferFrom(msg.sender, address(this), _amount);
        
        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        
        // Add user to stakers array *only* if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        
        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
    
    // 2. Issuing Tokens
    
    function issueTokens() public {
        require(msg.sender == owner, "Go away noob");
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
    // 3. unstake Tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Balance cannot be 0");
        
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}
