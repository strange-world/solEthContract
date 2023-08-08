// Import required modules
const fs = require('fs');                  // File system module to read files
const Web3 = require('web3');              // Web3 library for interacting with Ethereum

// Load environment variables
require('dotenv').config();               // Load environment variables from a .env file

// Read smart contract data
const bytecode = fs.readFileSync('Voter_sol_Voter.bin', 'utf8');     // Read the compiled bytecode of the smart contract
const abiStr = fs.readFileSync('Voter_sol_Voter.abi', 'utf8');       // Read the ABI (Application Binary Interface) of the smart contract
const abi = JSON.parse(abiStr);            // Parse the ABI into a JSON object for later use

// Create Web3 instance
const web3 = new Web3();                  // Create a new Web3 instance

// Set the Ethereum provider (connection)
web3.setProvider(new web3.providers.HttpProvider(process.env.INFURA_URL));
// Use the INFURA_URL from the environment variables as the Ethereum provider

// Add the private key to the account for signing transactions
const account = web3.eth.accounts.privateKeyToAccount(process.env.ACCOUNT_PRIVATE_KEY);
// Convert the private key from the environment variables to an account object
web3.eth.accounts.wallet.add(account);     // Add the account to the web3 wallet for signing transactions

// Create a new contract instance with the ABI
const voterContract = new web3.eth.Contract(abi);
// The contract instance allows interacting with the smart contract

// Deploying the smart contract
console.log('Deploying the contract');

// Deploy the contract with provided bytecode and constructor arguments
voterContract.deploy({
    data: '0x' + bytecode,                // Set the contract bytecode
    arguments: [
        ['option1', 'option2'],           // Pass constructor arguments (if any)
    ]
})
.send({
    from: account.address,                // Specify the sender (deployer) of the contract
    gas: 1500000                          // Set the gas limit for the deployment transaction
})
.on('transactionHash', function(transactionHash) {
    console.log(`Transaction hash: ${transactionHash}`);
    // Output the transaction hash when the deployment transaction is created
})
.on('confirmation', function(confirmationNumber, receipt) {
    console.log(`Confirmation number: ${confirmationNumber}`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Block hash: ${receipt.blockHash}`);
    // Output confirmation details when the contract is mined into a block
})
.then(function(contractInstance){
    console.log(`Contract address: ${contractInstance.options.address}`);
    // Output the contract address once the contract is deployed successfully
})
.catch(function (error) {
    console.log(`Error: ${error}`);
    // Output any errors that occur during the deployment process
});
