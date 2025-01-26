# preprocess_data.py
import pandas as pd

def preprocess_raw_data(input_path, output_path):
    # Load raw data
    data = pd.read_csv(input_path)

    # Example preprocessing: handle missing values and convert dates
    data.fillna(method="ffill", inplace=True)
    data["date"] = pd.to_datetime(data["date"])
    data.sort_values(by="date", inplace=True)

    # Save processed data
    data.to_csv(output_path, index=False)
    print(f"Data preprocessed and saved to {output_path}")

if __name__ == "__main__":
    preprocess_raw_data("/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/data/raw/raw_demand_data.csv", "/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/data/processed/demand_data.csv")
