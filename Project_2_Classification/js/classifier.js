// KNN Data Classifier from Scratch in JavaScript
// Powered by DecodeLabs Industrial Training Kit (Project 2)

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 1. Train-Test Split (80% Train, 20% Test)
function trainTestSplit(dataset, trainRatio = 0.80) {
    const shuffled = shuffleArray(dataset);
    const splitIndex = Math.floor(shuffled.length * trainRatio);
    
    const trainData = shuffled.slice(0, splitIndex);
    const testData = shuffled.slice(splitIndex);
    
    return {
        X_train: trainData.map(d => d.features),
        y_train: trainData.map(d => d.label),
        X_test: testData.map(d => d.features),
        y_test: testData.map(d => d.label)
    };
}

// 2. StandardScaler: Mean = 0, Variance = 1
class StandardScaler {
    constructor() {
        this.means = [];
        this.stds = [];
    }

    fit(X) {
        const numFeatures = X[0].length;
        const numSamples = X.length;
        this.means = new Array(numFeatures).fill(0);
        this.stds = new Array(numFeatures).fill(0);

        // Calculate Means
        for (let j = 0; j < numFeatures; j++) {
            let sum = 0;
            for (let i = 0; i < numSamples; i++) {
                sum += X[i][j];
            }
            this.means[j] = sum / numSamples;
        }

        // Calculate Standard Deviations (with small epsilon to avoid divide-by-zero)
        for (let j = 0; j < numFeatures; j++) {
            let sumSqDiff = 0;
            for (let i = 0; i < numSamples; i++) {
                sumSqDiff += Math.pow(X[i][j] - this.means[j], 2);
            }
            this.stds[j] = Math.sqrt(sumSqDiff / numSamples) || 1e-8;
        }
    }

    transform(X) {
        return X.map(sample => 
            sample.map((val, j) => (val - this.means[j]) / this.stds[j])
        );
    }

    fitTransform(X) {
        this.fit(X);
        return this.transform(X);
    }
}

// 3. K-Nearest Neighbors Algorithm
class KNNClassifier {
    constructor(k = 5) {
        this.k = k;
        this.X_train = [];
        this.y_train = [];
    }

    fit(X, y) {
        this.X_train = X;
        this.y_train = y;
    }

    // Euclidean Distance
    euclideanDistance(pointA, pointB) {
        let sum = 0;
        for (let j = 0; j < pointA.length; j++) {
            sum += Math.pow(pointA[j] - pointB[j], 2);
        }
        return Math.sqrt(sum);
    }

    // Predict single sample and return classification + neighbor list for visualization
    predictSingle(x_query) {
        const distances = [];
        
        // Calculate distances to all training points
        for (let i = 0; i < this.X_train.length; i++) {
            const dist = this.euclideanDistance(x_query, this.X_train[i]);
            distances.push({
                index: i,
                distance: dist,
                label: this.y_train[i]
            });
        }

        // Sort distances ascending
        distances.sort((a, b) => a.distance - b.distance);

        // Get Top K neighbors
        const neighbors = distances.slice(0, this.k);

        // Count votes
        const votes = {};
        let maxVotes = 0;
        let predictedClass = -1;

        neighbors.forEach(neighbor => {
            votes[neighbor.label] = (votes[neighbor.label] || 0) + 1;
            if (votes[neighbor.label] > maxVotes) {
                maxVotes = votes[neighbor.label];
                predictedClass = neighbor.label;
            }
        });

        return {
            class: predictedClass,
            neighbors: neighbors
        };
    }

    predict(X_query) {
        return X_query.map(x => this.predictSingle(x).class);
    }
}

// 4. Metrics Evaluator (Multiclass Confusion Matrix, Precision, Recall, F1)
function evaluatePerformance(y_true, y_pred) {
    const numClasses = 3; // Setosa, Versicolor, Virginica
    
    // Initialize 3x3 Confusion Matrix
    const matrix = Array.from({ length: numClasses }, () => new Array(numClasses).fill(0));
    
    let correct = 0;
    for (let i = 0; i < y_true.length; i++) {
        matrix[y_true[i]][y_pred[i]]++;
        if (y_true[i] === y_pred[i]) {
            correct++;
        }
    }
    
    const accuracy = correct / y_true.length;
    
    // Per-class metrics
    const precision = [];
    const recall = [];
    const f1 = [];
    
    for (let c = 0; c < numClasses; c++) {
        let tp = matrix[c][c];
        
        let fp = 0;
        let fn = 0;
        for (let i = 0; i < numClasses; i++) {
            if (i !== c) {
                fp += matrix[i][c]; // predicted as c, but actually i
                fn += matrix[c][i]; // predicted as i, but actually c
            }
        }
        
        const p = tp + fp > 0 ? tp / (tp + fp) : 0;
        const r = tp + fn > 0 ? tp / (tp + fn) : 0;
        const f = p + r > 0 ? (2 * p * r) / (p + r) : 0;
        
        precision.push(p);
        recall.push(r);
        f1.push(f);
    }
    
    // Macro Average
    const avgPrecision = precision.reduce((a, b) => a + b, 0) / numClasses;
    const avgRecall = recall.reduce((a, b) => a + b, 0) / numClasses;
    const avgF1 = f1.reduce((a, b) => a + b, 0) / numClasses;

    return {
        confusionMatrix: matrix,
        accuracy: accuracy,
        precision: avgPrecision,
        recall: avgRecall,
        f1: avgF1,
        classMetrics: { precision, recall, f1 }
    };
}

// --- DOM Integration & UI Controller ---
document.addEventListener('DOMContentLoaded', () => {
    // Pipeline initialization
    const { X_train, y_train, X_test, y_test } = trainTestSplit(IRIS_DATASET, 0.80);

    const scaler = new StandardScaler();
    const scaledX_train = scaler.fitTransform(X_train);
    const scaledX_test = scaler.transform(X_test);

    const knn = new KNNClassifier(5);
    knn.fit(scaledX_train, y_train);

    // Initial Test Suite Execution
    const testPredictions = knn.predict(scaledX_test);
    const metrics = evaluatePerformance(y_test, testPredictions);

    // Render Metrics Dashboard
    document.getElementById('acc-val').textContent = (metrics.accuracy * 100).toFixed(1) + '%';
    document.getElementById('prec-val').textContent = (metrics.precision * 100).toFixed(1) + '%';
    document.getElementById('rec-val').textContent = (metrics.recall * 100).toFixed(1) + '%';
    document.getElementById('f1-val').textContent = (metrics.f1 * 100).toFixed(1) + '%';

    // Render Multiclass Confusion Matrix
    const classes = ['setosa', 'versicolor', 'virginica'];
    const matrixContainer = document.getElementById('confusion-matrix-grid');
    matrixContainer.innerHTML = ''; // Clear template
    
    // Write out grid elements
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            if (i === j) cell.classList.add('diagonal'); // True Positives diagonal
            cell.textContent = metrics.confusionMatrix[i][j];
            matrixContainer.appendChild(cell);
        }
    }

    // Dynamic Sliders classification trigger
    const sliders = [
        document.getElementById('sepal-len'),
        document.getElementById('sepal-wid'),
        document.getElementById('petal-len'),
        document.getElementById('petal-wid')
    ];

    const values = [
        document.getElementById('sepal-len-val'),
        document.getElementById('sepal-wid-val'),
        document.getElementById('petal-len-val'),
        document.getElementById('petal-wid-val')
    ];

    const classNames = ['Iris Setosa 🌸', 'Iris Versicolor 🌺', 'Iris Virginica 🌷'];
    const classColors = ['#10b981', '#3b82f6', '#8b5cf6'];
    const botResult = document.getElementById('result-label');
    const visualizerGrid = document.getElementById('neighbors-visualization');

    function updateClassification() {
        const queryFeatures = sliders.map(s => parseFloat(s.value));
        
        // Update slider numeric readouts
        sliders.forEach((s, idx) => {
            values[idx].textContent = parseFloat(s.value).toFixed(1) + ' cm';
        });

        // 1. Scale query input features using training parameters
        const scaledQuery = scaler.transform([queryFeatures])[0];

        // 2. Classify via KNN
        const prediction = knn.predictSingle(scaledQuery);

        // 3. Render prediction
        botResult.textContent = classNames[prediction.class];
        botResult.style.color = classColors[prediction.class];
        
        // 4. Render interactive nearest neighbors list
        visualizerGrid.innerHTML = '';
        prediction.neighbors.forEach((n, rank) => {
            const distance = n.distance.toFixed(3);
            const originalFeatures = X_train[n.index];
            const originalLabel = classNames[n.label].split(' ')[1]; // extract name
            
            const card = document.createElement('div');
            card.className = 'neighbor-card';
            card.style.borderColor = classColors[n.label] + '40';
            card.innerHTML = `
                <div class="card-header">
                    <span class="rank">#${rank + 1}</span>
                    <span class="label" style="color: ${classColors[n.label]}">${originalLabel}</span>
                </div>
                <div class="card-body">
                    <p>Distance: <strong>${distance}</strong></p>
                    <p class="features-txt">Feat: [${originalFeatures.map(f=>f.toFixed(1)).join(', ')}]</p>
                </div>
            `;
            visualizerGrid.appendChild(card);
        });
    }

    // Bind event listeners to sliders
    sliders.forEach(slider => {
        slider.addEventListener('input', updateClassification);
    });

    // Run initial input classification
    updateClassification();
});
