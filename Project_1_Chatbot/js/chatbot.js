// Project 1: Deterministic Rule-Based Chatbot Logic
// Powered by DecodeLabs Industrial Training Kit (O(1) Dictionaries)

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInputField = document.getElementById('user-input-field');
    const chatHistoryArea = document.getElementById('chat-history-area');

    // Synonym resolver: maps variations of inputs to core intent keys in O(1) time
    const synonymMap = {
        'hello': 'hello',
        'hi': 'hello',
        'greetings': 'hello',
        'hey': 'hello',
        
        'help': 'help',
        'features': 'help',
        'skills': 'help',
        'commands': 'help',
        
        'about': 'about',
        'project': 'about',
        'info': 'about',
        
        'contact': 'contact',
        'decodelabs': 'contact',
        'support': 'contact',
        'email': 'contact',
        
        'joke': 'joke',
        'fun': 'joke',
        'funny': 'joke',
        
        'exit': 'exit',
        'quit': 'exit',
        'clear': 'exit',
        'reset': 'exit'
    };

    // Primary responses dictionary - O(1) Lookup Table
    const responses = {
        'hello': 'Hello! I am a deterministic, rule-based chatbot designed with O(1) dictionary lookups. How can I help you today? 👋',
        
        'help': 'Here are the topics I can discuss:<br>' +
                '• <strong>hello</strong> — Greet the chatbot<br>' +
                '• <strong>about</strong> — Learn about this project specification<br>' +
                '• <strong>contact</strong> — Get DecodeLabs contact info<br>' +
                '• <strong>joke</strong> — Hear a programmer joke<br>' +
                '• <strong>exit</strong> — Reset and clear the conversation history',
                
        'about': 'This project is the <strong>Rule-Based AI Chatbot</strong> (Project 1) from the DecodeLabs Industrial Training Kit.<br>' +
                 'Instead of utilizing slow linear-scan <code>if-elif</code> ladders ($O(n)$ complexity), it uses hash-map lookups ($O(1)$ complexity) with atomic fallbacks for maximum algorithmic efficiency.',
                 
        'contact': 'You can reach DecodeLabs via:<br>' +
                   '• 📬 Email: <strong>decodelabs.tech@gmail.com</strong><br>' +
                   '• 🌐 Website: <a href="https://www.decodelabs.tech" target="_blank" style="color: #3b82f6; text-decoration: none;">www.decodelabs.tech</a><br>' +
                   '• 📞 Phone: +91 89330 06408<br>' +
                   '• 📍 Location: Greater Lucknow, India',
                   
        'joke': 'Why do programmers wear glasses? 😎<br>Because they can\'t C#! 💻',
        
        'exit': 'Resetting engine. Conversation cleared. ⚙️'
    };

    // The fallback response for unrecognized inputs
    const fallbackResponse = 'I do not understand that command. Please type <strong>help</strong> to see what I can do! 🤖';

    // Appends a new message bubble to the history area
    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');

        const messageText = document.createElement('p');
        messageText.innerHTML = text; // Allow HTML styling within responses safely
        messageDiv.appendChild(messageText);

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('msg-time');
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(timeSpan);

        chatHistoryArea.appendChild(messageDiv);
        
        // Auto scroll to latest message
        chatHistoryArea.scrollTop = chatHistoryArea.scrollHeight;
    }

    // Handles processing of the user input
    function processInput(rawInput) {
        // 1. Sanitization: convert to lowercase and strip outer whitespaces
        const sanitizedInput = rawInput.toLowerCase().trim();
        
        if (sanitizedInput === '') return;

        // Display user message in UI
        appendMessage('user', rawInput);

        // Simulate chatbot thinking and response after a small delay
        setTimeout(() => {
            // 2. Intent Resolution: Check synonymMap for mapped key
            const resolvedIntent = synonymMap[sanitizedInput];
            
            // 3. Command Action: If user wants to exit/clear
            if (resolvedIntent === 'exit') {
                chatHistoryArea.innerHTML = '';
                appendMessage('system', 'System Reset. Available commands: <strong>hello</strong>, <strong>about</strong>, <strong>contact</strong>, <strong>joke</strong>, <strong>help</strong>.');
                return;
            }

            // 4. Response Matching: O(1) Dictionary Lookup with Fallback
            const reply = responses[resolvedIntent] || fallbackResponse;
            
            appendMessage('bot', reply);
        }, 300);
    }

    // Event listener for form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInputField.value;
        processInput(text);
        userInputField.value = '';
        userInputField.focus();
    });
});
