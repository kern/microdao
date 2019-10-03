pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MicroDAO is ERC20 {
  bool private _initialized;
  string private _name;
  string private _symbol;
  uint256 private _nonce;
  uint256 private _minSharesSplitShares;
  uint256 private _minSharesSafeTransferFrom;

  constructor() ERC20() public {
  }

  function init(
    string memory name,
    string memory symbol,
    address[] memory addresses,
    uint256[] memory shares
  ) public {
    require(!_initialized, "can only initialize once");
    _initialized = true;

    _name = name;
    _symbol = symbol;

    uint256 addrsLen = addresses.length;
    require(
      addrsLen == shares.length,
      "addresses and shares must be same length"
    );

    for (uint256 i = 0; i < addrsLen; i++) {
      _mint(addresses[i], shares[i]);
    }
  }

  function name() public view returns (string memory) {
    return _name;
  }

  function symbol() public view returns (string memory) {
    return _symbol;
  }

  function decimals() public pure returns (uint8) {
    return 0;
  }

  function splitShares(uint256 multiple, bytes memory signatures) public {
    verifySufficientShares(
      _minSharesSafeTransferFrom,
      createProposalSplitShares(multiple),
      signatures
    );

    // TODO(@kern): Implement me
  }

  function safeTransferFrom(IERC20 token, address from, address to, uint256 value, bytes memory signatures) public {
    verifySufficientShares(
      _minSharesSafeTransferFrom,
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
