# AI Recommendation Logic (Project 3)

This project implements a fully interactive **Tech Stack & Career Recommender** dashboard built in compliance with the **DecodeLabs Industrial Training Kit (Project 3)** specifications.

## 🚀 How to Run the Project
1. Open the project folder `Project_3_Recommender`.
2. Double-click the `index.html` file to open the dashboard in any web browser.
3. Click the interactive chips in the **Skill Onboarding Survey** panel. You must select at least **3 skills** to activate the similarity engine.
4. Watch the **Top 3 Career Matches** update instantly, and inspect the **TF-IDF Vector Alignments** table to see the weight math.

## 📁 File Structure
- `index.html` — The HTML dashboard container (onboarding selector, top-N matches, math table).
- `css/style.css` — High-quality dark glassmorphism dashboard layout and responsive grid styles.
- `js/data.js` — Job roles dataset and the global technology skill vocabulary array.
- `js/engine.js` — Core recommendation logic implemented from scratch:
  - **Cold Start Bypass**: Restricts recommendations until 3 options are selected.
  - **TF-IDF Vectorizer**: Computes Term Frequency on job profiles and Inverse Document Frequency across all roles:
    - $TF(t, d) = \frac{\text{Count of term in doc}}{\text{Total terms in doc}}$
    - $IDF(t) = \log\left(\frac{N}{DF(t)}\right)$
  - **Cosine Similarity**: Evaluates angular alignment between the user's vector and career vectors:
    - $\cos(\theta) = \frac{\mathbf{U} \cdot \mathbf{V}}{\|\mathbf{U}\| \|\mathbf{V}\|}$
  - **Top-N Filter**: Sorts the list descending and returns the top 3 matches.

## ⚙️ Core Recommendation Concepts Implemented
- **Content-Based Filtering**: Matches user skills directly against target properties of jobs, eliminating user data cold starts.
- **TF-IDF Weighting**: Down-weights high-frequency generic skills (like `Git`) and rewards highly discriminative skills (like `Machine Learning`).
- **Cosine Invariance**: Normalizes the length of vectors, ensuring users are matched based on the direction of their interests rather than the sheer volume of skills they select.
