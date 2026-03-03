// ==UserScript==
// @name         Kick.com Video Skip Controller
// @name:tr      Kick.com Video Atlama Kontrolcüsü
// @namespace    https://github.com/TunaStark/
// @version      1.0.0
// @description  Customize skip time on Kick.com VODs (e.g., 5 seconds instead of 30)
// @description:tr Kick.com VOD'larında atlama süresini özelleştirin (örn. 30 saniye yerine 5 saniye)
// @author       TunaG
// @match        *://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Retrieve the saved skip time from Tampermonkey storage, default to 5 if not set
    let skipTime = GM_getValue('kick_skip_time', 5);
 
    // Register a menu command in the Tampermonkey extension popup
    GM_registerMenuCommand(`⚙️ Set Skip Time (Current: ${skipTime}s)`, () => {
        // Prompt the user for a new skip duration
        const userInput = prompt("Enter skip time in seconds:", skipTime);
 
        // Validate and save the input
        if (userInput !== null) {
            const parsedTime = parseInt(userInput, 10);
 
            if (!isNaN(parsedTime) && parsedTime > 0) {
                skipTime = parsedTime;
                GM_setValue('kick_skip_time', skipTime);
                alert(`✅ Skip time successfully updated to ${skipTime} seconds!`);
            } else {
                alert("❌ Invalid input. Please enter a number greater than 0.");
            }
        }
    });
 
    // Listen for keydown events using the capture phase (true) to intercept before Kick's native handlers
    document.addEventListener('keydown', function(e) {
 
        // Only trigger on Right or Left arrow keys
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
 
            // Prevent triggering the skip while the user is typing in chat or search inputs
            if (document.activeElement.matches('input, textarea, [contenteditable="true"]')) {
                return;
            }
 
            // Target the main video player element
            const video = document.querySelector('video');
 
            if (video) {
                // Block Kick's default 30-second skip behavior
                e.preventDefault();
                e.stopImmediatePropagation();
 
                // Apply the custom skip time based on user preference
                if (e.key === 'ArrowRight') {
                    video.currentTime += skipTime;
                } else if (e.key === 'ArrowLeft') {
                    video.currentTime -= skipTime;
                }
            }
        }
    }, true);
})();
