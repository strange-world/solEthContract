pragma solidity ^0.8.0;

contract Voter{

    uint[] public votes;
    string[] public options;
    
    constructor (string[] memory _options){
        options=_options;
        votes = new uint[](_options.length);
    }
    function vote(uint option) public {
        require(option < options.length, "Invalid Option");

        votes[option] = votes[option] + 1;
    }

    function getOptions() public view returns (string[] memory){
        return options;
    }
  function getVotes() public view returns (uint[] memory){
        return votes;
    }

}