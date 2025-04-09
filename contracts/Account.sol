// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

contract Account {

    // Storing multiple user balances
    mapping(address => uint) private balances;

    // Events
    event Deposit(address indexed from, uint amount);
    event Withdrawal(address indexed to, uint amount);


    function getBalance() public view returns (uint) {
        return balances[msg.sender];    // Sender's address
    }


    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }


    function withdraw(uint256 amount) public {
        address sender = msg.sender;
        require(balances[sender] >= amount, "Insufficient balance");

        balances[sender] -= amount;
        payable(sender).transfer(amount);

        emit Withdrawal(sender, amount);
    }
}