import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Ensure that the dataPath is provided in the request body
    if (!req.body.dataPath) {
      return res.status(400).json({ error: "dataPath is required" });
    }

    // Define the path to your Python script (make sure this is correct)
    const pythonScript = path.resolve(
      process.cwd(),
      "/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/ai_models/demand_forecasting",
      "model.py"
    );

    // Check if the Python script exists at the specified path
    const fs = require("fs");
    if (!fs.existsSync(pythonScript)) {
      return res
        .status(500)
        .json({ error: `Python script not found at ${pythonScript}` });
    }

    console.log(`Python script located at: ${pythonScript}`);

    // Execute the Python script
    const python = spawn("python3", [pythonScript, req.body.dataPath]);

    let output = "";
    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    python.on("close", (code) => {
      if (code === 0) {
        res.status(200).json({ output });
      } else {
        res.status(500).json({ error: "Failed to run the Python script" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
