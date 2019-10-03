pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./MicroDAO.sol";

contract MicroDAOFactory {
  uint256 public codeOffset;

  constructor(bytes memory _code) public {
    uint256 _codeOffset;
    assembly {
      _codeOffset := _code
    }
    codeOffset = _codeOffset;
  }

  function createMicroDAO(address[] memory addresses, uint256[] memory shares) public returns (MicroDAO) {
    bytes32 salt = keccak256(abi.encodePacked(addresses, shares));
    address addr;
    assembly {
      addr := create2(0, add(codeOffset_slot, 0x20), mload(codeOffset_slot), salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }

    return MicroDAO(addr);
  }
}
