document.addEventListener('DOMContentLoaded', function() {
    const backgroundColorInput = document.getElementById('background-color');
    const textColorInput = document.getElementById('text-color');
    const saveSettingsButton = document.getElementById('save-settings');

    // Load saved settings (if any)
    chrome.storage.sync.get(['backgroundColor', 'textColor'], function(result) {
        if (result.backgroundColor) {
            backgroundColorInput.value = result.backgroundColor;
        }
        if (result.textColor) {
            textColorInput.value = result.textColor;
        }
    });

    // Save settings when the button is clicked
    saveSettingsButton.addEventListener('click', function() {
        const backgroundColor = backgroundColorInput.value;
        const textColor = textColorInput.value;
        chrome.storage.sync.set({ backgroundColor, textColor });
    });
});
