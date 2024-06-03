import pandas as pd
import numpy as np
import tensorflow as tf # type: ignore
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('Stunting_Testing.csv')


# Encode gender as numerical values (assuming 'gender' column has 'Male' and 'Female')
df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})

# Separate features and target
X = df[['age', 'gender', 'weight', 'height']].values
y = df['Stunting'].map({'Not': 0, 'Stunting': 1}).values  # Assuming 'Stunting' column with values 'Not' and 'Stunting'

# Manually split the data into training and testing sets with a 70:30 ratio
split_ratio = 0.7
split_index = int(split_ratio * len(X))

X_train, X_test = X[:split_index], X[split_index:]
y_train, y_test = y[:split_index], y[split_index:]

# Standardize the features using TensorFlow
def standardize_data(train_data, test_data):
    mean = tf.reduce_mean(train_data, axis=0)
    stddev = tf.math.reduce_std(train_data, axis=0)
    train_data_standardized = (train_data - mean) / stddev
    test_data_standardized = (test_data - mean) / stddev
    return train_data_standardized, test_data_standardized

X_train, X_test = standardize_data(X_train, X_test)

# Define the model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(X_train, y_train, epochs=50, batch_size=16, validation_split=0.2)

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test)
print("TensorFlow Model Accuracy:", accuracy)

# Convert the model to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the TensorFlow Lite model
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)

# Load the TensorFlow Lite model and allocate tensors
interpreter = tf.lite.Interpreter(model_content=tflite_model)
interpreter.allocate_tensors()

# Get input and output tensor details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Test the TensorFlow Lite model on one sample
def predict_tflite(interpreter, X):
    input_shape = input_details[0]['shape']
    interpreter.set_tensor(input_details[0]['index'], X.astype(np.float32))
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    return output_data

# Make predictions with the TensorFlow Lite model
y_pred_tflite = []
for i in range(X_test.shape[0]):
    prediction = predict_tflite(interpreter, X_test[i:i+1])
    y_pred_tflite.append(prediction[0][0])

# Convert predictions to binary
y_pred_tflite = np.array(y_pred_tflite) > 0.5

# Evaluate the TensorFlow Lite model
print("TensorFlow Lite Model Accuracy:", accuracy_score(y_test, y_pred_tflite))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_tflite))
print("Classification Report:\n", classification_report(y_test, y_pred_tflite))

# Plot training & validation accuracy values
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('Model accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train', 'Validation'], loc='upper left')
plt.show()

# Plot training & validation loss values
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('Model loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(['Train', 'Validation'], loc='upper left')
plt.show()
