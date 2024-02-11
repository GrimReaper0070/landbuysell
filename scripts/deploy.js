// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  const [buyer, seller, inspector, lender] = await ethers.getSigners()

  // Deploy Real Estate
  const RealEstate = await ethers.getContractFactory('RealEstate')
  const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`)
  console.log(`Minting 15 properties...\n`)

  for (let i = 0; i < 15; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmT2iuBVn1L98bs1YUBNyTqv2aFvYjrbFm1Ej6Eo5nAHe3/${i + 1}.json`)
    await transaction.wait()
  }

  // Deploy Escrow
  const Escrow = await ethers.getContractFactory('Escrow')
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  )
  await escrow.deployed()

  console.log(`Deployed Escrow Contract at: ${escrow.address}`)
  console.log(`Listing 15 properties...\n`)

  for (let i = 0; i < 15; i++) {
    // Approve properties...
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
    await transaction.wait()
  }

  // Listing properties...
  transaction = await escrow.connect(seller).list(1, buyer.address, tokens(80), tokens(70))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(2, buyer.address, tokens(75), tokens(70))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(3, buyer.address, tokens(70), tokens(65))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(4, buyer.address, tokens(65), tokens(60))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(5, buyer.address, tokens(60), tokens(55))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(6, buyer.address, tokens(55), tokens(50))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(7, buyer.address, tokens(95), tokens(50))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(8, buyer.address, tokens(45), tokens(40))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(9, buyer.address, tokens(40), tokens(35))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(10, buyer.address, tokens(30), tokens(30))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(11, buyer.address, tokens(180), tokens(70))
  await transaction.wait()

 transaction = await escrow.connect(seller).list(12, buyer.address, tokens(175), tokens(70))
 await transaction.wait()

 transaction = await escrow.connect(seller).list(13, buyer.address, tokens(170), tokens(65))
 await transaction.wait()

  transaction = await escrow.connect(seller).list(14, buyer.address, tokens(165), tokens(60))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(15, buyer.address, tokens(160), tokens(55))
   await transaction.wait()


  console.log(`Finished.`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
