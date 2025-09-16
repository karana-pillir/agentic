from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from flask_cors import CORS
import logging
from werkzeug.exceptions import HTTPException # Import HTTPException

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Configure logging for the Flask app
app.logger.setLevel(logging.DEBUG)

# Global error handler to ensure JSON responses for errors
@app.errorhandler(Exception)
def handle_exception(e):
    # pass through HTTP errors
    if isinstance(e, HTTPException):
        return e
    app.logger.error(f"Unhandled exception: {e}", exc_info=True)
    return jsonify({"success": False, "error": "An unexpected server error occurred."}), 500


@app.route('/generate_content', methods=['POST'])
def generate_content():
    data = request.json
    prompt = data.get('prompt')
    chat_history = data.get('chat_history', [])

    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        app.logger.error("GEMINI_API_KEY environment variable not set in server.")
        return jsonify({'success': False, 'error': 'GEMINI_API_KEY environment variable not set in server.'}), 500

    genai.configure(api_key=api_key) # Configure genai with the checked key for this request context

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        contents = []
        for message in chat_history:
            # Ensure parts[0].text exists for history messages
            text_part = ""
            if 'parts' in message and len(message['parts']) > 0 and 'text' in message['parts'][0]:
                text_part = message['parts'][0]['text']
            contents.append({'role': message.get('role', 'user'), 'parts': [{'text': text_part}]})
        contents.append({'role': 'user', 'parts': [{'text': prompt}]})

        response = model.generate_content(contents=contents)

        app.logger.debug(f"Full Gemini API response: {response}")

        if response.candidates:
            if len(response.candidates) > 0 and \
               response.candidates[0].content and \
               response.candidates[0].content.parts and \
               len(response.candidates[0].content.parts) > 0 and \
               response.candidates[0].content.parts[0].text:
                gemini_response = response.candidates[0].content.parts[0].text
                app.logger.debug(f"Extracted Gemini response: {gemini_response}")
                return jsonify({'success': True, 'response': gemini_response})
            else:
                error_msg = 'Gemini API returned candidates but with unexpected structure or empty text.'
                app.logger.error(f"Gemini response parsing error: {error_msg}. Full candidates: {response.candidates}")
                return jsonify({'success': False, 'error': error_msg}), 500
        else:
            error_msg = 'No candidates found in Gemini API response. It might be blocked due to safety or other reasons.'
            app.logger.warning(f"Gemini response parsing error: {error_msg}. Full response object: {response}")
            return jsonify({'success': False, 'error': error_msg}), 500

    except Exception as e:
        app.logger.error(f"Server error during content generation: {e}", exc_info=True)
        # Attempt to get more specific error from genai if possible
        if hasattr(e, 'message') and 'API key not valid' in str(e.message):
             return jsonify({'success': False, 'error': 'Invalid Gemini API Key provided to server.'}), 500
        return jsonify({'success': False, 'error': f'An unexpected error occurred on the server: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(port=5000)
