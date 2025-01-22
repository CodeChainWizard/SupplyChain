import React, { useState } from "react";
import { createProduct } from "@/lib/supplyChain";

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const generateNumber = Math.floor(1000 + Math.random() * 9000);
    setRandomNumber(generateNumber);

    try {
      const tx = await createProduct(generateNumber, formdata.name);
      setFormdata({
        id: "",
        name: "",
      });

      console.log("Form Data: ", { id: generateNumber, name: formdata.name });

      alert("Create New Product is Successfully");
    } catch (error) {
      console.error("Error while Create new Product: ", error);
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
