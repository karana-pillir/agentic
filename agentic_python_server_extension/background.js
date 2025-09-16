const SERVER_URL = "http://127.0.0.1:5000/generate_content"; // Your Python server endpoint

// Store conversation history in the background script
let chatHistory = [];

// Load chat history from local storage when the service worker starts
chrome.storage.local.get(['geminiChatHistory'], function (result) {
    if (result.geminiChatHistory) {
        chatHistory = result.geminiChatHistory;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateContent") {
        const prompt = request.prompt;

        // Update chat history with user's new prompt
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        chrome.storage.local.set({ 'geminiChatHistory': chatHistory });

        fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                chat_history: chatHistory.slice(0, -1).map(msg => ({
                    role: msg.role,
                    parts: msg.parts.map(part => ({ text: part.text }))
                })) // Send history excluding the current user prompt (already sent as prompt)
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const geminiResponse = data.response;
                chatHistory.push({ role: "model", parts: [{ text: gemini_response }] });
                chrome.storage.local.set({ 'geminiChatHistory': chatHistory });
                sendResponse({ success: true, response: gemini_response });
            } else {
                sendResponse({ success: false, error: data.error || "Unknown error from Python server." });
            }
        })
        .catch(error => {
            sendResponse({ success: false, error: "Could not connect to Python server: " + error.message });
        });

        return true; // Indicates an asynchronous response
    }
    if (request.action === "clearChat") {
        chatHistory = []; // Clear in-memory history
        chrome.storage.local.remove(['geminiChatHistory'], function () {
            sendResponse({ success: true });
        });
        return true; // Indicates an asynchronous response
    }
    if (request.action === "getChatHistory") {
        chrome.storage.local.get(['geminiChatHistory'], function (result) {
            if (result.geminiChatHistory) {
                sendResponse({ history: result.geminiChatHistory });
            } else {
                sendResponse({ history: [] });
            }
        });
        return true; // Indicates an asynchronous response
    }
});
