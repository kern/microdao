pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract MicroDAO is ERC20 {
  using SafeERC20 for IERC20;

  bool private _initialized;
  string private _name;
  string private _symbol;
  uint256 private _nonce;
  uint256 private _minSharesTransfer;

  constructor() ERC20() public {
  }

  function init(
    string memory name,
    string memory symbol,
    address[] memory addresses,
    uint256[] memory shares,
    uint256 minSharesTransfer
  ) public {
    require(!_initialized, "can only initialize once");
    _initialized = true;

    _name = name;
    _symbol = symbol;
    _minSharesTransfer = minSharesTransfer;

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

  function safeTransfer(IERC20 token, address to, uint256 value, bytes memory signatures) public {
    verifySufficientShares(
      _minSharesTransfer,
      createProposalSafeTransfer(token, to, value),
      signatures
    );

    token.safeTransfer(to, value);
  }

  function safeTransferFrom(IERC20 token, address from, address to, uint256 value, bytes memory signatures) public {
    verifySufficientShares(
      _minSharesTransfer,
      createProposalSafeTransferFrom(token, from, to, value),
      signatures
    );

    token.safeTransferFrom(from, to, value);
  }

  function createProposalSafeTransfer(IERC20 token, address to, uint256 value) public view returns (bytes32) {
    return keccak256(
      abi.encodePacked(
        address(this),
        _nonce,
        this.safeTransfer.selector,
        address(token),
        to,
        value
      )
    );
  }

  function createProposalSafeTransferFrom(IERC20 token, address from, address to, uint256 value) public view returns (bytes32) {
    return keccak256(
      abi.encodePacked(
        address(this),
        _nonce,
        this.safeTransferFrom.selector,
        address(token),
        from,
        to,
        value
      )
    );
  }

  function tallyShares(bytes32 proposal, bytes memory signatures) public view returns (uint256 shares) {
    uint8 v;
    bytes32 r;
    bytes32 s;
    bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", proposal));

    uint count = countSignatures(signatures);
    for (uint i = 0; i < count; i++) {
      (v, r, s) = parseSignature(signatures, i);
      address addr = ecrecover(prefixedHash, v, r, s);
      require(addr != address(0), "address cannot be 0");

      uint256 addrShares = balanceOf(addr);
      require(addrShares > 0, "shares must be greater than 0 for address");
      shares += addrShares;
    }
  }

  function verifySufficientShares(uint256 minShares, bytes32 proposal, bytes memory signatures) private {
    require(
      tallyShares(proposal, signatures) >= minShares,
      "must have minimum shares"
    );
    _nonce++;
  }

  /// @notice Counts the number of signatures in a signatures bytes array. Returns 0 if the length is invalid.
  /// @param _signatures The signatures bytes array
  /// @dev Signatures are 65 bytes long and are densely packed.
  function countSignatures(
    bytes memory _signatures
  )
    pure
    public
    returns (uint)
  {
    return _signatures.length % 65 == 0 ? _signatures.length / 65 : 0;
  }

    /// @notice Extracts the r, s, and v parameters to `ecrecover(...)` from the signature at position `_pos` in a densely packed signatures bytes array.
  /// @dev Based on [OpenZeppelin's ECRecovery](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ECRecovery.sol)
  /// @param _signatures The signatures bytes array
  /// @param _pos The position of the signature in the bytes array (0 indexed)
  function parseSignature(
    bytes memory _signatures,
    uint256 _pos
  )
    pure
    public
    returns (uint8 v, bytes32 r, bytes32 s)
  {
    uint256 offset = _pos * 65;
    // The signature format is a compact form of:
    //   {bytes32 r}{bytes32 s}{uint8 v}
    // Compact means, uint8 is not padded to 32 bytes.
    assembly { // solium-disable-line security/no-inline-assembly
      r := mload(add(_signatures, add(32, offset)))
      s := mload(add(_signatures, add(64, offset)))
      // Here we are loading the last 32 bytes, including 31 bytes
      // of 's'. There is no 'mload8' to do this.
      //
      // 'byte' is not working due to the Solidity parser, so lets
      // use the second best option, 'and'
      v := and(mload(add(_signatures, add(65, offset))), 0xff)
    }

    if (v < 27) v += 27;

    require(v == 27 || v == 28, "incorrect signature version");
  }
}
