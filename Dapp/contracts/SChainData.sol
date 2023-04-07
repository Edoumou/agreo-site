// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./ISChain.sol";

contract SChainData is ISChain {
    // defines a product whithin a chain: key1: chainId, key2: productId
    mapping(string => mapping(string => Product)) products;
    mapping(address => SCPartner) public partners;
    mapping(string => bool)  _isChain;
    mapping(string => string[]) public chainProductIds;
    mapping(string => Product[]) public chains;

    mapping(address => FarmerIds) farmerIds;
    mapping(address => TransporterIds) transporterIds;
    mapping(address => DistributorIds) distributorIds;
    mapping(address => RetailerIds) retailerIds;

    uint256 public numberOfChains;

    address[] public farmers;
    address[] public transporters;
    address[] public distributors;
    address[] public retailers;

    string[] public listOfChainIds;

    uint256 partnerCount;

    modifier onlyFarmer {
        require(partners[msg.sender].categoryId == 0, "You must be a farmer");
        _;
    }

    modifier onlyTransporter {
        require(partners[msg.sender].categoryId == 1, "You must be a transporter");
        _;
    }

    modifier onlyDistributor {
        require(partners[msg.sender].categoryId == 2, "You must be a distributor");
        _;
    }

    modifier onlyRetailer {
        require(partners[msg.sender].categoryId == 3, "You must be a retailer");
        _;
    }

    event ProductRegistered(address farmer, string chainId, uint256 timestamp);
    event ProductTransported(address transporter, address destinator, string chainId, uint256 timestamp);
    event ProductDistributed(address distributor, address destinator, string chainId, uint256 timestamp);
    event ProductCooked(address retailer, string chainId, string productId, uint256 timestamp);

    function isPartner(address _partnerAddress) public view returns(bool) {
        require(_partnerAddress != address(0));

        return  partners[_partnerAddress].isPartner;
    }

    function getProductIds(string memory _chainID) public view returns(string[] memory) {
        return chainProductIds[_chainID];
    }

    function getChainIds() public view returns(string[] memory) {
        return listOfChainIds;
    }

    function isChain(string memory _chainId) public view returns(bool) {
        return _isChain[_chainId];
    }

    function getProduct(
        string memory _chainID,
        string memory _productID
    ) public view returns(Product memory) {
        return products[_chainID][_productID];
    }

    function getChain(
        string memory _chainID
    ) public view returns(Product[] memory chain) {
        return chains[_chainID];
    }
}