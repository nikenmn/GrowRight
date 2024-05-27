import pandas as pd

# Load the data from the CSV file
data = pd.read_csv('Stunting_cleanedAndFix.csv')

# Separate 70% of the data
separation_index = int(len(data) * 0.8)
data_80 = data[:separation_index]

# Separate the rest 30% of the data
data_20 = data[separation_index:]

# Delete the Stunting column from the 30% data
data_20 = data_20.drop('Stunting', axis=1)

# Save the separated data to new CSV files
data_80.to_csv('Stunting_Training.csv', index=False)
data_20.to_csv('Stunting_Testing.csv', index=False)