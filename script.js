document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('form-message');
    const feedbackList = document.getElementById('feedback-list');

    // Load existing feedback from local storage immediately on load
    loadFeedback();

    feedbackForm.addEventListener('submit', (e) => {
        // Prevent default form submission causing page reload
        e.preventDefault();
        
        // Reset previously displayed messages
        formMessage.className = 'hidden';
        formMessage.textContent = '';

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // -------------------------
        // Basic Form Validation
        // -------------------------
        if (!name) {
            showMessage('Name cannot be empty.', 'error');
            nameInput.focus();
            return;
        }

        if (!email || !validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            emailInput.focus();
            return;
        }

        if (!message) {
            showMessage('Feedback message cannot be empty.', 'error');
            messageInput.focus();
            return;
        }

        // -------------------------
        // LocalStorage Data Saving
        // -------------------------
        const newFeedback = {
            id: Date.now(),
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute:'2-digit'
            })
        };

        saveFeedback(newFeedback);
        
        // Clear the form fields upon successful submission
        feedbackForm.reset();

        // Show successful DOM manipulation message
        showMessage('Feedback submitted successfully!', 'success');
        
        // Immediately display on the web page the newly submitted item
        displayFeedback(newFeedback);
    });

    /**
     * Helper to validate email utilizing a standard regex
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Form message helper
     */
    function showMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = `msg-${type}`;
    }

    /**
     * Retrieve and insert into localStorage
     */
    function saveFeedback(feedback) {
        let existingFeedback = JSON.parse(localStorage.getItem('portfolioFeedback') || '[]');
        existingFeedback.push(feedback);
        localStorage.setItem('portfolioFeedback', JSON.stringify(existingFeedback));
    }

    /**
     * Gather historical localStorage and render it on load
     */
    function loadFeedback() {
        let existingFeedback = JSON.parse(localStorage.getItem('portfolioFeedback') || '[]');
        if (existingFeedback.length > 0) {
            feedbackList.innerHTML = ''; // Start clean without the generic notification
            existingFeedback.forEach(feedback => {
                displayFeedback(feedback, false); // Apend existing to the end
            });
        }
    }

    /**
     * Creates and attaches a DOM fragment reflecting a single feedback piece
     */
    function displayFeedback(feedback, isNew = true) {
        const noFeedbackMsg = feedbackList.querySelector('.no-feedback');
        if (noFeedbackMsg) {
            noFeedbackMsg.remove();
        }

        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-item';
        
        feedbackElement.innerHTML = `
            <div class="feedback-name">${escapeHTML(feedback.name)}</div>
            <div class="feedback-email"><a href="mailto:${escapeHTML(feedback.email)}" style="color: inherit; text-decoration: none;">${escapeHTML(feedback.email)}</a> &bull; ${feedback.date}</div>
            <div class="feedback-content">${escapeHTML(feedback.message)}</div>
        `;

        if (isNew) {
            feedbackList.prepend(feedbackElement); // Top of the list
        } else {
            feedbackList.appendChild(feedbackElement); // Bottom of the list
        }
    }

    /**
     * Fundamental XSS avoidance helper primarily for display logic robustness
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
