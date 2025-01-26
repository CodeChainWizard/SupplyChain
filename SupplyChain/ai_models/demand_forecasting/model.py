import pandas as pd;
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

import joblib
import matplotlib.pyplot as plt

def train_demand_forecasting_model(data_path):
    data = pd.read_csv(data_path)
    data = data.ffill()

    if 'date' in data.columns:
        data['date'] = pd.to_datetime(data['date'])
        data['year'] = data['date'].dt.year
        data['month'] = data['date'].dt.month
        data['day'] = data['date'].dt.day
        data.drop(columns=['date'], inplace=True)

    X = data.drop(columns=["demand"]);
    y = data["demand"];

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42);

    model = RandomForestRegressor(random_state=42);
    model.fit(X_train, y_train);

    predictions = model.predict(X_test);
    mse = mean_squared_error(y_test,predictions);
    print(f"Mean Squared Error: {mse}");

    joblib.dump(model, 'demand_forecasting_model.pkl')
    print("Model Save as 'train_demand_forecasting_model.pkl'")

    plt.figure(figsize=(10,5))
    plt.scatter(range(len(predictions)), y_test, label="Actual", alpha=0.7, color="blue")
    plt.scatter(range(len(predictions)), predictions, label='Predicted', alpha=0.7, color='red')
    plt.legend();
    plt.title("Actual vs Predicted Demand")
    plt.xlabel("Sample Index")
    plt.ylabel("Demand")
    plt.show()

    return model;

if __name__ == "__main__":
    model = train_demand_forecasting_model("/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/data/processed/demand_data.csv");
