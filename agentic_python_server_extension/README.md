# Gemini AI Assistant Browser Extension with Python Server

This is a browser extension (compatible with Chrome and Edge) that interacts with the Google Gemini AI model through a local Python Flask server.

## Features

*   **Python Server Backend:** Gemini API calls are handled by a local Flask server, allowing for more complex backend logic and enhanced API key management.
*   **Gemini API Integration:** The Python server sends user prompts to the Gemini API and returns responses.
*   **Conversation Memory:** Chat history is managed by the browser extension and persisted using `chrome.storage.local`, then sent to the Python server with each request.
*   **Secure API Key Handling:** The Gemini API key is securely managed as an environment variable on the server-side.
*   **Markdown Support:** Basic Markdown (e.g., bold text) in Gemini's responses is rendered in the chat.
*   **New Chat Functionality:** Clears current conversation history and starts a new chat.
*   **Responsive UI:** Basic styling for an intuitive user experience.

## Setup and Installation

### 1. Python Server Setup

1.  **Navigate to the server directory:**
    ```bash
    cd C:\Users\karan\my_python_project\agentic\agentic_python_server_extension
    ```

2.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set Your Gemini API Key:**
    The Flask server requires your Gemini API key as an environment variable.
    *   **For Windows PowerShell:**
        ```bash
        $env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```
    *   **For macOS/Linux (Bash/Zsh):**
        ```bash
        export GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```
    **Replace `"YOUR_API_KEY_HERE"` with your actual Gemini API key.**

4.  **Run the Flask Server:**
    ```bash
    python server.py
    ```
    Keep this terminal window open as the server must be running for the extension to work.

### 2. Browser Extension Setup

1.  **Load the Extension in your Browser:**
    *   Open your browser (Chrome or Edge) and go to `chrome://extensions` (or `edge://extensions`).
    *   Enable **Developer mode**.
    *   Click on **Load unpacked** and select the extension folder: `C:\Users\karan\my_python_project\agentic\agentic_python_server_extension`

## Usage

1.  Ensure your Python server is running.
2.  Click the extension icon in your browser toolbar.
3.  Enter your prompt in the text area.
4.  Click "Generate Response" to get a reply from Gemini via your Python server.
5.  Click "New Chat" to clear the current conversation and start fresh.

## Project Structure

*   `agentic_python_server_extension/manifest.json`: Defines the extension's properties, permissions, and host permissions for the local server.
*   `agentic_python_server_extension/popup.html`: The user interface for the extension popup.
*   `agentic_python_server_extension/popup.css`: Styling for the popup.
*   `agentic_python_server_extension/popup.js`: Handles UI interactions and communication with the background script.
*   `agentic_python_server_extension/background.js`: Manages communication with the local Python server, conversation history (persisted in `chrome.storage.local`), and handles `clearChat` and `getChatHistory` actions.
*   `agentic_python_server_extension/options.html`: (Optional) Page for users to input and save an API key; however, for this setup, the API key is primarily read from the server's environment variable.
*   `agentic_python_server_extension/options.js`: (Optional) Handles logic for saving/loading API key from `chrome.storage.sync`.
*   `agentic_python_server_extension/server.py`: The Python Flask server that acts as a middleware, receiving requests from the extension and making calls to the Gemini API.
*   `agentic_python_server_extension/requirements.txt`: Lists Python dependencies for the Flask server (e.g., `Flask`, `Flask-Cors`, `google-generativeai`).
