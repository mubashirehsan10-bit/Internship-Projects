# Rule-Based AI Chatbot (Project 1)

This project implements a deterministic, rule-based chatbot interface built in compliance with the **DecodeLabs Industrial Training Kit (Project 1)** specifications.

## 🚀 How to Run the Project
1. Open the project folder `Project_1_Chatbot`.
2. Double-click the `index.html` file to open it in any web browser (Chrome, Edge, Firefox, etc.).
3. Type a message in the input bar at the bottom and press enter or click the send button.

## 📁 File Structure
- `index.html` — The core page structure.
- `css/style.css` — High-quality dark glassmorphism layout, color gradients, and micro-animations.
- `js/chatbot.js` — The logic engine mapping inputs to intents and displaying replies.

## ⚙️ Logic Architecture
- **Input Sanitization**: Automatically normalizes all input via `.toLowerCase().trim()` to remove extra spaces and ignore letter casing.
- **$O(1)$ Intent Resolution**: Uses a JavaScript Object (acting as a Hash Map) instead of sequential `if-elif` checks. Lookup is instant regardless of the volume of rules.
- **Synonyms & Mappings**: Supports multiple phrases (e.g., `hi`, `hello`, `hey`, `greetings`) resolved directly to the core intents.
- **Deterministic Guardrail / Fallback**: Provides a clear help prompt when user inputs cannot be resolved.
