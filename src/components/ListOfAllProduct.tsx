import React, { useEffect, useState } from "react";
import { getAllProducts, productTransfer } from "@/lib/supplyChain";
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
  const [newOwer, setNewOwer] = useState("");

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
      setNewOwer(newOwner);
      alert("Product transferred successfully");
      console.log("Transaction receipt:", receipt);

      // Update transferred products
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

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-gray-600 mb-4">
        List Of All Products in Supply Chain
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : products.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.id}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {product.product_name}
                </td>

                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    id={`tooltip-${product.id}`} // Assign a unique ID for the tooltip
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

                  {/* Tooltip Component */}
                  <ReactTooltip
                    anchorId={`tooltip-${product.id}`} // Matches the button's ID
                    place="top"
                    content={
                      transferredProducts.has(product.id)
                        ? `NewOwer: ${newOwer}`
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
