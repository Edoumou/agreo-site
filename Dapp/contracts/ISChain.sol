// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface ISChain {
    struct Product {
        string productCategory;
        string productType;
        string productVariety;
        uint256 harvestingTime;
        uint256 packagingTime;
        uint256 departureTime;
        uint256 receivingTime;
        uint256 cookedTime;
        address stakeholderAddress;
        address transporterAddress;
        address receiverAddress;
    }

    /**
    * struct that defines a partner in the supply chain
    * a partner can be one of the following
    * 1: Farmer 
    * 2: Transporter
    * 3: Distributor
    * 4: Retailer
    */
    struct SCPartner {
        uint256 id;
        uint256 categoryId;
        string category;
        string name;
        string location;
        string url;
        string email;
        string phoneNumber;
        address partnerAddress;
        bool isPartner;
    }

    struct FarmerIds {
        string[] chainIds;
        string[] productIds;
    }

    struct TransporterIds {
        string[] chainIds;
        string[] productIds;
    }

    struct DistributorIds {
        string[] chainIds;
        string[] productIds;
    }

    struct RetailerIds {
        string[] chainIds;
        string[] productIds;
    }
}