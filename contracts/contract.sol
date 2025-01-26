// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint256 id;
        string product_name;
        address Owner;
        address previousOwner;
        bool isTransferred;
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

    event ProductCreated(uint256 productId, string productName, address Owner);
    event ProductTransferred(
        uint256 productId,
        address from,
        address to,
        string details
    );
    event TransferCancelled(uint256 indexed productId, address newOwner);

    /**
     * @dev Creates a new product.
     * @param _productId Unique ID for the product.
     * @param _productName Name of the product.
     */
    function createProduct(uint256 _productId, string memory _productName)
        public
    {
        require(
            products[_productId].Owner == address(0),
            "Product already exists"
        );

        products[_productId] = Product({
            id: _productId,
            product_name: _productName,
            Owner: msg.sender,
            previousOwner: address(0),
            isTransferred: false
        });

        productIds.push(_productId); // Store the product ID in the array

        emit ProductCreated(_productId, _productName, msg.sender);
    }

    /**
     * @dev Transfers a product to a new owner.
     * @param _productId Unique ID of the product.
     * @param _newOwner Address of the new owner.
     * @param _details Details about the transfer.
     */
    function transferProduct(
        uint256 _productId,
        address _newOwner,
        string memory _details
    ) public {
        Product storage product = products[_productId];

        require(
            product.Owner == msg.sender,
            "Only the current owner can transfer"
        );
        require(_newOwner != address(0), "New owner address is invalid");

        // Update product ownership details
        product.previousOwner = product.Owner;
        product.Owner = _newOwner;
        product.isTransferred = true;

        // Record the transfer
        TransferProduct memory newTransfer = TransferProduct({
            id: _productId,
            from: msg.sender,
            to: _newOwner,
            timestamp: block.timestamp,
            details: _details
        });
        productTransfer[_productId].push(newTransfer);

        emit ProductTransferred(_productId, msg.sender, _newOwner, _details);
    }

    /**
     * @dev Cancels a product transfer and reverts ownership to the previous owner.
     * @param productId Unique ID of the product.
     */
    function cancelTransferProduct(uint256 productId) public {
        require(productId != 0, "Product ID is not valid");
        Product storage product = products[productId];

        require(product.Owner != address(0), "Product does not exist");
        require(product.isTransferred, "Product is not transferred");
        require(
            msg.sender == product.Owner,
            "Only the current owner can cancel"
        );
        require(
            product.previousOwner != address(0),
            "No previous owner to revert to"
        );

        // Revert ownership
        product.Owner = product.previousOwner;
        product.previousOwner = address(0);
        product.isTransferred = false;

        emit TransferCancelled(productId, product.Owner);
    }

    /**
     * @dev Tracks the transfer history of a product.
     * @param _productId Unique ID of the product.
     * @return Array of TransferProduct structs representing the transfer history.
     */
    function trackProduct(uint256 _productId)
        public
        view
        returns (TransferProduct[] memory)
    {
        return productTransfer[_productId];
    }

    /**
     * @dev Verifies if a product exists.
     * @param _productId Unique ID of the product.
     * @return Boolean indicating whether the product exists.
     */
    function verifyProduct(uint256 _productId) public view returns (bool) {
        return products[_productId].Owner != address(0);
    }

    /**
     * @dev Gets the details of a product.
     * @param _productId Unique ID of the product.
     * @return Name of the product and current owner's address.
     */
    function getProductDetails(uint256 _productId)
        public
        view
        returns (string memory, address)
    {
        Product storage product = products[_productId];
        return (product.product_name, product.Owner);
    }

    /**
     * @dev Retrieves all products in the system.
     * @return Array of all Product structs.
     */
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
