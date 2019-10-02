pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract MicroDAO is ERC20, ERC20Detailed {
  uint256 public nonce;
  uint256 public minSharesSplitShares;
  uint256 public minSharesSafeTransferFrom;

  struct InitialProposal {
    address[] addresses;
    uint256[] shares;
  }

  constructor(InitialProposal memory initialProposal) ERC20() ERC20Detailed("MicroDAO", "MDAO", 1) public {
    // initMicroDAO(initializer);
  }

  function initMicroDAO(InitialProposal memory initialProposal) private {
    // TODO(@kern): Implement me
  }

  function splitShares(uint256 multiple, bytes memory signatures) public {
    verifySufficientShares(
      minSharesSafeTransferFrom,
      createProposalSplitShares(multiple),
      signatures
    );

    // TODO(@kern): Implement me
  }

  function safeTransferFrom(IERC20 token, address from, address to, uint256 value, bytes memory signatures) public {
    verifySufficientShares(
      minSharesSafeTransferFrom,
      createProposalSafeTransferFrom(token, from, to, value),
      signatures
    );

    // TODO(@kern): Implement me
  }

  function verifyProposal(bytes32 proposal, bytes memory signatures) public {
    // TODO(@kern): Implement me
  }

  function tallyShares(bytes32 proposal, bytes memory signatures) public returns (uint256 shares) {
    // TODO(@kern): Implement me
  }

  function createProposalSafeTransferFrom(IERC20 token, address from, address to, uint256 value) public returns (bytes32 proposal) {
    // TODO(@kern): Implement me
  }

  function createProposalSplitShares(uint256 multiple) public returns (bytes32 proposal) {
    // TODO(@kern): Implement me
  }

  function verifySufficientShares(uint256 minShares, bytes32 proposal, bytes memory signatures) private {
    require(
      tallyShares(proposal, signatures) >= minShares,
      "must have minimum shares"
    );
  }
}
