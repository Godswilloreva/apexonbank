// app-settings.js - Global Theme & App Lock Manager

(function () {
    // 1. APPLY DARK MODE ON PAGE LOAD
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isDarkModeEnabled = localStorage.getItem(`dark_mode_${currentPage}`) === 'true';

    if (isDarkModeEnabled) {
        document.documentElement.classList.add('dark-mode');
        document.body?.classList.add('dark-mode');
    }

    // Apply dark mode immediately if DOM loads after script execution
    document.addEventListener('DOMContentLoaded', () => {
        if (isDarkModeEnabled) {
            document.body.classList.add('dark-mode');
        }
        checkAppPinLock();
    });

    // 2. 6-DIGIT APP PIN SECURITY OVERLAY
    function checkAppPinLock() {
        const savedPin = localStorage.getItem('apexon_app_pin');
        const sessionUnlocked = sessionStorage.getItem('apexon_pin_unlocked');

        // Do not trigger PIN lock on login or settings page
        if (!savedPin || sessionUnlocked === 'true' || currentPage === 'login.html' || currentPage === 'settings.html') {
            return;
        }

        // Render PIN Lock Screen Overlay
        const overlay = document.createElement('div');
        overlay.id = 'pinLockOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: #070a12;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Space Grotesk', sans-serif;
            color: #f8fafc;
            padding: 20px;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; max-width: 320px; width: 100%;">
                <div style="font-size: 40px; color: #b38728; margin-bottom: 10px;">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 6px;">Apexon Security Lock</h2>
                <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">Enter your 6-digit PIN to continue</p>
                
                <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
                    <input type="password" maxlength="1" class="pin-digit" style="width: 40px; height: 48px; text-align: center; font-size: 20px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #b38728; outline: none;">
                    <input type="password" maxlength="1" class="pin-digit" style="width: 40px; height: 48px; text-align: center; font-size: 20px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #b38728; outline: none;">
                    <input type="password" maxlength="1" class="pin-digit" style="width: 40px; height: 48px; text-align: center; font-size: 20px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #b38728; outline: none;">
                    <input type="password" maxlength="1" class="pin-digit" style="width: 40px; height: 48px; text-align: center; font-size: 20px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #b38728; outline: none;">
                    <input type="password" maxlength="1" class="pin-digit" style="width: 40px; height: 48px; text-align: center; font-size: 20px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #b38728; outline: none;">
                    <input type="password" maxlength="1" class="pin-digit" style="width: 40px; height: 48px; text-align: center; font-size: 20px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #b38728; outline: none;">
                </div>
                <p id="pinErrMsg" style="color: #ef4444; font-size: 12px; height: 18px; font-weight: 600;"></p>
            </div>
        `;

        document.body.appendChild(overlay);

        const digits = overlay.querySelectorAll('.pin-digit');
        digits[0].focus();

        digits.forEach((input, idx) => {
            input.addEventListener('input', () => {
                if (input.value.length >= 1 && idx < 5) {
                    digits[idx + 1].focus();
                }

                // Check PIN when all 6 digits are typed
                let enteredPin = '';
                digits.forEach(d => enteredPin += d.value);

                if (enteredPin.length === 6) {
                    if (enteredPin === savedPin) {
                        sessionStorage.setItem('apexon_pin_unlocked', 'true');
                        overlay.remove();
                    } else {
                        document.getElementById('pinErrMsg').innerText = 'Incorrect PIN. Try again.';
                        digits.forEach(d => d.value = '');
                        digits[0].focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && idx > 0) {
                    digits[idx - 1].focus();
                }
            });
        });
    }
})();
