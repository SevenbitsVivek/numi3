const UserFundDeposit = artifacts.require("UserFundDeposit");
const MyToken = artifacts.require("MyToken")

contract('UserFundDeposit', function (accounts) {

    let instance1 = null
    let instance2 = null
    before(async () => {
        instance1 = await UserFundDeposit.new({ from: accounts[3] });
        instance2 = await MyToken.new("test", "T", 1000000000000000);
        UserFundDepositInstance = instance1;
        MyTokenInstance = instance2
    })
    var UserFundDepositInstance, MyTokenInstance

    const tempUser1 = {
        custId: "test1",
        roles: 20,
        hash: "0x1ef3741d5709d32a9a07cfaa8e766f2c08b0c55e13d957728654238a178250be",
        signature: "0x89069a996f581d33eda5ed2f9da89528d23b7f6d61aaf1bb6de5fa2b087cb529381993ee489f8bed7fab486d1bb2549ef6310c8282af7653e8424625a2a3e2231b"
    }

    const tempUser2 = {
        custId: "test2",
        roles: 10,
        amount: 1000,
        hash: "0x16f0564edd6bde081bfc26c61023308fb1a9adda719ba96c9bc79ff263e2b8db",
        signature: "0xfa90e9e3d67047bf30e4afede12a8a4e92600d04586ec6fe65f6f3ec1255fab56a0a5cd62f93b55619c1fa3da5cbf8a0ed76fc6d2e955abe12c0e915d734bf8f1b"
    }

    const tempUser3 = {
        custId: "test3",
        roles: 10,
        hash: "0x75fe88d23d92dabef885de46e1242c5a8e2a49185a2154adc53311c79c45e278",
        signature: "0xbd4f3aeee3a48776f0202f1558835fdbd41257619d58b85114ce7088b95e575f700fcfe4c9cf36ae6b6f3b6c260d250a374f2d7ae06a2561b1ea01e28cc582ab1c"
    }

    const tempUser4 = {
        custId: "test4",
        roles: 20,
        amount: 1000,
        hash: "0xf69b3afc72e7b7065666cbd7f125a389e47e9f39f1dd23281dd5b741c7575518",
        signature: "0xc6e3c23f75feaf20975bc5014dd8a961e2b04f0babae566ea7ce6671c6e367d86380eea58e7e3a7fc600476241bd4122ce33ff2b79355c59a05b8676cd7015b31c"
    }

    const accounts1 = config.networks.hardhat.accounts;
    const index = 0; // first wallet, increment for next wallets
    const index1 = 1; // first wallet, increment for next wallets
    const wallet1 = ethers.Wallet.fromMnemonic(accounts1.mnemonic, accounts1.path + `/${index}`);
    const wallet2 = ethers.Wallet.fromMnemonic(accounts1.mnemonic, accounts1.path + `/${index1}`);

    // const privateKey = wallet1.privateKey

    it('user deposits the fund by using ether', async function () {
        await UserFundDepositInstance.setTransferedAddress("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        await UserFundDepositInstance.depositEtherFund(tempUser1.custId, tempUser1.roles, tempUser1.hash, tempUser1.signature, { from: wallet1.address, value: 1000 });
        const getTransferedAddress = await UserFundDepositInstance.getTransferedAddress({ from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })

        assert.equal(getTransferedAddress.toString(), "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "transfered address should be same")
    });

    it('user deposit the funds by using token', async function () {
        await MyTokenInstance.transfer(wallet2.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet2.address })
        const getTokenBalance = await MyTokenInstance.balanceOf(wallet2.address)
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser2.custId, tempUser2.roles, tempUser2.amount, tempUser2.hash, tempUser2.signature, { from: wallet2.address });

        assert.equal(getTokenBalance.toNumber(), 1000, 'user token balance should be 1000')
    });

    it('if user uses the same hash and signature while depositing funds using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser4.custId, tempUser4.roles, tempUser4.amount, tempUser3.hash, tempUser3.signature, { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.custId, tempUser3.roles, "0x3e52b3a8e4b97cc23ffbdc4c2721ae918e1d409ff2dd9e20291111acb029b216", "0x3baa2f0e2d602f3b5545862ba9b9c5eef5049082495de80797feb67f47a889146e27b85330d77e2c3c2e35aa59b8042ef3766be65c489d4931a113bb2055b68a1b", { from: wallet1.address, value: 1000 });

        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser3.custId, tempUser3.roles, tempUser4.amount, tempUser4.hash, tempUser4.signature, { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund(tempUser3.custId, tempUser3.roles, "0xebd358a3d2ffd27dee33130d10b1b25dc0f70ba8d79f776794ce6305124437a8", "0xe9b60f51797a6001547445679b5998ff81cbc0b0196b79a002a84d26602b385d3a5d21597a24667c2df22bff588603bc18e2f12f88ae7a0eb1b6a484d894ee161b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Already signature used'")
        }
    });

    it('if user deposits funds with 0 value as an amount using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser4.custId, tempUser4.roles, tempUser4.amount, "0x377fc0ad05afb8388496cdb41b455e179865e747f3f122f29032d45b20b68b63", "0x24b17b09d510f8a62a619f8046e81f5477fb43a32fd52a818e6bebdff8bae6dd761cfc059c27d7c88adefeeeed0c92504485193575689fa1f860fcf88b1f7bab1b", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.custId, tempUser3.roles, "0xe300df893b6d717568053709351467f85f328bdd0641713f8eeebd61c0bb9c10", "0xc8c9a51fdcf19d8931daeafbc31f1eab5b8acd93c12d9e9b978568056e2e948043006ed26e27b339856f7fd4884abf15792e72a0672343549af2768b275cbf871c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, "test6", 20, tempUser4.amount, "0x5550c7dbba2f657185f8694f712063b1336304870994f58f41157aa7671b6b44", "0x806c5da81fde057dabf9d2a0a89a638e7ff3a476b5f38a817db302ea5aa2a1012923b97f9434d512648e88d3e301be59d685771a24adec9fd1269a36c65424fa1c", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund("test6", 20, "0x632b03473de0ef3a37d73d27878b3e04c28a3e364f6e0844346d6a30f5bb72ff", "0xa1827fcf8d049f3d1f1f10a8981d99d2129b8b37c4a84627e1785288a8a829ad27b6dd3baadea9c2313ff533a9db9c5027004503035c757126bfc4bb3bf218ba1b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Insufficient amount'")
        }
    });

    it('if user deposit funds with 0 token address using token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser4.custId, tempUser4.roles, tempUser4.amount, "0x92b7c922a5cb1ebb38350f514757f3b9214dbe5167fa0175a23d7679a54a68ef", "0xae34ebafee423f7d5bbc869f94f19f62441573f977083dd9514fe0355fafcaf0146fb4f3ca2a6a4849aa50bf2d8b62b2be550302e5fd2f93af4f81152403adc01c", { from: wallet1.address });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, "test7", 20, tempUser4.amount, "0xfc67b5236cf7af80ae56b01b8e65dbfc533c7a344224510ab98a804297b1f64f", "0x134c8ed1a5d768441072c2104a4c531ba114f36df96c658eb5d5f75056f25f637a8fc966e9d5114ea607fc5e08974b95ee55d12feaabb94eef379add83aff30e1b", { from: wallet1.address });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Address cannot be zero'")
        }
    });

    it('if user deposit funds with no token allowance using token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser4.custId, tempUser4.roles, tempUser4.amount, "0xd8d9a6fddf29a0f805e67cb6d3e972ce27cdcc74c3a0785060073b019c35e7dc", "0xa2005f1e47b1335fa1ec6ee82f735d9b6238de87d7ec6e56d45b6aa1bd05b68c215127139d7a7aeb5d517e8e52178b6c7675fd362eb94b0276b7405d7a4e7cab1c", { from: wallet1.address });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, "test8", 10, tempUser4.amount, "0x293b1270431c45f792598348c8ab65339a8dc1cf23741ed5a7c1510aa9d8161d", "0x57c1e41aad6c4934f40623e92580913a654663b5b3aeff77b91dd91cb46a4f1944760b47e5100688549ae0066072d85bb19e2a6a5c27e6cfe646d9a2260ef7081c", { from: wallet1.address });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Check the token allowance'")
        }
    });
});