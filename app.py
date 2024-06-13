from flask import Flask, request, jsonify, make_response
import joblib
import numpy as np
import tensorflow as tf
import os

app = Flask(__name__)

# Muat scaler dan model TensorFlow saat aplikasi dimulai
normalization_model = "model/normalization_model.joblib"
scaler = joblib.load(normalization_model)

tensorflow_model = "model/model.h5"
model = tf.keras.models.load_model(tensorflow_model)

# def genderEncode(gender, age, weight, height):
#     gender_encoding = {'male': 1, 'female': 0}
#     gender_encoded = gender_encoding.get(gender)
#     return gender_encoded, age, weight, height

def normalize_data(gender, age, weight, height):
    feature = np.array([[gender, age, weight, height]])
    normalized_data = scaler.transform(feature)
    return normalized_data

# Ambil API key dari environment variables
API_KEY = os.getenv("API_KEY")

@app.route("/predict", methods=["POST"])
def predict():
    apikey = request.headers.get('apikey')
    
    # Validasi API key
    if apikey != API_KEY:
        return make_response(jsonify({"status": "error", "message": "API key is invalid"}), 401)
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400
        
        # Validasi input data
        required_features = ['gender', 'age', 'weight', 'height']
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing {feature} in the request data"}), 400

        gender = data['gender']
        age = data['age']
        weight = data['weight']
        height = data['height']
        
        # Proses data
        # gender, age, weight, height = genderEncode(gender_encoded, age, weight, height)
        normalized_data = normalize_data(gender, age, weight, height)
        predictions = model.predict(normalized_data)
        formatted_predictions = [f'{value:.2f}' for value in predictions[0]]
        
        # Buat respons dalam format JSON
        response = {
            "gender": gender,
            "age": age,
            "height": height,
            "weight": weight,
            "formatted_predictions": formatted_predictions
        }

        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
