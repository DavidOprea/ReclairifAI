import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Test endpoint
@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask!"})

# Reword flashcards endpoint
@app.route("/generate-definitions", methods=["POST"])
def generate_definitions():
    data = request.json
    flashcards = data.get("flashcards", [])

    if not flashcards:
        return jsonify({"error": "No flashcards provided"}), 400

    # Build structured JSON prompt for AI
    prompt_text = (
        "You are an assistant that takes user-provided flashcard definitions "
        "and rewords them to be slightly different but keep the meaning. "
        "Return the output as valid JSON in this format:\n"
        "{\n  \"Term1\": \"Reworded definition1\",\n  \"Term2\": \"Reworded definition2\"\n}\n\n"
        + "\n\n".join([f"\"{card['term']}\": \"{card['definition']}\"" for card in flashcards])
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt_text}],
            temperature=0.7,
        )

        ai_text = response.choices[0].message.content.strip()

        # Parse AI output safely as JSON
        try:
            reworded = json.loads(ai_text)
        except json.JSONDecodeError:
            reworded = {"error": "AI did not return valid JSON", "raw_response": ai_text}

        return jsonify({"definitions": reworded})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
