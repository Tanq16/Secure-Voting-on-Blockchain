// Specify solidity version
pragma solidity ^0.4.18;

contract Voting {

  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping votesReceived is candidate name stored as type bytes32 (string) and value is
  an unsigned integer to store the vote count for that candidate.
  The key of the mapping hasVoted is the ethereum address of the voter and value is a boolean (true/false)
  denoting whether a person has voted or not.
   */

  mapping (bytes32 => uint8) public votesReceived;
  mapping (address => bool) public hasVoted;


  /* Solidity does not allow array of strings to be passed in the constructor. So we will use an array of
  bytes32 instead to store the names of reigstered candidates. */
  bytes32[] public candidateList;

  /* This is the constructor for the contract.
  It will be called when the contract is deployed to the blockchain.
   */
  function Voting(bytes32[] candidateNames) public {
    candidateList = candidateNames;
  }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) view public returns (uint8) {
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidates. This
  // is equivalent to casting a vote
  function voteForCandidates(bytes32[] candidates) public {
    for(uint i = 0; i < candidates.length; i++) {
      votesReceived[candidates[i]] += 1;
    }
    hasVoted[msg.sender] = true;
  }

}

// mnemonic: "sorry tragic airport arrive tortoise notice toast mad error aware bleak chronic"
