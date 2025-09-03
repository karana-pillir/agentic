const MODEL_NAME = "gemini-1.5-flash";

// Store conversation history in the background script
let chatHistory = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateContent") {
        const prompt = request.prompt;

        chrome.storage.sync.get(['geminiApiKey'], function (result) {
            const API_KEY = result.geminiApiKey;
            if (!API_KEY) {
                sendResponse({ success: false, error: "API Key not set. Please go to extension options to set your API key." });
                return;
            }

            // Add user's new prompt to history
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            // Prepare contents for the API call including history
            const contents = chatHistory;

            fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: contents
                    }),
                }
            )
            .then(response => response.json())
            .then(data => {
                if (data.candidates && data.candidates.length > 0) {
                    const geminiResponse = data.candidates[0].content.parts[0].text;
                    // Add Gemini's response to history
                    chatHistory.push({ role: "model", parts: [{ text: geminiResponse }] });
                    sendResponse({ success: true, response: geminiResponse });
                } else if (data.error) {
                    sendResponse({ success: false, error: data.error.message });
                } else {
                    sendResponse({ success: false, error: "Unknown error from Gemini API." });
                }
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        });
        return true; // Indicates an asynchronous response
    }
    if (request.action === "getChatHistory") {
        sendResponse({ history: chatHistory });
        return true; // Indicates an asynchronous response
    }
});
