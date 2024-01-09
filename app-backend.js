const express = require('express');
const app = express();
const port = 3000;

const Web3 = require('web3');
const providerUrl = 'YOUR_ETH_NODE_URL'; // Replace with your Ethereum node URL
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contractABI = [/*Please fill this before running code*/];
const contractAddresses = {
    Mantle: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7',
    Linea: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7',
    Kroma: '0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859',
};

const previousBalances = {};

app.get('/api/balance', async (req, res) => {
    const contractAddress = req.query.contract;

    if (!contractAddress || !contractAddresses[contractAddress]) {
        return res.status(400).json({ error: 'Invalid contract address' });
    }

    try {
        const balanceData = await getBalance(contractAddress);
        res.json(balanceData);
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function getBalance(contractAddress) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const balance = await contract.methods.getBalance().call();
    const previousBalance = previousBalances[contractAddress] || 0; 

    previousBalances[contractAddress] = balance;

    const change = calculateChange(balance, previousBalance);

    return { balance, change };
}

function calculateChange(currentBalance, previousBalance) {
    return ((currentBalance - previousBalance) / previousBalance) * 100 || 0;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
