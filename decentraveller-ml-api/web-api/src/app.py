from flask import Flask, request
from .models.aesthetic_scorer import AestheticScorer

app = Flask(__name__)

image_scorer = AestheticScorer("assets/aesthetic_model.model")

@app.route("/aesthetic_score/predict", methods=["POST"])
def predict_image_score():
    file = request.files['file'].read()
    score = 0.0
    try:
        score = image_scorer.predict(file)
    except Exception:
        pass
    return {"score": score}