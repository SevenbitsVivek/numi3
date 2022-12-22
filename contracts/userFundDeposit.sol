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
    event TokenTransfered(
        address _token,
        address _from,
        address _to,
        uint256 indexed _amount
    );

    event EtherTransfered(address _from, address _to, uint256 indexed _amount);

    struct CustomerId {
        uint256 id;
    }

    mapping(uint256 => CustomerId) private customerId;
    mapping(bytes => bool) private signatureUsed;

    function depositEtherFund(
        uint256 custId,
        uint256 roles,
        bytes32 hash,
        bytes memory signature
    ) public payable nonReentrant {
        require(roles == 10 || roles == 20, "Invalid roles");
        require(msg.value != 0, "Insufficient amount");
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        require(
            customerId[custId].id == 0,
            "Customer with same id already exists."
        );
        require(custId != 0, "CustomerId cannot be 0");
        address payable owner = payable(_owner);
        customerId[custId] = CustomerId(custId);
        emit EtherTransfered(msg.sender, owner, msg.value);
        owner.transfer(msg.value);
        signatureUsed[signature] = true;
    }

    function depositTokenFund(
        address tokenAddress,
        uint256 custId,
        uint256 roles,
        uint256 amount,
        bytes32 hash,
        bytes memory signature
    ) public {
        require(roles == 10 || roles == 20, "Invalid roles");
        require(amount != 0, "Insufficient amount");
        require(tokenAddress != address(0), "Address cannot be zero");
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        require(
            customerId[custId].id == 0,
            "Customer with same id already exists."
        );
        require(custId != 0, "CustomerId cannot be 0");
        IERC20 token;
        token = IERC20(tokenAddress);
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Check the token allowance"
        );
        customerId[custId] = CustomerId(custId);
        signatureUsed[signature] = true;
        emit TokenTransfered(tokenAddress, msg.sender, _owner, amount);
        SafeERC20.safeTransferFrom(token, msg.sender, _owner, amount);
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
}
