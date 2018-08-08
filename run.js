Web3 = require('web3');
solc = require('solc');
fs   = require('fs');

// Connect to blockchain
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Read and compile Voting.sol contract
code = fs.readFileSync('Voting.sol').toString();
compiledCode = solc.compile(code);

// Parse contract
abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
VotingContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':Voting'].bytecode;

// Deploy contract
deployedContract = VotingContract.new(['P1','P2','P3','VP1','VP2','VP3'], // Make changes here
          {data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
