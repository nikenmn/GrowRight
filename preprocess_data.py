import pandas as pd

# Load the dataset
data = pd.read_csv('data_balita.csv')

# Display the first few rows of the dataset
print("Initial dataset:")
print(data.head())

# Handling missing values
# Fill missing values with the mean for numerical columns and the mode for categorical columns
data['age'].fillna(data['age'].mean(), inplace=True)
data['gender'].fillna(data['gender'].mode()[0], inplace=True)
data['height'].fillna(data['height'].mean(), inplace=True)
data['nutritional_status'].fillna(data['nutritional_status'].mode()[0], inplace=True)

# Encode categorical variables
# Gender: Assuming 'M' for male and 'F' for female
data['gender'] = data['gender'].map({'M': 1, 'F': 0})

# Nutritional Status: Convert categorical nutritional status to numerical values
# First, find the unique values in the nutritional_status column
unique_nutritional_status = data['nutritional_status'].unique()
# Create a mapping from unique values to numerical values
nutritional_status_mapping = {status: idx for idx, status in enumerate(unique_nutritional_status)}
# Apply the mapping
data['nutritional_status'] = data['nutritional_status'].map(nutritional_status_mapping)

# Normalize numerical variables
data['age'] = (data['age'] - data['age'].mean()) / data['age'].std()
data['height'] = (data['height'] - data['height'].mean()) / data['height'].std()

# Display the preprocessed dataset
print("\nPreprocessed dataset:")
print(data.head())

# Save the preprocessed dataset to a new CSV file
data.to_csv('preprocessed_data_balita.csv', index=False)

print("\nPreprocessed data saved to 'preprocessed_data_balita.csv'")
