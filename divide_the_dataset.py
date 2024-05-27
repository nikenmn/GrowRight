import pandas as pd

# Load the data from the CSV file
data = pd.read_csv('Stunting_cleanedAndFix.csv')

# Separate 70% of the data
separation_index = int(len(data) * 0.7)
data_70 = data[:separation_index]

# Separate the rest 30% of the data
data_30 = data[separation_index:]

# Delete the Stunting column from the 30% data
data_30 = data_30.drop('Stunting', axis=1)

# Save the separated data to new CSV files
data_70.to_csv('Stunting_70.csv', index=False)
data_30.to_csv('Stunting_30.csv', index=False)