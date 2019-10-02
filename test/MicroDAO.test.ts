const MicroDAO = artifacts.require("MicroDAO");
const MicroDAOFactory = artifacts.require("MicroDAOFactory");

contract("MicroDAO", accounts => {
  it("should start with 0 shares", async () => {
    const factory = await MicroDAOFactory.new()
    const initialProposal = await factory.createProposalInitial([accounts[0], accounts[1]], [2, 1])
    const dao = await MicroDAO.new(initialProposal)
    // const balance = await instance.balanceOf(accounts[0])
    // assert.equal(balance.valueOf(), 0)
  })
})
