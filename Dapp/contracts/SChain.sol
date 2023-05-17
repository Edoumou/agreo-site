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
        string memory _phoneNumber
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
        Product memory _product
    ) public onlyFarmer {
        require(!isChain(_chainID), "Chain already exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        _isChain[_chainID] = true;
        products[_chainID][_productID] = _product;

        uint256 _numberOfChains = numberOfChains;
        numberOfChains = _numberOfChains + 1;
        listOfChainIds.push(_chainID);
        farmerIds[msg.sender].chainIds.push(_chainID);
        farmerIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);
        chains[_chainID].push(_product);

        address farmer = products[_chainID][_productID].stakeholderAddress;
        address receiver = products[_chainID][_productID].receiverAddress;
        address transporter = products[_chainID][_productID].transporterAddress;
        uint256 harvestingTime = products[_chainID][_productID].harvestingTime;
        uint256 packagingTime = products[_chainID][_productID].packagingTime;
        uint256 departureTime = products[_chainID][_productID].departureTime;

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
        Product memory _product
    ) public onlyTransporter {
        require(isChain(_chainID), "Chain doesn't exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        products[_chainID][_productID] = _product;

        transporterIds[msg.sender].chainIds.push(_chainID);
        transporterIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);
        chains[_chainID].push(_product);

        address transporter = products[_chainID][_productID].stakeholderAddress;
        address receiver = products[_chainID][_productID].receiverAddress;
        uint256 departureTime = products[_chainID][_productID].departureTime;
        uint256 receivingTime = products[_chainID][_productID].receivingTime;

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
        Product memory _product 
    ) public onlyDistributor {
        require(isChain(_chainID), "Chain doesn't exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        products[_chainID][_productID] = _product;

        distributorIds[msg.sender].chainIds.push(_chainID);
        distributorIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);
        chains[_chainID].push(_product);

        address distributor = products[_chainID][_productID].stakeholderAddress;
        address receiver = products[_chainID][_productID].receiverAddress;
        uint256 departureTime = products[_chainID][_productID].departureTime;
        uint256 receivingTime = products[_chainID][_productID].receivingTime;

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
        Product memory _product 
    ) public onlyRetailer {
        require(isChain(_chainID), "Chain doesn't exists");
        require(
            keccak256(abi.encodePacked(_chainID)) != keccak256(abi.encodePacked(_productID)),
            "ChainID must be different to ProductID"
        );

        products[_chainID][_productID] = _product;

        retailerIds[msg.sender].chainIds.push(_chainID);
        retailerIds[msg.sender].productIds.push(_productID);
        chainProductIds[_chainID].push(_productID);
        chains[_chainID].push(_product);

        address retailer = products[_chainID][_productID].stakeholderAddress;
        uint256 receivingTime = products[_chainID][_productID].receivingTime;
        uint256 cookedTime = products[_chainID][_productID].cookedTime;

        require(retailer == msg.sender && isPartner(retailer), "invalid retailer address");
        require(
            receivingTime < cookedTime,
            "invalid time"
        );

        emit ProductCooked(retailer, _chainID, _productID, block.timestamp);
    }
}