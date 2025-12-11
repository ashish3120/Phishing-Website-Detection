{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "f9b8e347",
   "metadata": {},
   "outputs": [],
   "source": [
    "from flask import Flask, request, jsonify\n",
    "from flask_cors import CORS\n",
    "import joblib\n",
    "import pandas as pd\n",
    "from extract_features import extract_features\n",
    "\n",
    "# Load model + training columns\n",
    "model = joblib.load(\"best_model.pkl\")\n",
    "training_columns = joblib.load(\"training_columns.pkl\")\n",
    "\n",
    "app = Flask(__name__)\n",
    "CORS(app)\n",
    "\n",
    "@app.route(\"/\")\n",
    "def home():\n",
    "    return {\"message\": \"Phishing API is running\"}\n",
    "\n",
    "@app.route(\"/predict\", methods=[\"POST\"])\n",
    "def predict():\n",
    "    data = request.get_json()\n",
    "\n",
    "    if not data or \"url\" not in data:\n",
    "        return jsonify({\"error\": \"Send JSON: {\\\"url\\\": \\\"https://...\\\"}\"}), 400\n",
    "\n",
    "    url = data[\"url\"]\n",
    "\n",
    "    # Extract features\n",
    "    feats = extract_features(url)\n",
    "    \n",
    "    # Align features to training columns\n",
    "    row = {col: feats.get(col, 0) for col in training_columns}\n",
    "    df_row = pd.DataFrame([row])\n",
    "\n",
    "    pred = model.predict(df_row)[0]\n",
    "    result = \"phishing\" if pred == 1 else \"legitimate\"\n",
    "\n",
    "    # Probability (only for models that support predict_proba)\n",
    "    prob = None\n",
    "    if hasattr(model, \"predict_proba\"):\n",
    "        prob = float(model.predict_proba(df_row)[0].max())\n",
    "\n",
    "    return jsonify({\n",
    "        \"url\": url,\n",
    "        \"prediction\": result,\n",
    "        \"probability\": prob\n",
    "    })\n",
    "\n",
    "if __name__ == \"__main__\":\n",
    "    app.run(host=\"0.0.0.0\", port=5000)\n"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "name": "python",
   "version": "3.10.11"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
