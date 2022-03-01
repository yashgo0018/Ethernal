// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Donations is Ownable {
    struct Donation {
        address donor;
        address receiver;
        uint256 amount;
    }
    mapping(address => mapping(uint256 => Donation)) public donations;
    mapping(address => uint256) public totalDonations;
    mapping(address => bool) public isMember;
    mapping(address => uint256) public balanceOf;

    uint256 commissionPersentage = 5;
    uint256 totalCommissionBalance;

    event DonationMade(
        uint256 donationId,
        address donor,
        address receiver,
        uint256 amount
    );
    event WithdrawalMade(address member, uint256 amount);

    constructor() Ownable() {}

    function donate(address receiver) public payable {
        require(msg.value > 0, "insufficiant amount");
        require(isMember[receiver], "the receiver is not a member");
        require(receiver != msg.sender, "you cannot send donation to yourself");
        uint256 commission = (msg.value * commissionPersentage) / 100;
        totalCommissionBalance += commission;
        balanceOf[receiver] += msg.value - commission;
        uint256 donationId = totalDonations[receiver]++;
        donations[receiver][donationId] = Donation(
            msg.sender,
            receiver,
            msg.value
        );
        emit DonationMade(donationId, msg.sender, receiver, msg.value);
    }

    function withdraw() public {
        require(isMember[msg.sender], "you are not a member");
        require(balanceOf[msg.sender] > 0, "insufficiant balance");
        uint256 balance = balanceOf[msg.sender];
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "fund transfer failed");
        balanceOf[msg.sender] = 0;
        emit WithdrawalMade(msg.sender, balance);
    }

    function ownerWithdrawal() public onlyOwner {
        require(totalCommissionBalance > 0, "insufficiant balance");
        (bool success, ) = msg.sender.call{value: totalCommissionBalance}("");
        require(success, "fund transfer failed");
        totalCommissionBalance = 0;
    }
}
