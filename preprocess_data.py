import pandas as pd

# Load the dataset
df = pd.read_csv('Stunting.csv')

# Check for missing values
print("Missing values in each column:")
print(df.isnull().sum())

# Drop 'Birth Weight' and 'Birth Length' columns
if 'Birth Weight' in df.columns and 'Birth Length' in df.columns:
    df = df.drop(columns=['Birth Weight', 'Birth Length'])
else:
    print("One or both columns 'Birth Weight' and 'Birth Length' not found in the dataset.")

# Rename columns 'Body Weight' to 'weight' and 'Body Height' to 'height'
df = df.rename(columns={'Body Weight': 'Weight', 'Body Length': 'Height'})

# Verify the changes
print("Columns after deletion:")
print(df.columns)

# Save the cleaned dataset to a new CSV file
df.to_csv('Stunting_cleanedAndFix.csv', index=False)
