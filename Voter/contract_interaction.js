// Import required modules
let fs = require('fs');                  // File system module to read files
let Web3 = require('web3');              // Web3 library for interacting with Ethereum

// Load environment variables
require('dotenv').config();             // Load environment variables from a .env file

// Read the contract's ABI (Application Binary Interface)
const abiStr = fs.readFileSync('Voter_sol_Voter.abi', 'utf8');   // Read the ABI from a file
const abi = JSON.parse(abiStr);          // Parse the ABI into a JSON object for later use

// Create Web3 instance
const web3 = new Web3();                // Create a new Web3 instance

// Set the Ethereum provider (connection)
web3.setProvider(new web3.providers.HttpProvider(process.env.INFURA_URL));
// Use the INFURA_URL from the environment variables as the Ethereum provider

// Add the private key to the account for signing transactions
const account = web3.eth.accounts.privateKeyToAccount(process.env.ACCOUNT_PRIVATE_KEY);
// Convert the private key from the environment variables to an account object
web3.eth.accounts.wallet.add(account);   // Add the account to the web3 wallet for signing transactions

// Create a contract instance with the ABI and contract address
const voter = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
// The contract instance allows interacting with the smart contract

// Send a transaction to vote
sendTransaction()
    .then(function() {
        console.log('Done');
    })
    .catch(function(error) {
        console.log('Failed to send a transaction: ', error);
    });

// Async function to send a transaction to vote
async function sendTransaction() {
    console.log('Estimating gas');
    // Estimate the gas required for the transaction
    const gasEstimate = await web3.eth.estimateGas({
        from: account.address,
        to: process.env.CONTRACT_ADDRESS,
        data: voter.methods['vote(uint256)'](0).encodeABI(),
    });
    console.log('Gas estimate: ', gasEstimate);

    console.log('Voting');
    // Perform the actual voting by sending a transaction to the contract
    await voter.methods['vote(uint256)'](0).send({
        from: account.address,
        gas: gasEstimate
    });

    console.log('Getting votes');
    // Call the smart contract function to get the updated votes
    const votes = await voter.methods.getVotes().call({ from: account.address });

    console.log(`Votes: ${votes}`);
}
