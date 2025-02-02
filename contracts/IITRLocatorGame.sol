// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IITRLocatorGame is Ownable {
    struct Puzzle {
        string location;
        string imageHash;
    }

    struct UserProgress {
        uint256[] completedPuzzles;
        uint256 tokens;
    }

    mapping(uint256 => Puzzle) public puzzles;
    mapping(address => UserProgress) public userProgress;
    address[] public players;

    uint256 public constant PUZZLE_REWARD = 10;
    uint256 public puzzleCount;

    event PuzzleCompleted(address indexed player, uint256 puzzleId);

    function addPuzzle(string memory location, string memory imageHash) public onlyOwner {
        puzzleCount++;
        puzzles[puzzleCount] = Puzzle(location, imageHash);
    }

    function solvePuzzle(uint256 puzzleId) public {
        require(puzzleId > 0 && puzzleId <= puzzleCount, "Invalid puzzle ID");
        require(!hasSolvedPuzzle(msg.sender, puzzleId), "Puzzle already solved");

        userProgress[msg.sender].completedPuzzles.push(puzzleId);
        userProgress[msg.sender].tokens += PUZZLE_REWARD;

        if (userProgress[msg.sender].completedPuzzles.length == 1) {
            players.push(msg.sender);
        }

        emit PuzzleCompleted(msg.sender, puzzleId);
    }

    function getCompletedPuzzles(address player) public view returns (uint256[] memory) {
        return userProgress[player].completedPuzzles;
    }

    function getTokens(address player) public view returns (uint256) {
        return userProgress[player].tokens;
    }

    function getLeaderboard() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory scores = new uint256[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            scores[i] = userProgress[players[i]].tokens;
        }
        return (players, scores);
    }

    function hasSolvedPuzzle(address player, uint256 puzzleId) public view returns (bool) {
        uint256[] memory completed = userProgress[player].completedPuzzles;
        for (uint256 i = 0; i < completed.length; i++) {
            if (completed[i] == puzzleId) {
                return true;
            }
        }
        return false;
    }

    function getPuzzle(uint256 puzzleId) public view returns (string memory, string memory) {
        require(puzzleId > 0 && puzzleId <= puzzleCount, "Invalid puzzle ID");
        Puzzle memory puzzle = puzzles[puzzleId];
        return (puzzle.location, puzzle.imageHash);
    }
}

