import MicroDAO from '../build/MicroDAO.json';
import MicroDAOFactory from '../build/MicroDAOFactory.json';
import MockERC20 from '../build/MockERC20.json';
import chai from 'chai';
import { Contract, utils as ethersUtils } from 'ethers';
import { deployContract, getWallets, solidity } from 'ethereum-waffle';
import { ethers } from "@nomiclabs/buidler";

chai.use(solidity);
const {expect} = chai;

describe('MicroDAO', () => {
  const provider = ethers.provider;
  const [wallet, walletTo] = getWallets(provider);
  let factory: Contract;
  let dao: Contract;
  let token: Contract;

  beforeEach(async () => {
    dao = await deployContract(wallet, MicroDAO);
    factory = await deployContract(wallet, MicroDAOFactory);
    token = await deployContract(wallet, MockERC20);
  });

  it('assigns initial balances to 0', async () => {
    expect(await dao.balanceOf(wallet.address)).to.eq(0);
  });

  it('initializes addresses with share balances', async () => {
    await dao.init("MicroDAO", "MDAO", [wallet.address, walletTo.address], [1, 2], 1)
    expect(await dao.balanceOf(wallet.address)).to.eq(1);
    expect(await dao.balanceOf(walletTo.address)).to.eq(2);
  });

  it('cannot initialize twice', async () => {
    await dao.init("MicroDAO", "MDAO", [wallet.address, walletTo.address], [1, 2], 1)
    expect(dao.init("MicroDAO", "MDAO", [wallet.address, walletTo.address], [1, 2], 1)).to.be.revertedWith('can only initialize once')
  });

  it('cannot initialize with mismatched lengths', async () => {
    expect(dao.init("MicroDAO", "MDAO", [wallet.address, walletTo.address], [1, 2, 3], 1)).to.be.revertedWith('addresses and shares must be same length')
  });

  it('can be initialized using CREATE2', async () => {
    const createTx = factory.createMicroDAO("MicroDAO", "MDAO", [wallet.address, walletTo.address], [1, 2], 1)
    expect(createTx).to.emit(factory, 'CreatedMicroDAO');
    const receipt = await provider.getTransactionReceipt((await createTx).hash)
    const parsed = factory.interface.parseLog((receipt.logs as any)[2])

    const newDAO = new Contract(parsed.values.dao, JSON.stringify(MicroDAO.abi), provider);
    expect(await newDAO.balanceOf(wallet.address)).to.eq(1);
    expect(await newDAO.balanceOf(walletTo.address)).to.eq(2);
  });

  it('transfers tokens if sufficient shares via signatures are provided', async () => {
    await dao.init("MicroDAO", "MDAO", [wallet.address, walletTo.address], [1, 1], 2)
    await token.mint(dao.address, 150);

    const proposal = await dao.createProposalSafeTransfer(token.address, walletTo.address, 100)
    const payloadHash = ethersUtils.arrayify(proposal.toString())
    const signatures = ethersUtils.concat([await wallet.signMessage(payloadHash), await walletTo.signMessage(payloadHash)])

    await dao.safeTransfer(token.address, walletTo.address, 100, signatures);
    expect(await token.balanceOf(dao.address)).to.eq(50);
    expect(await token.balanceOf(walletTo.address)).to.eq(100);
  })
})
