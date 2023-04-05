// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./SChainData.sol";

contract SChain is SChainData {
    function partnerRegistration(
        uint256 _categoryId,
        string memory _name,
        string memory _location,
        string memory _url,
        string memory _email,
        uint256 _phoneNumber
    ) public {
        partnerCount++;
        partners[msg.sender].id = partnerCount;
        partners[msg.sender].categoryId = _categoryId;
        partners[msg.sender].name = _name;
        partners[msg.sender].location = _location; 
        partners[msg.sender].url = _url; 
        partners[msg.sender].email = _email;
        partners[msg.sender].phoneNumber = _phoneNumber;
        partners[msg.sender].partnerAddress = msg.sender;
        partners[msg.sender].isPartner = true;

        if (_categoryId == 0) {
            partners[msg.sender].category = "Farmer";
            farmers.push(msg.sender);
        } else if (_categoryId == 1) {
            partners[msg.sender].category = "Transporter";
            transporters.push(msg.sender);
        } else if (_categoryId == 2) {
            partners[msg.sender].category = "Distributor";
            distributors.push(msg.sender);
        } else if (_categoryId == 3) {
            partners[msg.sender].category = "Retailer";
            retailers.push(msg.sender);
        } else {
            partners[msg.sender].category = "Unknown";
            revert("Unknow partner category");
        }
    }

    function productRegistration(
        string memory _chainID,
        string memory _productID,
        FarmerProduct memory _farmerProduct
    ) public onlyFarmer {
        require(!isChain(_chainID), "Chain already exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        chains[_chainID].farmerId = _farmerProduct.id;
        chains[_chainID].farmerName = _farmerProduct.name;
        chains[_chainID].farmerCategory = _farmerProduct.category;
        chains[_chainID].farmerType = _farmerProduct._type;
        chains[_chainID].farmerHarvestingTime = _farmerProduct.harvestingTime;
        chains[_chainID].farmerPackagingTime = _farmerProduct.packagingTime;
        chains[_chainID].farmerDepartureTime = _farmerProduct.departureTime;
        chains[_chainID].farmer = _farmerProduct.farmer;
        chains[_chainID].farmerTransporter = _farmerProduct.transporter;
        chains[_chainID].farmerReceiver = _farmerProduct.receiver;
        chains[_chainID].isChain = true;

        uint256 _numberOfChains = numberOfChains;
        numberOfChains = _numberOfChains + 1;
        farmerIds[msg.sender].chainIds.push(_chainID);
        farmerIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);

        address farmer = chains[_chainID].farmer;
        address transporter = chains[_chainID].farmerTransporter;
        address receiver = chains[_chainID].farmerReceiver;
        uint256 harvestingTime = chains[_chainID].farmerHarvestingTime;
        uint256 packagingTime = chains[_chainID].farmerPackagingTime;
        uint256 departureTime = chains[_chainID].farmerDepartureTime;

        require(farmer == msg.sender && isPartner(farmer), "invalid farmer address");
        require(isPartner(transporter), "invalid transporter address");
        require(isPartner(receiver), "invalid receiver address");
        require(
            harvestingTime < packagingTime && packagingTime < departureTime,
            "invalid time"
        );

        emit ProductRegistered(farmer, _chainID, block.timestamp);
    }

    function ProductTransportation(
        string memory _chainID,
        string memory _productID,
        TransporterProduct memory _transporterProduct
    ) public onlyTransporter {
        require(isChain(_chainID), "Chain doesn't exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        chains[_chainID].transporterId = _transporterProduct.id;
        chains[_chainID].transporterParentId = _transporterProduct.parentId;
        chains[_chainID].transporterName = _transporterProduct.name;
        chains[_chainID].transporterCategory = _transporterProduct.category;
        chains[_chainID].transporterType = _transporterProduct._type;
        chains[_chainID].transporterReceivingTime = _transporterProduct.receivingTime;
        chains[_chainID].transporterDepartureTime = _transporterProduct.departureTime;
        chains[_chainID].transporter = _transporterProduct.transporter;
        chains[_chainID].transporterReceiver = _transporterProduct.receiver;

        transporterIds[msg.sender].chainIds.push(_chainID);
        transporterIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);

        address transporter = chains[_chainID].transporter;
        address receiver = chains[_chainID].transporterReceiver;
        uint256 receivingTime = chains[_chainID].transporterReceivingTime;
        uint256 departureTime = chains[_chainID].transporterDepartureTime;

        require(transporter == msg.sender && isPartner(transporter), "invalid transporter address");
        require(isPartner(receiver), "invalid receiver address");
        require(
            receivingTime < departureTime,
            "invalid time"
        );

        emit ProductTransported(transporter, receiver, _chainID, block.timestamp);
    }

    function productDistribution(
        string memory _chainID,
        string memory _productID,
        DistributorProduct memory _distributorProduct 
    ) public onlyDistributor {
        require(isChain(_chainID), "Chain doesn't exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        chains[_chainID].distributorId = _distributorProduct.id;
        chains[_chainID].distributorParentId = _distributorProduct.parentId;
        chains[_chainID].distributorName = _distributorProduct.name;
        chains[_chainID].distributorCategory = _distributorProduct.category;
        chains[_chainID].distributorType = _distributorProduct._type;
        chains[_chainID].distributorReceivingTime = _distributorProduct.receivingTime;
        chains[_chainID].distributorDepartureTime = _distributorProduct.departureTime;
        chains[_chainID].distributor = _distributorProduct.distributor;
        chains[_chainID].distributorReceiver = _distributorProduct.receiver;

        distributorIds[msg.sender].chainIds.push(_chainID);
        distributorIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);

        address distributor = chains[_chainID].distributor;
        address receiver = chains[_chainID].distributorReceiver;
        uint256 receivingTime = chains[_chainID].distributorReceivingTime;
        uint256 departureTime = chains[_chainID].distributorDepartureTime;

        require(distributor == msg.sender && isPartner(distributor), "invalid distributor address");
        require(isPartner(receiver), "invalid receiver address");
        require(
            receivingTime < departureTime,
            "invalid time"
        );

        emit ProductDistributed(distributor, receiver, _chainID, block.timestamp);
    }

    function ReailerProduct(
        string memory _chainID,
        string memory _productID,
        RetailerProduct memory _retailerProduct 
    ) public onlyRetailer {
        require(isChain(_chainID), "Chain doesn't exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        chains[_chainID].retailerId = _retailerProduct.id;
        chains[_chainID].retailerParentId = _retailerProduct.parentId;
        chains[_chainID].retailerName = _retailerProduct.name;
        chains[_chainID].retailerCategory = _retailerProduct.category;
        chains[_chainID].retailerType = _retailerProduct._type;
        chains[_chainID].retailerReceivingTime = _retailerProduct.receivingTime;
        chains[_chainID].retailerCookedTime = _retailerProduct.cookedTime;
        chains[_chainID].retailer = _retailerProduct.retailer;

        retailerIds[msg.sender].chainIds.push(_chainID);
        retailerIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);

        address retailer = chains[_chainID].retailer;
        uint256 receivingTime = chains[_chainID].retailerReceivingTime;
        uint256 cookedTime = chains[_chainID].retailerCookedTime;

        require(retailer == msg.sender && isPartner(retailer), "invalid retailer address");
        require(
            receivingTime < cookedTime,
            "invalid time"
        );

        emit ProductCooked(retailer, _chainID, _productID, block.timestamp);
    }
}