def optimize_inventory(demand_forecast, safety_stock_factor=1.5):
    """
    Optimizes inventory levels based on forecasted demand.
    :param demand_forecast: List of demand values (e.g., from a model's prediction)
    :param safety_stock_factor: Multiplier for safety stock calculation
    :return: List of optimal inventory levels
    """
    inventory_levels = []
    
    # Ensure the demand values are numeric
    if not all(isinstance(d, (int, float)) for d in demand_forecast):
        raise ValueError("All elements of demand_forecast must be numeric.")
    
    for demand in demand_forecast:
        # Calculate safety stock based on square root of demand
        safety_stock = safety_stock_factor * (demand ** 0.5)
        
        # Calculate optimal inventory as sum of forecasted demand and safety stock
        optimal_stock = demand + safety_stock
        inventory_levels.append(optimal_stock)
    
    return inventory_levels


if __name__ == "__main__":
    # Example usage
    demand_forecast = [100, 120, 140, 110, 150]
    optimized_inventory = optimize_inventory(demand_forecast)
    print("Optimized Inventory Levels:", optimized_inventory)
