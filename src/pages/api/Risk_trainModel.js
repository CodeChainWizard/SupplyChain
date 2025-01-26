import { exec } from "child_process";
import path from "path";

export default function Risk_trainModel(req, res) {
  if (req.method === "POST") {
    const { dataPath } = req.body;

    if (!dataPath) {
      return res.status(400).json({ error: "Missing data path!" });
    }

    const pythonScriptPath = path.resolve(
      process.cwd(),
      "/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/ai_models/supplier_risk_analysis/supplier_risk_analysis.py"
    );

    // Wrap the paths in quotes to handle spaces
    const command = `python3 "${pythonScriptPath}" "${dataPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(
          "Error executing Python script on Risk Model:",
          error.message
        );
        console.error(error);
        return res
          .status(500)
          .json({ error: `Failed to train model: ${error.message}` });
      }

      if (stderr) {
        console.log(`Python Script Error: ${stderr}`);
        return res
          .status(500)
          .json({ error: `Error in Python script: ${stderr}` });
      }

      console.log("Python script executed successfully. Output:", stdout);
      res.status(200).json({ output: stdout });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
