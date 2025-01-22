// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint256 id;
        string product_name;
        address Owner;
    }

    struct TransferProduct {
        uint256 id;
        address from;
        address to;
        uint256 timestamp;
        string details;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => TransferProduct[]) public productTransfer;
    uint256[] public productIds; // Array to store all product IDs

    event ProductCreate(uint256 productId, string productName, address Owner);
    event ProductTransferred(uint256 productId, address from, address to, string details);

    function createProduct(uint256 _productId, string memory _productName) public {
        require(products[_productId].Owner == address(0), "Product already exists");

        products[_productId] = Product({
            id: _productId,
            product_name: _productName,
            Owner: msg.sender
        });

        productIds.push(_productId); // Store the product ID in the array

        emit ProductCreate(_productId, _productName, msg.sender);
    }

    function transferProduct(
    uint256 _productId,
    address _newOwner,
    string memory _details
) public {
    Product storage product = products[_productId];

    // Debug emit
    emit Debug("Checking product owner", product.Owner);

    require(product.Owner == msg.sender, "You can't perform this operation");

    TransferProduct memory newTransfer = TransferProduct({
        id: _productId,
        from: msg.sender,
        to: _newOwner,
        timestamp: block.timestamp,
        details: _details
    });

    productTransfer[_productId].push(newTransfer);
    product.Owner = _newOwner;

    emit ProductTransferred(_productId, msg.sender, _newOwner, _details);
}

event Debug(string message, address value);


    function trackProduct(uint256 _productId) public view returns (TransferProduct[] memory) {
        return productTransfer[_productId];
    }

    function verifyProduct(uint256 _productId) public view returns (bool) {
        return products[_productId].Owner != address(0);
    }

    function getProductDetails(uint256 _productId) public view returns (string memory, address) {
        Product storage product = products[_productId];
        return (product.product_name, product.Owner);
    }

   function getAllProducts() public view returns (Product[] memory) {
        uint256 totalProducts = productIds.length;
        Product[] memory allProducts = new Product[](totalProducts);

        for (uint256 i = 0; i < totalProducts; i++) {
            uint256 productId = productIds[i];
            allProducts[i] = products[productId];
        }

        return allProducts;
    }
}
