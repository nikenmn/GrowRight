import pandas as pd
import numpy as np
import tensorflow as tf # type: ignore
import matplotlib.pyplot as plt

# Load the data from the CSV file
data = pd.read_csv('Stunting_Testing.csv')

# Preprocess the data
data['gender'] = data['gender'].map({'male': 0, 'female': 1})

# Split the data into features and labels
X = data[['age', 'gender', 'weight', 'height']]
y = data['Stunting_Status']

# Normalize the data
X = X / X.max()

# Create a TensorFlow model
model = tf.keras.models.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(4,)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(2, activation='softmax')
])

# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X, y, epochs=10)

# Convert the model to tflite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the tflite model
with open('stunting_model.tflite', 'wb') as f:
    f.write(tflite_model)

# Plot the accuracy and loss
plt.plot(model.history.history['accuracy'])
plt.plot(model.history.history['loss'])
plt.xlabel('Epoch')
plt.ylabel('Accuracy/Loss')
plt.legend(['Accuracy', 'Loss'])
plt.show()