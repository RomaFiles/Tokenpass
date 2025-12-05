const fetch = require('node-fetch');

const contractAddress = '0xf7d2b7dbDF5DD7e3c908e021b33dC1753d04322B';
const apiKey = 'VM6KK95PGNC9KCVI2QH71G451593H927U1';

async function checkTxList() {
    const url = `https://api.etherscan.io/v2/api?chainid=11155111&module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Status:', data.status);
        console.log('Message:', data.message);
        console.log('Result count:', Array.isArray(data.result) ? data.result.length : data.result);
        if (Array.isArray(data.result) && data.result.length > 0) {
            console.log('First Tx:', data.result[0].hash);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

checkTxList();
