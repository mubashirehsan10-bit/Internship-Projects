# Data Classification Using AI (Project 2)

This project implements a fully interactive **K-Nearest Neighbors (KNN)** classification dashboard built in compliance with the **DecodeLabs Industrial Training Kit (Project 2)** specifications.

## 🚀 How to Run the Project
1. Open the project folder `Project_2_Classification`.
2. Double-click the `index.html` file to open the dashboard in any web browser.
3. Adjust the sliders in the **Predictor Inputs** panel to see real-time species predictions and watch the K-Nearest neighbors update.

## 📁 File Structure
- `index.html` — The dashboard layout (inputs, metrics widgets, confusion matrix, neighbors grid).
- `css/style.css` — High-quality dark glassmorphism dashboard layout and responsive grid styles.
- `js/dataset.js` — The official Iris flower dataset containing 150 balanced records (4 features, 3 classes).
- `js/classifier.js` — Core machine learning mathematical formulas written from scratch:
  - **Train-Test Split**: Divides data randomly (80% training, 20% testing).
  - **StandardScaler**: Computes feature means ($\mu$) and standard deviations ($\sigma$) to scale values: $z = \frac{x - \mu}{\sigma}$.
  - **KNN Classifier**: Computes Euclidean distance $d(p, q) = \sqrt{\sum (p_i - q_i)^2}$, gathers the $K=5$ nearest points, and performs a majority vote.
  - **Evaluation Metrics**: Calculates Accuracy, Precision, Recall, and F1-Score, and structures a 3x3 Multiclass Confusion Matrix.

## ⚙️ Core AI Concepts Implemented
- **Standardization**: Prevents features with larger scales (e.g., Sepal Length) from dominating distance metrics.
- **Euclidean Distance**: Computes proximity to match unknown flowers to historical points.
- **Supervised Learning Evaluation**: Evaluates accuracy on independent test sets (not training data) to detect overfitting.
