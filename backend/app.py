from flask import Flask, request, jsonify 
from werkzeug.utils import secure_filename
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image, ImageOps
from io import BytesIO
import os
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model/coconut_disease_model.h5')

# Create upload folder
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load model
try:
    model = load_model(MODEL_PATH)
    logger.info("✅ Model loaded successfully!")
except Exception as e:
    logger.error(f"❌ Error loading model: {str(e)}")
    model = None

# Class names (in English)
class_names =['Bud Root Dropping', 'Bud Rot', 'Gray Leaf Spot', 'Leaf Rot', 'Stem Bleeding']



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(img):
    """Preprocess the image for model prediction"""
    try:
        # Convert to RGB if not already
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Resize and normalize
        img = ImageOps.fit(img, (256, 256), Image.Resampling.LANCZOS)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

def predict_image(img):
    """Helper to preprocess and predict"""
    try:
        img_array = preprocess_image(img)
        predictions = model.predict(img_array)
        logger.info(f"🔍 Raw predictions: {predictions}")
        
        predicted_class = np.argmax(predictions[0])
        confidence = np.max(predictions[0])
        
        # Convert numpy floats to Python floats for JSON serialization
        all_predictions = {
            name: float(pred) 
            for name, pred in zip(class_names, predictions[0])
        }
        
        return {
            'class': class_names[predicted_class],
            'confidence': float(confidence),
            'all_predictions': all_predictions
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        logger.warning("No file part in request")
        return jsonify({'error': 'No file part in request'}), 400

    file = request.files['file']
    if file.filename == '':
        logger.warning("No file selected")
        return jsonify({'error': 'No file selected'}), 400

    if not model:
        logger.error("Model not available")
        return jsonify({'error': 'Model not available'}), 500

    if file and allowed_file(file.filename):
        try:
            # Read image file
            img_bytes = file.read()
            img = Image.open(BytesIO(img_bytes))
            
            # Verify image is valid
            img.verify()  # Verify that it is an image
            img = Image.open(BytesIO(img_bytes))  # Reopen after verify
            
            result = predict_image(img)
            logger.info(f"Prediction result: {result}")
            
            return jsonify(result)
            
        except Image.UnidentifiedImageError:
            logger.error("Invalid image file")
            return jsonify({'error': 'Invalid image file'}), 400
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500
    else:
        logger.warning(f"Invalid file type: {file.filename}")
        return jsonify({'error': 'Allowed file types are png, jpg, jpeg, webp'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)