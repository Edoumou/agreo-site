// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./ISChain.sol";

contract SChainData is ISChain {
    mapping(string => Chain) chains;
    mapping(address => SCPartner) public partners;

    mapping(address => FarmerIds) farmerIds;
    mapping(address => TransporterIds) transporterIds;
    mapping(address => DistributorIds) distributorIds;
    mapping(address => RetailerIds) retailerIds;

    mapping(string => string[]) chainProductIds;

    uint256 numberOfChains;

    address[] public farmers;
    address[] public transporters;
    address[] public distributors;
    address[] public retailers;
    address[] public restaurants;

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

    function isChain(string memory _chainId) public view returns(bool) {
        return chains[_chainId].isChain;
    }

    function getChain(string memory _chainId) public view returns(Chain memory) {
        return chains[_chainId];
    }

    function getProductIds(string memory _chainId) public view returns(string[] memory) {
        return chainProductIds[_chainId];
    }

    function getFarmerIds(address _farmer) public view returns(string[] memory, string[] memory) {
        return (farmerIds[_farmer].chainIds, farmerIds[_farmer].productIds);
    }

    function getTranspoterIds(address _transporter) public view returns(string[] memory, string[] memory) {
        return (transporterIds[_transporter].chainIds, transporterIds[_transporter].productIds);
    }

    function getDistributorIds(address _distributor) public view returns(string[] memory, string[] memory) {
        return (distributorIds[_distributor].chainIds, distributorIds[_distributor].productIds);
    }

    function getRetailerIds(address _retailer) public view returns(string[] memory, string[] memory) {
        return (retailerIds[_retailer].chainIds, retailerIds[_retailer].productIds);
    }
}