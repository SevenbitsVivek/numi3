const fs = require('fs');
const path = require('path');

async function setLatestBlock(json) {
    try {
        fs.writeFile('deposit.json', json, function (err) {
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
    setLatestBlock: setLatestBlock,
}