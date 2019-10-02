pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./MicroDAO.sol";

contract MicroDAOFactory {
  function createProposalInitial(address[] memory addresses, uint256[] memory shares) public pure returns (MicroDAO.InitialProposal memory initialProposal) {
    return MicroDAO.InitialProposal({
      addresses: addresses,
      shares: shares
    });
  }
}
