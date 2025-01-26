import React, { useState } from "react";
import Analysis from "@/components/Analysis";
import ProductList from "@/components/ListOfAllProduct";
import CreateProduct from "@/components/createProduct";
import Tabs from "@/components/tabs";

const Index: React.FC = () => {
  // Define the type for activeTab
  const [activeTab, setActiveTab] = useState<"create" | "list" | "analysis">(
    "create"
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Supply Chain Management using Blockchain
        </h1>

        {/* Tabs Component */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Conditionally Render the Right Component Based on activeTab */}
        {activeTab === "create" && <CreateProduct setFormdata={() => {}} />}
        {activeTab === "analysis" && <Analysis />}
        {activeTab === "list" && <ProductList />}
      </div>
    </div>
  );
};

export default Index;
