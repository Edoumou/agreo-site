// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface ISChain {
    struct Chain {
        bool isChain;

        string farmerId;
        string farmerName;
        string farmerCategory;
        string farmerType;
        uint256 farmerHarvestingTime;
        uint256 farmerPackagingTime;
        uint256 farmerDepartureTime;
        address farmer;
        address farmerTransporter;
        address farmerReceiver;

        string transporterId;
        string transporterParentId;
        string transporterName;
        string transporterCategory;
        string transporterType;
        uint256 transporterReceivingTime;
        uint256 transporterDepartureTime;
        address transporter;
        address transporterReceiver;

        string distributorId;
        string distributorParentId;
        string distributorName;
        string distributorCategory;
        string distributorType;
        uint256 distributorReceivingTime;
        uint256 distributorDepartureTime;
        address distributor;
        address distributorReceiver;

        string retailerId;
        string retailerParentId;
        string retailerName;
        string retailerCategory;
        string retailerType;
        uint256 retailerReceivingTime;
        uint256 retailerCookedTime;
        address retailer;
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

    struct FarmerProduct {
        string id;
        string name;
        string category; 
        string _type;
        uint256 harvestingTime;
        uint256 packagingTime;
        uint256 departureTime;
        address farmer;
        address transporter;
        address receiver;
    }

    struct TransporterProduct {
        string id;
        string parentId;
        string name;
        string category;
        string _type;
        uint256 receivingTime;
        uint256 departureTime;
        address transporter;
        address receiver;
    }

    struct DistributorProduct {
        string id;
        string parentId;
        string name;
        string category;
        string _type;
        uint256 receivingTime;
        uint256 departureTime;
        address distributor;
        address receiver;
    }

    struct RetailerProduct {
        string id;
        string parentId;
        string name;
        string category;
        string _type;
        uint256 receivingTime;
        uint256 cookedTime;
        address retailer;
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
        uint256 phoneNumber;
        address partnerAddress;
        bool isPartner;
    }
}