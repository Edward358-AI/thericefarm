// Modal System - Replaces browser prompt() and confirm() with styled popovers

// Create modal HTML structure
const modalHTML = `
<div id="gameModal" class="modal-overlay">
  <div class="modal-box">
    <div class="modal-title" id="modalTitle">Title</div>
    <div class="modal-message" id="modalMessage">Message</div>
    <input type="text" class="modal-input" id="modalInput" placeholder="Enter value...">
    <div class="modal-info" id="modalInfo"></div>
    <div class="modal-buttons">
      <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
      <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
    </div>
  </div>
</div>
`;

// Inject modal into document
document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalInput = document.getElementById('modalInput');
const modalInfo = document.getElementById('modalInfo');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');

// Promise-based modal functions
let modalResolve = null;

function showModal() {
    modal.classList.add('active');
    modalInput.focus();
}

function hideModal() {
    modal.classList.remove('active');
    modalInput.value = '';
}

// Input modal (replaces prompt)
function gamePrompt(title, message, placeholder = '', defaultValue = '', infoText = '') {
    return new Promise((resolve) => {
        modalResolve = resolve;
        modalTitle.textContent = title;
        modalMessage.innerHTML = message;
        modalInput.placeholder = placeholder;
        modalInput.value = defaultValue;
        modalInput.style.display = 'block';
        modalInfo.textContent = infoText;
        modalInfo.style.display = infoText ? 'block' : 'none';
        modalConfirm.textContent = 'Confirm';
        showModal();
    });
}

// Confirm modal (replaces confirm)
function gameConfirm(title, message, confirmText = 'Yes', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        modalResolve = resolve;
        modalTitle.textContent = title;
        modalMessage.innerHTML = message;
        modalInput.style.display = 'none';
        modalInfo.style.display = 'none';
        modalConfirm.textContent = confirmText;
        modalCancel.textContent = cancelText;
        showModal();
    });
}

// Alert modal (replaces alert)
function gameAlert(title, message) {
    return new Promise((resolve) => {
        modalResolve = resolve;
        modalTitle.textContent = title;
        modalMessage.innerHTML = message;
        modalInput.style.display = 'none';
        modalInfo.style.display = 'none';
        modalConfirm.textContent = 'OK';
        modalCancel.style.display = 'none';
        showModal();
    }).then(() => {
        modalCancel.style.display = 'inline-block';
    });
}

// Event listeners
modalConfirm.addEventListener('click', () => {
    if (modalResolve) {
        if (modalInput.style.display !== 'none') {
            // Input mode - return the value
            modalResolve(modalInput.value);
        } else {
            // Confirm mode - return true
            modalResolve(true);
        }
    }
    hideModal();
});

modalCancel.addEventListener('click', () => {
    if (modalResolve) {
        if (modalInput.style.display !== 'none') {
            // Input mode - return null (like prompt cancel)
            modalResolve(null);
        } else {
            // Confirm mode - return false
            modalResolve(false);
        }
    }
    hideModal();
});

// Allow Enter to confirm in input mode
modalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        modalConfirm.click();
    } else if (e.key === 'Escape') {
        modalCancel.click();
    }
});

// Close on overlay click (optional)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modalCancel.click();
    }
});
