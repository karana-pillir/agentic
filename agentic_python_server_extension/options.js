document.addEventListener('DOMContentLoaded', function () {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Load saved API key
    chrome.storage.sync.get(['geminiApiKey'], function (result) {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
            statusDiv.textContent = 'API Key loaded.';
        }
    });

    // Save API key
    saveButton.addEventListener('click', function () {
        const apiKey = apiKeyInput.value;
        chrome.storage.sync.set({ 'geminiApiKey': apiKey }, function () {
            statusDiv.textContent = 'API Key saved!';
            setTimeout(() => { statusDiv.textContent = ''; }, 2000);
        });
    });
});
