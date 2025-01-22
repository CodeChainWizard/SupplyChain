import React from "react";

interface TabsProps {
  activeTab: "create" | "list";
  setActiveTab: React.Dispatch<React.SetStateAction<"create" | "list">>;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-around mb-6">
      <button
        onClick={() => setActiveTab("create")}
        className={`${
          activeTab === "create" ? "text-blue-600" : "text-gray-600"
        } font-semibold px-4 py-2`}
      >
        Create New Product
      </button>
      <button
        onClick={() => setActiveTab("list")}
        className={`${
          activeTab === "list" ? "text-blue-600" : "text-gray-600"
        } font-semibold px-4 py-2`}
      >
        List All Products
      </button>
    </div>
  );
};

export default Tabs;
