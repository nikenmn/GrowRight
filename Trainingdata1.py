import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

# Load the dataset
df = pd.read_csv('Stunting_cleanedAndFix.csv')

# Preprocess the data
# Drop 'Birth Weight' and 'Birth Length' columns if they exist
columns_to_drop = ['Birth Weight', 'Birth Length']
df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])

# Rename columns 'Body Weight' to 'weight' and 'Body Height' to 'height'
df = df.rename(columns={'Body Weight': 'weight', 'Body Height': 'height'})

# Encode gender as numerical values (assuming 'gender' column has 'Male' and 'Female')
df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})

# Separate features and target
X = df[['age', 'gender', 'weight', 'height']]
y = df['Stunting']  # Assuming the target column is named 'Stunting'

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train the SVM model
svm_model = SVC(kernel='linear')  # You can experiment with other kernels like 'rbf', 'poly', etc.
svm_model.fit(X_train, y_train)

# Make predictions
y_pred = svm_model.predict(X_test)

# Evaluate the model
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))
