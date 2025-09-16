from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@app.route('/generate_content', methods=['POST'])
def generate_content():
    data = request.json
    prompt = data.get('prompt')
    chat_history = data.get('chat_history', [])

    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    if not genai.api_key:
        return jsonify({'error': 'GEMINI_API_KEY environment variable not set.'}), 500

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Prepare contents for the API call including history
        contents = []
        for message in chat_history:
            contents.append({'role': message['role'], 'parts': [{'text': message['parts'][0]['text']}]})
        contents.append({'role': 'user', 'parts': [{'text': prompt}]})

        response = model.generate_content(contents=contents)

        if response.candidates and len(response.candidates) > 0:
            gemini_response = response.candidates[0].content.parts[0].text
            return jsonify({'success': True, 'response': gemini_response})
        else:
            return jsonify({'success': False, 'error': 'No candidates found in Gemini API response.'}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
