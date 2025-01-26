import React, { useState } from "react";
import { createProduct } from "@/lib/supplyChain"; // Import your blockchain product creation logic

interface CreateProductProps {
  setFormdata: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }>
  >;
}

const CreateProduct: React.FC<CreateProductProps> = ({ setFormdata }) => {
  const [formdata, setFormData] = useState({ id: "", name: "" });
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const generateRandomLocationId = () => {
    return Math.floor(1000 + Math.random() * 900000);
  };

  const generateRandomDemand = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const generateRandomPrice = () => {
    return (Math.random() * (500 - 10) + 10).toFixed(2);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const generateNumber = Math.floor(1000 + Math.random() * 9000);
    setRandomNumber(generateNumber);

    try {
      const tx = await createProduct(generateNumber, formdata.name);

      // const productData = {
      //   product_id: generateNumber,
      //   name: formdata.name,
      //   date: new Date().toISOString().split("T")[0],
      //   location_id: 654321,
      //   demand: 10000,
      //   price: 100.0,
      // };

      const productData = {
        product_id: generateNumber,
        name: formdata.name,
        date: new Date().toISOString().split("T")[0],
        location_id: generateRandomLocationId(),
        demand: generateRandomDemand(),
        price: generateRandomPrice(),
      };

      // Call the API to save the product data in the CSV file
      const response = await fetch("/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormdata({
          id: "",
          name: "",
        });

        console.log("Form Data: ", { id: generateNumber, name: formdata.name });
        alert("Product created and added to CSV successfully!");
        return tx;
      } else {
        console.error("Failed to add product to CSV:", data.error);
        alert("Error adding product to CSV.");
      }
    } catch (error) {
      console.error("Error while creating new product:", error);
      alert("Error creating product.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-gray-600 mb-4">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="number"
            hidden
            name="id"
            value={randomNumber || ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Enter Product Name"
            name="name"
            value={formdata.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="submit"
            value="Submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
