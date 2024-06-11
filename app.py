from tensorflow import keras
from flask import Flask, request, jsonify, make_response
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Memuat model
model = keras.models.load_model("model.h5")

def transform_to_percentile(value):
    if value < 0:
        return max(0, 100 - (abs(value) * 100))  # untuk rentang -1 ke 0 menjadi 100% ke 0%, minimal 0%
    else:
        return min(100, value * 100)  # untuk rentang 0 ke 1 menjadi 0% ke 100%, maksimal 100%

@app.route("/predict", methods=["POST"])
def predict():
    apikey = request.headers.get('apikey')
    
    # Validasi API key dan input
    if apikey != "B1sM1Llaht0pi5C4p5t0N3":
        return make_response(jsonify({"status": "error", "message": "API key is invalid"}), 401)
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON data"})
        
        # Pastikan data yang diperlukan ada dalam format yang benar
        required_features = ['age', 'weight', 'height', 'gender_male']
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing {feature} in the request data"})

        # Prediksi menggunakan model
        X = pd.DataFrame(data, index=[0])  # Membuat DataFrame dari data
        predictions = model.predict(X)

        # Transformasi stuntingpercentage ke skala 0-100%
        predictions[:, 3] = [transform_to_percentile(value) for value in predictions[:, 3]]
        
        # Buat respons dalam format JSON
        response = {
            "age": data['age'],
            "weight": data['weight'],
            "height": data['height'],
            "gender": "male" if data['gender_male'] == 1 else "female",
            "stuntingpercentage": predictions[:, 3].tolist()
        }

        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
