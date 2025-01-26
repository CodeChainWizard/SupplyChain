import React, { useEffect, useState } from "react";
import {
  cancelProductTransfer,
  getAllProducts,
  productTransfer,
} from "@/lib/supplyChain";
import { BigNumber, ethers } from "ethers";

import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface Product {
  id: number;
  product_name: string;
}

interface PopupProps {
  productId: number;
  onClose: () => void;
  onTransfer: (productId: number, newOwner: string, details: string) => void;
}

const ProductTransferPopup: React.FC<PopupProps> = ({
  productId,
  onClose,
  onTransfer,
}) => {
  const [newOwner, setNewOwner] = useState("");
  const [details, setDetails] = useState("");
  const [isTransferred, setIsTransferred] = useState(false);

  const handleTransfer = () => {
    onTransfer(productId, newOwner, details);
    setIsTransferred(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Transfer Product</h2>
        <div className="mb-4">
          <label className="block text-gray-700">New Owner</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            disabled={isTransferred}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Details</label>
          <textarea
            className="w-full border px-3 py-2 rounded-lg"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isTransferred}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={onClose}
            disabled={isTransferred}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              isTransferred ? "bg-green-500" : "bg-blue-500 text-white"
            } `}
            onClick={handleTransfer}
            disabled={isTransferred}
          >
            {isTransferred ? "Transferred" : "Transfer"}
          </button>
        </div>
        {isTransferred && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Transfer Details</h3>
            <p>New Owner: {newOwner}</p>
            <p>Details: {details}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transferredProducts, setTransferredProducts] = useState<Set<number>>(
    new Set()
  );
  const [newOwer, setNewOwer] = useState<Map<number, string>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const allProducts = await getAllProducts();

        const formattedProducts = allProducts.map((product: any) => ({
          id: BigNumber.isBigNumber(product[0])
            ? product[0].toNumber()
            : product[0],
          product_name: product[1],
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedTransferredProducts = localStorage.getItem(
      "transferredProducts"
    );
    if (storedTransferredProducts) {
      setTransferredProducts(new Set(JSON.parse(storedTransferredProducts)));
    }

    const storedNewOwners = localStorage.getItem("newOwer");
    if (storedNewOwners) {
      setNewOwer(new Map(JSON.parse(storedNewOwners)));
    }
  }, []);

  const handleTransfer = async (
    productId: number,
    newOwner: string,
    details: string
  ) => {
    if (!productId || !ethers.utils.isAddress(newOwner) || !details.trim()) {
      alert("Invalid input data");
      return;
    }

    setLoading(true);
    try {
      const receipt = await productTransfer(productId, newOwner, details);

      setNewOwer((prev) => {
        const update = new Map(prev);
        update.set(productId, newOwner);
        localStorage.setItem("newOwer", JSON.stringify(Array.from(update))); // Persist in localStorage
        return update;
      });

      alert("Product transferred successfully");
      console.log("Transaction receipt:", receipt);

      setTransferredProducts((prev) => {
        const updatedSet = new Set([...prev, productId]);
        localStorage.setItem(
          "transferredProducts",
          JSON.stringify(Array.from(updatedSet))
        );
        return updatedSet;
      });

      setSelectedProduct(null);
    } catch (error: any) {
      console.error("Error transferring product:", error);
      alert(`Failed to transfer product: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancleTransferProduct = async (productId: number) => {
    if (!productId) {
      alert("Invalid Input");
      return;
    }

    setLoading(true);

    try {
      const receipt = await cancelProductTransfer(productId);

      setTransferredProducts((prev) => {
        const update = new Set(prev);
        update.delete(productId);
        localStorage.setItem(
          "transferredProducts",
          JSON.stringify(Array.from(update))
        );
        return update;
      });

      setNewOwer((prev) => {
        const updateMap = new Map(prev);
        updateMap.delete(productId);
        localStorage.setItem("newOwer", JSON.stringify(Array.from(updateMap))); // Update localStorage
        return updateMap;
      });

      console.log("Transaction receipt: ", receipt);
    } catch (error) {
      console.error("Error while canceling product transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  // Paginate products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-gray-600 mb-4">
        List Of All Products in Supply Chain
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : currentProducts.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.id}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.product_name}
                </td>

                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    id={`tooltip-${product.id}`}
                    className={`p-2 border rounded-lg ${
                      transferredProducts.has(product.id)
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => setSelectedProduct(product.id)}
                    disabled={transferredProducts.has(product.id)}
                  >
                    {transferredProducts.has(product.id)
                      ? "Transferred"
                      : "Transfer"}
                  </button>

                  {transferredProducts.has(product.id) ? (
                    <button
                      className="p-2 border rounded-lg mt-1"
                      onClick={() => handleCancleTransferProduct(product.id)}
                    >
                      X
                    </button>
                  ) : null}

                  <ReactTooltip
                    anchorId={`tooltip-${product.id}`}
                    place="top"
                    content={
                      transferredProducts.has(product.id)
                        ? `New Owner: ${newOwer.get(product.id) || "N/A"}`
                        : "Click to transfer this product."
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No products available.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({
          length: Math.ceil(products.length / productsPerPage),
        }).map((_, index) => (
          <button
            key={index + 1}
            className={`mx-1 px-3 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedProduct !== null && (
        <ProductTransferPopup
          productId={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
};

export default ProductList;
