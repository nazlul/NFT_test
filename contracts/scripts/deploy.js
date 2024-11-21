async function main() {
    const [deployer] = await ethers.getSigners();
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
    console.log("NFTMarketplace deployed to:", nftMarketplace.address);
    await nftMarketplace.deployTransaction.wait();
    console.log("Contract deployed");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  