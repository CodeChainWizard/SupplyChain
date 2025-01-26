import { ethers, BigNumber } from "ethers";
import contractABI from "../artifacts/contract.json";

// const provide = new ethers.providers.JsonRpcBatchProvider(
//   process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL ||
//     "https://polygon-amoy.g.alchemy.com/v2/NO4ztLfeI0yv226QY4_hL7kSYgglHRn8"
// );

const contractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

if (!contractAddress) {
  throw new Error("Contract Address is not defined");
}

export const getContract = async () => {
  try {
    if (typeof (window as any).ethereum !== "undefined") {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();

      console.log("Provider initialized", provider);
      console.log("Signer obtained", signer);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      console.log("Contract instance created", contract);

      return contract;
    } else {
      throw new Error("No Ethereum provider found, please install Metamask");
    }
  } catch (error) {
    console.error("Error while running the getContract function:", error);
    throw new Error("Failed to get contract");
  }
};

export const createProduct = async (productId: number, productName: string) => {
  try {
    const contract = await getContract();
    if (!contract) {
      console.error("Contract Not Found...");
      return;
    }

    let gasLimit;
    try {
      gasLimit = await contract.estimateGas.createProduct(
        productId,
        productName
      );
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      gasLimit = ethers.BigNumber.from("300000"); // Default fallback gas limit
    }

    const tx = await contract.createProduct(productId, productName, {
      gasLimit,
    });

    console.log("Transaction sent. Waiting for confirmation...", tx);

    const receipt = await tx.wait();
    console.log("Transaction mined: ", receipt);

    return receipt;
  } catch (error) {
    console.error("Error while creating product:", error);
  }
};

export const getAllProducts = async () => {
  try {
    const contract = await getContract();

    if (!contract) {
      throw new Error("Contract not found");
    }

    // Log contract and method call
    console.log("Contract found. Calling getAllProducts()...");

    // Ensure the method exists in the contract
    if (!contract.getAllProducts) {
      throw new Error("Method getAllProducts does not exist in the contract");
    }

    // Call the getAllProducts method
    const products = await contract.getAllProducts();

    if (!products || products.length === 0) {
      console.warn("No products found or returned empty array.");
    }

    console.log("Fetched products:", products);

    return products;
  } catch (error: any) {
    console.error("Error calling getAllProducts:", error);

    if (error.code === "CALL_EXCEPTION") {
      alert("Transaction reverted. Please check contract and state.");
    } else if (error.message.includes("Method getAllProducts does not exist")) {
      alert(
        "The contract does not have the 'getAllProducts' method. Please check the contract ABI."
      );
    } else {
      alert(
        "An unexpected error occurred. Please check the console for details."
      );
    }
    throw error;
  }
};

//   try {
//     const contract = await getContract();

//     if (!contract) {
//       console.error("Contract not found");
//       return [];
//     }

//     // Log the method call
//     console.log("Calling getAllProducts()...");

//     const products = await contract.getAllProducts();

//     if (!products || products.length === 0) {
//       console.warn("No products found or returned empty array.");
//       return [];
//     }

//     console.log("Fetched products:", products);

//     return products.map((product: any) => ({
//       id: product.id.toString(),
//       product_name: product.product_name,
//       owner: product.Owner,
//     }));
//   } catch (error: any) {
//     console.error("Error fetching products:", error);

//     // Specific handling for CALL_EXCEPTION
//     if (error.code === "CALL_EXCEPTION") {
//       console.error("CALL_EXCEPTION encountered. Possible issues:");
//       console.error("- The contract function reverted or failed.");
//       console.error("- The ABI may not match the deployed contract.");
//       console.error(
//         "- The smart contract might not be returning the expected data."
//       );
//     }

//     // Optionally throw an error to propagate it to the calling function
//     throw new Error(error.message || "Failed to fetch products");
//   }
// };

export const productTransfer = async (
  productId: number,
  newOwner: string,
  details: string
) => {
  try {
    const contract = await getContract();
    if (!contract) {
      throw new Error("Contract not found");
    }

    const signer = await contract.signer.getAddress();
    const product = await contract.products(productId);

    console.log("Current product owner:", product.Owner);
    console.log("Caller (signer):", signer);

    // Check if the signer is the product owner
    if (product.Owner.toLowerCase() !== signer.toLowerCase()) {
      throw new Error("Caller is not the product owner");
    }

    const gasLimit = await contract.estimateGas.transferProduct(
      productId,
      newOwner,
      details
    );
    console.log("Gas limit estimated:", gasLimit.toString());

    const tx = await contract.transferProduct(productId, newOwner, details, {
      gasLimit,
    });

    console.log("Transaction sent. Waiting for confirmation...", tx);

    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);

    return receipt;
  } catch (error: any) {
    console.error("Failed to transfer product:", error.message);
    if (error.message.includes("Caller is not the product owner")) {
      console.error(
        "Additional Info: Caller address does not match the current product owner."
      );
    }
    throw error;
  }
};

export const cancelProductTransfer = async (productId: number) => {
  try {
    const contract = await getContract();
    if (!contract) {
      console.error("Contract not found");
      return;
    }

    const signer = await contract.signer.getAddress();
    console.log("Caller (signer):", signer);

    const product = await contract.products(productId);
    console.log("Product Details:", product);

    if (signer !== product.Owner) {
      console.error("Only the current product owner can cancel the transfer.");
      return;
    }

    // const gasLimit = await contract.estimateGas.cancelTransferProduct(
    //   productId
    // );

    // Call contract to cancel transfer
    const tx = await contract.cancelTransferProduct(productId, {
      gasLimit: 500000,
    });
    console.log("Transaction sent:", tx);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    return receipt;
  } catch (error) {
    console.error("Error in cancelProductTransfer:", error);
    throw error;
  }
};
