let fs = require('fs')
let Web3 = require('web3')

require('dotenv').config()

// Read contract's ABI
const abiStr = fs.readFileSync('Voter_sol_Voter.abi', 'utf8')
const abi = JSON.parse(abiStr)

// Create Web3 instance
const web3 = new Web3()
web3.setProvider(
  new web3.providers.HttpProvider(
    process.env.INFURA_URL
  )
)

// Add private key
const account = web3.eth.accounts.privateKeyToAccount(
  process.env.ACCOUNT_PRIVATE_KEY
)
web3.eth.accounts.wallet.add(account)

const voter = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS)

// Send transaction
sendTransaction()
    .then(function() {
        console.log('Done')
    })
    .catch(function(error) {
        console.log('Failed to send a transaction: ', error)
    })

async function sendTransaction() {
    console.log('Estimating gas')
    const gasEstimate = await web3.eth.estimateGas({
        from: account.address,
        to: process.env.CONTRACT_ADDRESS,
        data: voter.methods['vote(uint256)'](0).encodeABI(),
    })
    console.log('Gas estimate: ', gasEstimate)

    console.log('Voting')
    await voter
        .methods['vote(uint256)'](0)
        .send({
            from: account.address,
            gas: gasEstimate
        })

    console.log('Getting votes')
    const votes = await voter.methods.getVotes().call({from: account.address})

    console.log(`Votes: ${votes}`)
}