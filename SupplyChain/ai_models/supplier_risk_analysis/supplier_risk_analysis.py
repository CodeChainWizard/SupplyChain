import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train_supplier_risk_model(data_path):
    """
    Trains a machine learning model to analyze the risk of suppliers.
    :param data_path: Path to the dataset containing supplier information
    :return: Trained model
    """
    # Load dataset
    data = pd.read_csv(data_path)

    # Handle missing values (forward fill)
    data.ffill(inplace=True)  # Use ffill() instead of fillna(method="ffill")

    # Features (assuming the dataset has columns for delivery_time, quality_score, complaints_history)
    X = data[['delivery_time', 'quality_score', 'complaints_history']]
    
    # Target (assumed target is 'risk_level' where 0 = Low, 1 = High)
    y = data['risk_level']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train the model
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    # Save the model
    model_filename = 'supplier_risk_model.pkl'
    joblib.dump(model, model_filename)
    print(f"Model saved as '{model_filename}'")

    # Optionally return accuracy and classification report as well
    report = classification_report(y_test, y_pred)
    
    return model, accuracy, report

if __name__ == "__main__":
    # Specify the correct path to the supplier data CSV
    model, accuracy, report = train_supplier_risk_model(
        "/Users/yashcomputers/Desktop/Blockchain project/SupplyChain/supply_chain/SupplyChain/data/supplier_data/supplier_data.csv"
    )
    print(f"Model Accuracy: {accuracy}")
    print("Classification Report:")
    print(report)
