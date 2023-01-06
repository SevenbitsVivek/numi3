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

    it('user mints the nft by using ether', async function () {
        await UserFundDepositInstance.depositEtherFund(tempUser1.custId, tempUser1.roles, tempUser1.hash, tempUser1.signature, { from: wallet1.address, value: 1000 });

        const getNftBalance = await UserFundDepositInstance.balanceOf(wallet1.address)
        const getNftOwner = await UserFundDepositInstance.ownerOf(tempUser1.tokenId)

        assert.equal(getNftBalance.toString(), 1, 'tokenId for respective owner should be same')
        assert.equal(getNftOwner.toString(), wallet1.address, 'nft owner for respective tokenId should be same')
    });

    it('user mints the nft by using token', async function () {
        await MyTokenInstance.transfer(wallet2.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet2.address })
        const getTokenBalance = await MyTokenInstance.balanceOf(wallet2.address)
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser2.custId, tempUser2.roles,tempUser2.amount, tempUser2.quantity, tempUser2.hash, tempUser2.signature, { from: wallet2.address });
        const getNftBalance = await UserFundDepositInstance.balanceOf(wallet2.address)
        const getNftOwner = await UserFundDepositInstance.ownerOf(tempUser2.tokenId)

        assert.equal(getTokenBalance.toNumber(), 1000, 'user token balance should be 1000')
        assert.equal(getNftBalance.toString(), 1, 'tokenId for respective owner should be same')
        assert.equal(getNftBalance.toString(), 1, 'tokenId for respective owner should be same')
        assert.equal(getNftOwner.toString(), wallet2.address, 'nft owner for respective tokenId should be same')
    });

    it('owner withdraw ethers and tokens from smart contract', async function () {
        const withdraw1 = await UserFundDepositInstance.withdraw(accounts[3], { from: accounts[3] })
        const withdraw2 = await UserFundDepositInstance.withdrawToken(MyTokenInstance.address, accounts[3], { from: accounts[3] })
        assert.equal(withdraw1.receipt.from, 0x90F79bf6EB2c4f870365E785982E1f101E93b906, 'contract owner account should be same')
        assert.equal(withdraw2.receipt.from, 0x90F79bf6EB2c4f870365E785982E1f101E93b906, 'contract owner account should be same')
    });

    it('if user uses the same hash and signature while minting nft using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address, tempUser4.custId, tempUser4.roles, tempUser4.amount, tempUser3.quantity, tempUser3.hash, tempUser3.signature, { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.custId, tempUser3.roles, "0x3e52b3a8e4b97cc23ffbdc4c2721ae918e1d409ff2dd9e20291111acb029b216", "0x3baa2f0e2d602f3b5545862ba9b9c5eef5049082495de80797feb67f47a889146e27b85330d77e2c3c2e35aa59b8042ef3766be65c489d4931a113bb2055b68a1b", { from: wallet1.address, value: 1000 });

        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, tempUser4.hash, tempUser4.signature, { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0xebd358a3d2ffd27dee33130d10b1b25dc0f70ba8d79f776794ce6305124437a8", "0xe9b60f51797a6001547445679b5998ff81cbc0b0196b79a002a84d26602b385d3a5d21597a24667c2df22bff588603bc18e2f12f88ae7a0eb1b6a484d894ee161b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Already signature used'")
        }
    });

    it('if user buys more than 10 nfts by using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(MyTokenInstance.address,tempUser4.custId, tempUser4.roles, tempUser4.amount, tempUser3.quantity, "0x04e47e084b55fd31c4a3c07cea4d8e2595e975e948e12f2c86f9aeb6ac5d53c8", "0x4c9fec7e633b65c9849e5e9bbcb0713eca41eee1e44cab982365213861b373cc4a9eed6550bea66c1eba3a5bf333012a47372a4dd5e4bd633e4adf0e04bdc5a71c", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.custId, tempUser3.roles, "0x9a282e199e22b81c0a2cdbaa1dc9077fc64983cfd618e2f413aa879155ce86cf", "0xc5f8b85d1f15fd81c0b67dc02fbed444db905c4873ed94b5a3cd69716249fbae6cfceb36e0e03ef993692d3b1698e4403cd37ea753df4a3cab8df018fbc7c38b1c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x0b8d27304c7fcbf822eab658c6e30d7dbb44f1e12d68762345bd1b6f68df971c", "0x31289bcdfe370186a482747f3ff652ef68d7422e3bb26c224ef708eb0f62fb3157b9363ac8e26576d5dfe7271667b609916ecf7cec378fda86f5d60f232b8e7a1c", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x245ca1d3d5b1bbebc13b9c2bf90ebfb09e99299701ee5465f6f7fb167f0cb156", "0x1a03bd277e748ecf272a68d8a211823259e153ed6a356f35e3d7ef63c29161e264cf618b37e6e5f083850276a995cc35d1ed4397701512c2227fcc95ff997d091b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Cannot buy more than 10 nfts'")
        }
    });

    it('if user buys 0 quantity using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x264628ef4be3d54f2a634fd0abcc5b3b2178ad2da9799fbf8120032e207edb90", "0xd273735b61c6d5701ee957202f3b0eea753a927b8ba92b9ddd2231828ff40fd12139af5705a1a7314e987700350b39c1a04110ae13157e7822ddd0e4089ba7091b", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0xd9b4db9d7fbecc8d811f69129195ef0ca2e5a6723caec61bcfb06d83067c508b", "0xfbb9cb0362438bc7e7663d885f19a842d8d24c6f066c29e3ad94c9fcf38a60e323f9ba81bdfe9e7c4db0cec43edbd0e6d09f95d28a98e6595a5043b1585ec8191b", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x62355a54844cbb69a8709a0b779a2433af6f728795386700ce9e969bc74ead56", "0xc85bc575f0b7db10935b0eaa93776086be4e3360245f14509fb4601e911a477a5545b2eb514001a89dc7ae3683c86f98f434be8cf2fc3a6443b5770dd4e534941c", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x77ad3796134186d94fb26d3bd9d00d5b091ac81c2b1d828d501a4e2d1eca5dd3", "0x1e38229b17707b2b7ba7e86f0c6aa12102643ab02ca25b7ab32b9e5a248012496ca77eade368090fdac67acdf26b8a4759b1631785413e0baa5d6071819113d11b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Insufficient quantity'")
        }
    });

    it('if user buys nft with 0 value as an amount using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x377fc0ad05afb8388496cdb41b455e179865e747f3f122f29032d45b20b68b63", "0x24b17b09d510f8a62a619f8046e81f5477fb43a32fd52a818e6bebdff8bae6dd761cfc059c27d7c88adefeeeed0c92504485193575689fa1f860fcf88b1f7bab1b", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0xe300df893b6d717568053709351467f85f328bdd0641713f8eeebd61c0bb9c10", "0xc8c9a51fdcf19d8931daeafbc31f1eab5b8acd93c12d9e9b978568056e2e948043006ed26e27b339856f7fd4884abf15792e72a0672343549af2768b275cbf871c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x5550c7dbba2f657185f8694f712063b1336304870994f58f41157aa7671b6b44", "0x806c5da81fde057dabf9d2a0a89a638e7ff3a476b5f38a817db302ea5aa2a1012923b97f9434d512648e88d3e301be59d685771a24adec9fd1269a36c65424fa1c", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x632b03473de0ef3a37d73d27878b3e04c28a3e364f6e0844346d6a30f5bb72ff", "0xa1827fcf8d049f3d1f1f10a8981d99d2129b8b37c4a84627e1785288a8a829ad27b6dd3baadea9c2313ff533a9db9c5027004503035c757126bfc4bb3bf218ba1b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Insufficient amount'")
        }
    });

    it('if user buys nft with 0 token address using token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x92b7c922a5cb1ebb38350f514757f3b9214dbe5167fa0175a23d7679a54a68ef", "0xae34ebafee423f7d5bbc869f94f19f62441573f977083dd9514fe0355fafcaf0146fb4f3ca2a6a4849aa50bf2d8b62b2be550302e5fd2f93af4f81152403adc01c", { from: wallet1.address });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xfc67b5236cf7af80ae56b01b8e65dbfc533c7a344224510ab98a804297b1f64f", "0x134c8ed1a5d768441072c2104a4c531ba114f36df96c658eb5d5f75056f25f637a8fc966e9d5114ea607fc5e08974b95ee55d12feaabb94eef379add83aff30e1b", { from: wallet1.address });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Address cannot be zero'")
        }
    });

    it('if user buys nft in which length of tokenId and quantity dosen`t match using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x4efbafee9af13a022200bddf088751f756b4ef93b494ef698bf5b0ba7f5a477b", "0x21b071314c5518ff0321eab4fd5841cd9f412babacd3c1b99b6757c763311cc41f0c8b41d30a7bee66cca868fe81a794ed1711370db495f1a45eb8bcd1fc21811b", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0x28a2fe43a6a42a25a7588a7e94247b17574072b61b3b112e548f7f6195980522", "0x2cd044ff087a757da8314c9f2ea65acfd4de68c16610c4faefd57b043d00d305151908b5a7c2c294c75f62e13d17135be4340e789c39b8439242e1251695ee241c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xeb2a516bdb321ec117d432b36e5d40f28151f26a99c0fe3eff37776eceef3a35", "0x880e243ac6f9f78c8c6445175295d3f4732c6d359f01a9369cdee495c3f8e1d47090b1e79f1f85ad656bbc9f0036dfb65278c484e055507f0a106af7deeae4911c", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x7221fa4cd5a746fddff301a95d5c58f1da063ed95fb6a892aa1c4e1b959004c5", "0x6a27f013ef09b7026b4adf90d0e805362451ca2cf1a4aaf6131f2cd6ca7b869675d599e05ce51b1c2827195f6d56bb08d54ed399b90e6ccad2de70d37812fc951b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Invalid parameter'")
        }
    });

    it('if user buys nft no token allowance using token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0xd8d9a6fddf29a0f805e67cb6d3e972ce27cdcc74c3a0785060073b019c35e7dc", "0xa2005f1e47b1335fa1ec6ee82f735d9b6238de87d7ec6e56d45b6aa1bd05b68c215127139d7a7aeb5d517e8e52178b6c7675fd362eb94b0276b7405d7a4e7cab1c", { from: wallet1.address });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x293b1270431c45f792598348c8ab65339a8dc1cf23741ed5a7c1510aa9d8161d", "0x57c1e41aad6c4934f40623e92580913a654663b5b3aeff77b91dd91cb46a4f1944760b47e5100688549ae0066072d85bb19e2a6a5c27e6cfe646d9a2260ef7081c", { from: wallet1.address });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Check the token allowance'")
        }
    });

    it('if user buys nft after sale ends using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x439cd1d318a99d99cc37e10f2311717d869f7242e58c1a4fff017b92218f88f7", "0xecfe16d90d9f0bbdbadc0e80d6c6579a855dc4373be34f238eeb38fd40eb1361628cc1d659e9cd51acb6e189a0dd03f7d5311c59d38a18af7ece2632ca729e5a1b", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0xaf5338334bc4571dc3c765b58e607341f8c1da8ba5f88bda631e094dd6664dce", "0x8b3c6deaee714969a36b077c3b4f88ab3cbf8a6372d377b86b4d74164689256961e090a59222befd0a45b4f4e1c0893ecba25e102c8b2830d6fe299d2d79d8a31c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            // await UserFundDepositInstance.flipSaleStatus({ from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xd022a60618ce846728aa77de7d079e5c80c8df527efc708ff4c6c2d0297ddc68", "0xe539b6e7225245c6b3a6fcf5a0f5d28794aa8cc2150723b9a57cc26b09fda3211d683bbd4af2ca62b5937aefff6139bbe985e1899dea48409cb625ba22bb4f1b1b", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0xb3a1435689089d5189150a8d15b00cab0dcd3414a8a10a7161b31a1d17f04a83", "0x4e7d56393ade9738923b3fd72aeda49e4e58c7fb04891934ce26cf3f196b10f7205dd069713a3c467ff2b461e6d7be1a81bdb7695e998226e8e1d7c17779a8971c", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Sale Inactive'")
        }
    });

    it('owner withdraw tokens and ethers with 0 token address , then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
        await UserFundDepositInstance.depositTokenFund(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x0c817d62055bf366dbe9f773688dd073ded3911f6e03a5c03a422e5087d63757", "0x875a4936da84590f09acffd44b76269d8b361df7d35cb15490ac88cd0f78b8b45f95fcc6468fd1e9a0ac7644c92b3658f46b491bbe4fbeb7eabee28aef5906891c", { from: wallet1.address });
        await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0xbcb2194e13b73837873325c0672dd093019d7705e6f5edfc0f73a0eb61a67d99", "0x7e5254aa35731022e3ea88067ab1393154f7e71d05333d5ebf0b9a0a3b2c8aed3b6ea0a03dcf41bd6636a6f6765c95ea93e62cd96744402c00e4ab540015a8ad1b", { from: wallet1.address, value: 1000 });
        await UserFundDepositInstance.withdrawToken(MyTokenInstance.address, accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        await UserFundDepositInstance.withdraw(accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(UserFundDepositInstance.address, tempUser2.amount, { from: wallet1.address })
            await UserFundDepositInstance.depositTokenFund([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xa64bd038049de62960d8016aaba7d36775063f475b938618d3e8b4bc75435c05", "0x57d3c389f203154ec222272c9d33f673e0e7780b6451f1a9fda3f06a41905cc91ff8d94dfad43bcbf14ec568088f3a46a5ae329152ae6df8479460b5eb2429ac1c", { from: wallet1.address });
            await UserFundDepositInstance.depositEtherFund(tempUser3.tokenId, tempUser3.quantity, "0x7bf9891f096c2fe23cf529616f26711c1281625c38618f8f55dcb4c4bb8ee5dc", "0xe409eb70fdc7c1681853db5cc4b196f3fa668e34f7603fb3bbeeffdd55ce3de44bf782310b4fb768072156a3872a787606b666f612eac5968ee72f20f6296e631b", { from: wallet1.address, value: 1000 });
            await UserFundDepositInstance.withdrawToken(MyTokenInstance.address, accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
            await UserFundDepositInstance.withdraw(accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Address cannot be zero'")
        }
    });
});