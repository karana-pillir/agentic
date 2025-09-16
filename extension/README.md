# Gemini AI Assistant Browser Extension

This is a browser extension (compatible with Chrome and Edge) that allows users to interact with the Google Gemini AI model directly from their browser.

## Features

*   **Gemini API Integration:** Sends user prompts to the Gemini API and displays responses.
*   **Conversation Memory:** Persists chat history using `chrome.storage.local`.
*   **Secure API Key Handling:** Users can securely store their Gemini API key via an options page (`chrome.storage.sync`).
*   **Markdown Support:** Basic Markdown (e.g., bold text) is rendered in the chat.
*   **New Chat Functionality:** Clears current conversation history and starts a new chat.
*   **Responsive UI:** Basic styling for an intuitive user experience.

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd agentic
    ```

2.  **Get a Gemini API Key:**
    *   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Load the Extension in your Browser:**
    *   Open your browser (Chrome or Edge) and go to `chrome://extensions` (or `edge://extensions`).
    *   Enable **Developer mode**.
    *   Click on **Load unpacked** and select the `agentic/extension` folder.

4.  **Set Your API Key:**
    *   Right-click on the newly added extension icon in your browser toolbar.
    *   Select **Options** (or **Extension options**).
    *   Paste your Gemini API key into the input field and click **Save API Key**.

## Usage

1.  Click the extension icon in your browser toolbar.
2.  Enter your prompt in the text area.
3.  Click "Generate Response" to get a reply from Gemini.
4.  Click "New Chat" to clear the current conversation and start fresh.

## Project Structure

*   `agentic/extension/manifest.json`: Defines the extension's properties and permissions.
*   `agentic/extension/popup.html`: The user interface for the extension popup.
*   `agentic/extension/popup.css`: Styling for the popup.
*   `agentic/extension/popup.js`: Handles UI interactions and communication with the background script.
*   `agentic/extension/background.js`: Manages Gemini API calls, conversation history (persisted in `chrome.storage.local`), and API key retrieval (from `chrome.storage.sync`).
*   `agentic/extension/options.html`: Page for users to input and save their API key.
*   `agentic/extension/options.js`: Handles logic for saving/loading API key from `chrome.storage.sync`.
