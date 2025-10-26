from flask import Flask, request, jsonify
from transformers import pipeline
import requests
import os

# -----------------------------
# Load small agriculture model
# -----------------------------
print("Loading Agriculture QA model...")
qa_model = pipeline(
    "text2text-generation",
    model="mrSoul7766/AgriQBot",  # Small model for farming advice
    max_length=256,
    truncation=True
)
print("Model loaded successfully.")

# -----------------------------
# Flask app setup
# -----------------------------
app = Flask(__name__)

# Weather API key (get from https://openweathermap.org/api)
OPENWEATHER_API_KEY = "7d52870b8eebc2ec07266a58bb076186"

# Agriculture-related keywords
AGRICULTURE_KEYWORDS = [
    "crop", "fertilize", "fertilizer", "irrigation", "pesticide", "weed",
    "harvest", "soil", "plant", "seeds", "farm", "farming", "tractor",
    "vegetable", "fruit", "agriculture", "disease", "pest", "compost",
    "yield", "grain", "wheat", "rice", "tomato", "maize", "millet", "cotton",
    "sorghum", "climate", "monsoon", "nutrient", "manure", "watering",
    "weather", "rain", "temperature", "season"
]

# Weather trigger words
WEATHER_WORDS = ["weather", "rain", "temperature", "season", "climate"]


def get_weather(city):
    """Fetch real-time weather data for a given city."""
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        data = response.json()

        if data.get("cod") != 200:
            return None

        temp = data["main"]["temp"]
        desc = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]
        return f"The current temperature in {city} is {temp}°C with {desc}. Humidity is {humidity}%."
    except Exception as e:
        return None


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "query" not in data:
        return jsonify({"error": "Please provide a query"}), 400

    user_query = data["query"]
    city = data.get("city", "Delhi")  # Default city if not provided

    # Check if query is agriculture related
    if not any(keyword in user_query.lower() for keyword in AGRICULTURE_KEYWORDS):
        return jsonify({
            "answer": "Please ask a question related to farming, crops, soil, weather, or agriculture."
        })

    # If query contains weather-related words, get weather info
    weather_info = None
    if any(word in user_query.lower() for word in WEATHER_WORDS):
        weather_info = get_weather(city)

    try:
        # Combine weather info with user query for better answers
        if weather_info:
            final_query = f"{user_query}. Current weather: {weather_info}. Based on this, give farming advice."
        else:
            final_query = user_query

        # Generate model response
        result = qa_model(final_query)
        answer = result[0]['generated_text']

        return jsonify({
            "answer": answer,
            "weather": weather_info if weather_info else "Weather data not used"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
