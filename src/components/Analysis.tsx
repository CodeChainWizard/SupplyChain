import React, { useState } from "react";
import axios from "axios";

export default function Analysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [modelOutput, setModelOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrainModel = async () => {
    setIsLoading(true);
    setModelOutput(null);
    setError(null);

    try {
      const response = await axios.post("/api/trainModel", {
        dataPath:
          "/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/data/processed/demand_data.csv",
      });

      setModelOutput(response.data.output); // Assuming the output is a structured data
    } catch (error: any) {
      console.error("Error during model training:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(
            `Error: ${error.response.status} - ${error.response.statusText}`
          );
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          setError("No response received from the server.");
          console.error("Request error:", error.request);
        } else {
          // General error
          setError("Error during request setup: " + error.message);
        }
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render the model output in a table
  const renderTable = (data: string) => {
    // Assuming modelOutput is a CSV or tabular data string
    const rows = data.split("\n");
    const headers = rows[0].split(",");
    const tableData = rows.slice(1).map((row) => row.split(","));

    return (
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border px-4 py-2 bg-gray-100">
                {header.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-6">Demand Forecasting Model</h1>

      {/* Display the Train Model button */}
      <button
        onClick={handleTrainModel}
        disabled={isLoading}
        className={`px-6 py-2 text-lg cursor-pointer mb-5 rounded-lg mt-2 ${
          isLoading ? "bg-gray-400" : "bg-red-500 hover:bg-red-700"
        } transition-colors`}
      >
        {isLoading ? "Training..." : "Train Model"}
      </button>

      {isLoading && (
        <p className="text-gray-600">
          Training the model... This may take a few moments.
        </p>
      )}

      {modelOutput && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Model Output:</h3>
          <div className="overflow-x-auto">{renderTable(modelOutput)}</div>
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-6">
          <h3 className="text-lg font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
