Web3 = require('Web3');

// Connect to Ethereum network where the contract has been deployed
web3 = new Web3(new Web3.providers.HttpProvider("http://10.30.26.212:8545"));

// Specify functions and variables present in contract
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidates","type":"bytes32[]"}],"name":"voteForCandidates","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"checkIfVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"}]');
VotingContract = web3.eth.contract(abi);

// Connect to contract.
// The hex string is the address of the contract on the blockchain
contractInstance = VotingContract.at('0xcbc112d61b20efa59d36001c3d2541959edd28f2');

// This function is called by voteroutes.js
exports.voteForCandidates = function(addr, prezName, viceprezName) {

  // Check if user has already hasVoted
  if(!contractInstance.hasVoted.call(addr)) { // Not voted before
    var candidates = [prezName, viceprezName];

    // Call contract function
    // Vote details are added to the blockchain
    contractInstance.voteForCandidates(candidates, {from: addr});
    return 200; // OK
  }
  else { // Already voted
    return 201; // Already voted
  }
}
