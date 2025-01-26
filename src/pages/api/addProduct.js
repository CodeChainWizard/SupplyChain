import fs from "fs";
import path from "path";

export default function addProduct(req, res) {
  if (req.method === "POST") {
    const { product_id, name, date, location_id, demand, price } = req.body;

    // Check if all required fields are present
    if (!product_id || !name || !date || !location_id || !demand || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const csvFilePath = path.resolve(
      process.cwd(),
      "/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/data/processed/demand_data.csv"
    );

    const newProductRow = `${date},${product_id},${location_id},${demand},${price}\n`;

    // Check if the file exists, and if not, create it with headers
    if (!fs.existsSync(csvFilePath)) {
      const headers = "date,product_id,location_id,demand,price\n";
      fs.writeFileSync(csvFilePath, headers, "utf8"); // Create the file with headers
    }

    // Append the new product data to the CSV file
    fs.appendFile(csvFilePath, newProductRow, (err) => {
      if (err) {
        console.error("Error writing to CSV file:", err);
        return res.status(500).json({ error: "Failed to write to CSV file" });
      }

      res.status(200).json({ message: "Product added successfully" });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
