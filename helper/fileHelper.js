const fs = require('fs');

async function setLatestBlock(blockNumber) {
    try {
        fs.writeFile('deposit.json', blockNumber, function (err) {
            if (err) return console.log(err);
            console.log('Value updated in json file');
        });
    }
    catch (err) {
        ShortMessage = "setLatestBlock";
        const FullMessage = err.message
    }
}

module.exports = {
    setLatestBlock: setLatestBlock
}