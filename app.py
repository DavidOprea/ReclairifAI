import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import time
import datetime
import random

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY not found in environment variables")

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
            temperature = random.uniform(0.6, 0.9)
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

@app.route('/api/process-vocabulary', methods=['POST'])
def process_vocabulary():
    try:
        data = request.json
        vocabulary = data.get('vocabulary', [])
        session_id = data.get('sessionId', '')
        deck_id = data.get('deckId', '')
        
        if not vocabulary:
            return jsonify({'error': 'No vocabulary provided'}), 400
        
        # Prepare flashcards
        flashcards = []
        for item in vocabulary:
            flashcards.append({
                'term': item.get('word', ''),
                'definition': item.get('definition', '')
            })
        
        # Optimized randomness - balance creativity and cost
        import random
        temperature = random.uniform(0.9, 1.3)  # Still creative but reasonable
        
        # Cost-effective crazy prompt variations
        personas = [
            "a eccentric professor",
            "a street-smart teenager", 
            "a poetic writer",
            "a stand-up comedian",
            "a futuristic AI",
            "a pirate",
            "a detective",
            "a sports commentator",
            "a news reporter",
            "a motivational speaker",
            "a crackhead",
            "a computer science student",
            "xqc",
            "an egotistical nerd",
            "discord mod"
        ]
        
        styles = [
            "using wild analogies",
            "as hilarious jokes", 
            "with dramatic flair",
            "in simple slang",
            "as creative metaphors",
            "like a game show",
            "as breaking news",
            "with sports commentary",
            "like cooking recipes",
            "as secret codes"
        ]
        
        # Random selections
        persona = random.choice(personas)
        style = random.choice(styles)
        
        # Build optimized prompt with CHARACTER LIMIT
        prompt_text = (
            f"Role: {persona}. Style: {style}.\n\n"
            f"Radically rephrase these definitions. Be wildly creative but keep meaning accurate.\n\n"
            f"STRICT RULES:\n"
            f"1. MAXIMUM 80 CHARACTERS per definition\n"
            f"2. Be extremely concise\n"
            f"3. No unnecessary words\n"
            f"4. Keep core meaning accurate\n\n"
            f"Return ONLY JSON in this format:\n"
            "{\"Term1\": \"New definition1\", \"Term2\": \"New definition2\"}\n\n"
            + ", ".join([f"\"{card['term']}\": \"{card['definition']}\"" for card in flashcards])
            + f"\n\nIMPORTANT: Every definition must be under 80 characters!"
        )
        
        print(f"Using temperature: {temperature:.2f}")
        print(f"Persona: {persona}")
        print(f"Style: {style}")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # This is the most cost-effective model
            messages=[{"role": "user", "content": prompt_text}],
            temperature=temperature,
            max_tokens=800,  # Much more reasonable limit
            response_format={ "type": "json_object" }  # Force JSON output
        )
        
        ai_text = response.choices[0].message.content.strip()
        
        # Parse response - should be clean JSON now
        try:
            reworded_definitions = json.loads(ai_text)
        except json.JSONDecodeError:
            print("JSON parsing failed, using fallback")
            reworded_definitions = {item.get('word', ''): item.get('definition', '') for item in vocabulary}
        
        # ENFORCE CHARACTER LIMIT on the backend too (safety net)
        enforced_definitions = {}
        for term, definition in reworded_definitions.items():
            if len(definition) > 80:
                # Truncate and add ellipsis if too long
                enforced_definitions[term] = definition[:77] + "..."
                print(f"Truncated definition for '{term}': {len(definition)} -> 80 chars")
            else:
                enforced_definitions[term] = definition
        
        # Calculate token usage for monitoring
        input_tokens = len(prompt_text) // 4  # Rough estimate
        output_tokens = len(ai_text) // 4     # Rough estimate
        
        # Store result
        processed_deck_id = store_processed_deck({
            'original': vocabulary,
            'reworded': enforced_definitions,  # Use the enforced definitions
            'sessionId': session_id,
            'originalDeckId': deck_id,
            'processedAt': datetime.datetime.now().isoformat(),
            'temperatureUsed': temperature,
            'persona': persona,
            'style': style,
            'estimatedTokens': input_tokens + output_tokens
        })
        
        print(f"Estimated token usage: {input_tokens + output_tokens}")
        
        return jsonify({
            'success': True,
            'processedItems': len(vocabulary),
            'deckId': processed_deck_id,
            'reworded': enforced_definitions,  # Return the enforced definitions
            'creativeParams': {
                'persona': persona,
                'style': style,
                'temperature': temperature
            },
            'message': 'Vocabulary processed with creative rephrasing!'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def store_processed_deck(data):
    """Store processed deck in database - implement based on your DB"""
    # Generate a unique ID for this processed deck
    processed_deck_id = f"processed_{data['sessionId']}_{int(time.time())}"
    
    # Here you would store in your database
    # Example: db.processed_decks.insert_one({**data, 'id': processed_deck_id})
    
    print(f"Storing processed deck: {processed_deck_id}")
    return processed_deck_id

# Add these endpoints
@app.route('/api/user-decks', methods=['GET'])
def get_user_decks():
    user_id = request.args.get('userId')  # You'll need user authentication
    # Fetch decks from database for this user
    return jsonify([])  # Implement your database logic

@app.route('/api/save-deck', methods=['POST'])
def save_user_deck():
    data = request.json
    # Save deck to database
    return jsonify({'success': True, 'deckId': 'new-deck-id'})

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)