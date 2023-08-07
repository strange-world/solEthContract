// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Voter {

    // Struct to store the position and existence status of an option
    struct OptionPos {
        uint pos;       // Position of the option in the 'options' array
        bool exists;    // Flag indicating if the option exists in the 'options' array
    }

    uint[] public votes;                        // Array to store the vote counts for each option
    mapping (address => bool) hasVoted;        // Mapping to track if an address has already voted
    string[] public options;                   // Array to store the available voting options
    mapping (string => OptionPos) posOfOption;  // Mapping to get the position of an option in the 'options' array

    constructor(string[] memory _options) {
        options = _options;
        votes = new uint[](_options.length);

        // Initialize the 'posOfOption' mapping with the positions of options
        for (uint i = 0; i < options.length; i++) {
            OptionPos memory option = OptionPos(i, true);
            posOfOption[options[i]] = option;
        }
    }

    // Function to cast a vote for an option given its index in the 'options' array
    function vote(uint option) public {
        // Check if the option index is valid
        require(0 <= option && option < options.length, "Invalid option");
        // Check if the sender has not voted before
        require(!hasVoted[msg.sender], "Already voted");

        // Record the vote for the given option index
        recordVote(option);
    }

    // Private function to record a vote for a given option index
    function recordVote(uint option) private {
        // Mark the sender as voted
        hasVoted[msg.sender] = true;
        // Increment the vote count for the selected option
        votes[option] = votes[option] + 1;
    }

    // Function to cast a vote for an option given its name
    function vote(string memory option) public {
        // Check if the sender has not voted before
        require(!hasVoted[msg.sender], "Already voted");
        // Retrieve the position and existence status of the given option
        OptionPos memory pos = posOfOption[option];
        // Check if the option exists
        require(pos.exists, "Invalid option");

        // Record the vote for the given option
        recordVote(pos.pos);
    }

    // Function to get the available voting options
    function getOptions() public view returns (string[] memory) {
        return options;
    }

    // Function to get the vote counts for each option
    function getVotes() public view returns (uint[] memory) {
        return votes;
    }
}