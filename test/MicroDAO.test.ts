import chai from 'chai';
import { ethers } from "@nomiclabs/buidler";
import { createMockProvider, deployContract, getWallets, solidity } from 'ethereum-waffle';
import MicroDAO from '../build/MicroDAO';

chai.use(solidity);
const {expect} = chai;

describe('MicroDAO', () => {
  const provider = ethers.provider;
  let [wallet, walletTo] = getWallets(provider);
  let token: any;

  beforeEach(async () => {
    token = await deployContract(wallet, MicroDAO);
  });

  it('assigns initial balances to 0', async () => {
    expect(await token.balanceOf(wallet.address)).to.eq(0);
  });
})
