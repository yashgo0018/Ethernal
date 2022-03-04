// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Donations is Ownable {
    using ECDSA for bytes32;

    struct Donation {
        address donor;
        address receiver;
        uint256 amount;
    }

    mapping(address => mapping(uint256 => Donation)) public donations;
    mapping(address => uint256) public totalDonations;
    mapping(address => bool) public isMember;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(uint256 => bool)) public nonceUsed;
    mapping(address => bool) public forceDisabled;

    uint256 public commissionRate = 5;
    uint256 public totalCommissionBalance;
    address private _signer;

    event DonationMade(
        uint256 donationId,
        address donor,
        address receiver,
        uint256 amount
    );
    event MemberStatusChange(address member, bool status);
    event WithdrawalMade(address member, uint256 amount);

    constructor(address _newSigner) Ownable() {
        _signer = _newSigner;
    }

    function setSigner(address _newSigner) public onlyOwner {
        _signer = _newSigner;
    }

    function updateForceDisableStatus(address member, bool status)
        public
        onlyOwner
    {
        require(member != address(0), "invalid member address");
        require(forceDisabled[member] != status, "already updated");
        forceDisabled[member] = status;
    }

    function setMemberStatus(
        bytes memory _signature,
        bool _status,
        uint256 _nonce
    ) public {
        require(!nonceUsed[msg.sender][_nonce], "nonce already used");
        require(isMember[msg.sender] == !_status, "status already updated");
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, _status, _nonce));
        bytes32 messageHash = hash.toEthSignedMessageHash();
        require(
            messageHash.recover(_signature) == _signer,
            "invalid signature"
        );
        isMember[msg.sender] = _status;
        nonceUsed[msg.sender][_nonce] = true;
        emit MemberStatusChange(msg.sender, _status);
    }

    function donate(address receiver) public payable {
        require(msg.value > 0, "insufficiant amount");
        require(isMember[receiver], "the receiver is not a member");
        require(!forceDisabled[receiver], "the receiver is currently disabled");
        require(receiver != msg.sender, "you cannot send donation to yourself");
        uint256 commission = (msg.value * commissionRate) / 100;
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
        require(!forceDisabled[msg.sender], "you are currently disabled");
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

    function updateCommissionRate(uint256 newCommissionRate) public onlyOwner {
        commissionRate = newCommissionRate;
    }
}
