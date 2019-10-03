pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./MicroDAO.sol";

contract MicroDAOFactory {
  event CreatedMicroDAO(MicroDAO dao);

  function createMicroDAO(
    string memory name,
    string memory symbol,
    address[] memory addresses,
    uint256[] memory shares,
    uint256 minSharesSplitShares,
    uint256 minSharesSafeTransferFrom
  ) public returns (MicroDAO dao) {
    bytes memory deploymentData = type(MicroDAO).creationCode;

    bytes32 salt = keccak256(abi.encodePacked(address(this), name, symbol, addresses, shares));

    assembly {
      dao := create2(0, add(deploymentData, 0x20), mload(deploymentData), salt)
      if iszero(extcodesize(dao)) {
        revert(0, 0)
      }
    }

    dao.init(name, symbol, addresses, shares, minSharesSplitShares, minSharesSafeTransferFrom);

    emit CreatedMicroDAO(dao);
  }
}
