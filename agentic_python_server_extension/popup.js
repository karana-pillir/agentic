document.addEventListener('DOMContentLoaded', function () {
    const promptInput = document.getElementById('promptInput');
    const generateButton = document.getElementById('generateButton');
    const newChatButton = document.getElementById('newChatButton');
    const chatHistoryDiv = document.getElementById('chatHistory');
    const responseOutput = document.getElementById('responseOutput');

    // Function to convert basic markdown to HTML
    function convertMarkdownToHtml(markdownText) {
        // Bold: **text** -> <strong>text</strong>
        let html = markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return html;
    }

    // Function to render chat history
    function renderChatHistory(history) {
        chatHistoryDiv.innerHTML = ''; // Clear existing history
        history.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', message.role);
            messageElement.innerHTML = `<strong>${message.role.charAt(0).toUpperCase() + message.role.slice(1)}:</strong> ${convertMarkdownToHtml(message.parts[0].text)}`;
            chatHistoryDiv.appendChild(messageElement);
        });
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight; // Scroll to bottom
    }

    // Request initial chat history from background script and render it
    function loadAndRenderHistory() {
        chrome.runtime.sendMessage({ action: "getChatHistory" }, function (response) {
            if (response && response.history) {
                renderChatHistory(response.history);
            }
        });
    }

    // Load history when popup opens
    loadAndRenderHistory();

    generateButton.addEventListener('click', function () {
        const prompt = promptInput.value;
        if (prompt) {
            responseOutput.textContent = 'Generating...';
            promptInput.value = ''; // Clear input field

            chrome.runtime.sendMessage({ action: "generateContent", prompt: prompt }, function (response) {
                responseOutput.textContent = ''; // Clear generating message
                if (response.success) {
                    loadAndRenderHistory(); // Re-render history after new response
                } else {
                    responseOutput.textContent = 'Error: ' + response.error;
                }
            });
        } else {
            responseOutput.textContent = 'Please enter a prompt.';
        }
    });

    newChatButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: "clearChat" }, function (response) {
            if (response.success) {
                chatHistoryDiv.innerHTML = ''; // Clear UI
                responseOutput.textContent = 'New chat started.';
                setTimeout(() => { responseOutput.textContent = ''; }, 2000);
            } else {
                responseOutput.textContent = 'Error clearing chat: ' + response.error;
            }
        });
    });
});
