async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const UserFundDeposit = await ethers.getContractFactory("UserFundDeposit");
  const userFundDeposit = await UserFundDeposit.deploy();

  console.log("UserFundDeposit contract address:-", userFundDeposit.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });