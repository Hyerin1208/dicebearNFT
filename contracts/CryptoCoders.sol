// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CryptoCoders is ERC721, ERC721Enumerable {

    bool public ElectionResult = false;
    uint public VotingCount = 0;

    // string[] public coders; // 코더 배열

    // 코더 존재여부 매핑
    mapping(string => bool) _coderExists;

    constructor() ERC721("CryptoCoders", "CCS"){
        
    }

    struct coder {
        uint id;
        string name;
        uint voteCount;
        bool result;
    }

    // 후보자 매핑
    coder[] public coders;

    mapping(address => bool) public voters;

    // 후보자 득표수
    // uint public candidatesCount = 0;

    function mint(string memory name) public {
        // 후보자가 없다면 
        require(!_coderExists[name]);
        require(coders.length < 5);
        // nft 권리와 함께 들어갈 내영
        coders.push(coder(coders.length, name, 0, false));
        // coders가 어디에 있는지 찾기
        uint _id = coders.length - 1;
        _mint(msg.sender, _id);
        _coderExists[name] = true;
    }

    // 후보자에게 투표하기 위한 vote function
    function vote(uint _coderid) public {
        // => 투표용 디앱(컨트랙트)를 구동한자가 투표자
        require(!voters[msg.sender]);
        require(_coderid >= 0);
        // 투표진행
        voters[msg.sender] = true;
        // 투표수 증가
        coders[_coderid].voteCount++;
        // total 득표수 증가
        if(coders[_coderid].voteCount == 3) {
            ElectionResult = true;
            coders[_coderid].result = true;
        }
        // total 득표수 증가
        // numVote++;
        // emit sendMsg("투표 complete");
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}