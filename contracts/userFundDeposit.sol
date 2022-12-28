// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserFundDeposit is Ownable, ReentrancyGuard {
    uint256 customer = 10;
    uint256 business = 20;
    address transferedAddress;
    event TokenTransfered(
        address _token,
        address _from,
        address _to,
        uint256 indexed _amount
    );

    event EtherTransfered(address _from, address _to, uint256 indexed _amount);

    mapping(bytes => bool) private signatureUsed;

    function depositEtherFund(
        string memory custId,
        uint256 roles,
        bytes32 hash,
        bytes memory signature
    ) public payable nonReentrant {
        require(roles == 10 || roles == 20, "Invalid roles");
        require(msg.value != 0, "Insufficient amount");
        require(bytes(custId).length > 0, "Invalid custId");
        require(
            transferedAddress != address(0),
            "TransferedAddress address cannot be 0"
        );
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        address payable _transferedAddress = payable(transferedAddress);
        emit EtherTransfered(msg.sender, transferedAddress, msg.value);
        _transferedAddress.transfer(msg.value);
        signatureUsed[signature] = true;
    }

    function depositTokenFund(
        address tokenAddress,
        string memory custId,
        uint256 roles,
        uint256 amount,
        bytes32 hash,
        bytes memory signature
    ) public {
        require(roles == 10 || roles == 20, "Invalid roles");
        require(amount != 0, "Insufficient amount");
        require(tokenAddress != address(0), "Address cannot be zero");
        require(
            transferedAddress != address(0),
            "TransferedAddress address cannot be 0"
        );
        require(bytes(custId).length > 0, "Invalid custId");
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        IERC20 token;
        token = IERC20(tokenAddress);
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Check the token allowance"
        );
        signatureUsed[signature] = true;
        emit TokenTransfered(
            tokenAddress,
            msg.sender,
            transferedAddress,
            amount
        );
        SafeERC20.safeTransferFrom(
            token,
            msg.sender,
            transferedAddress,
            amount
        );
    }

    function getTokenBalance(address tokenAddress, address recipient)
        public
        view
        returns (uint256)
    {
        require(tokenAddress != address(0), "Address cannot be zero");
        require(recipient != address(0), "Address cannot be zero");
        IERC20 token;
        token = IERC20(tokenAddress);
        return token.balanceOf(recipient);
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function setTransferedAddress(address newTransferedAddress)
        public
        onlyOwner
    {
        transferedAddress = newTransferedAddress;
    }

    function getTransferedAddress() public view onlyOwner returns (address) {
        return transferedAddress;
    }
}
