import pandas as pd

# Load the dataset
data = pd.read_csv('data_balita.csv')

# Check for missing values in the dataset
missing_values = data.isnull().sum()

# Display the number of missing values for each column
print("Missing values in each column:")
print(missing_values)

# Check if there are any missing values in the dataset
if missing_values.any():
    print("\nThere are missing values in the dataset. Deleting rows with missing values...")
    # Drop rows with missing values
    data_cleaned = data.dropna()
    # Display the first few rows of the cleaned dataset
    print("\nCleaned dataset:")
    print(data_cleaned.head())
    # Save the cleaned dataset to a new CSV file
    data_cleaned.to_csv('cleaned_data_balita.csv', index=False)
    print("\nCleaned data saved to 'cleaned_data_balita.csv'")
else:
    print("\nThere are no missing values in the dataset.")
    # Optionally, you can save the original dataset if there are no missing values
    data.to_csv('cleaned_data_balita.csv', index=False)
    print("\nOriginal data saved to 'cleaned_data_balita.csv'")
