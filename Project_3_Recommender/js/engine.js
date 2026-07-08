// Content-Based Filtering Recommendation Pipeline from Scratch
// Powered by DecodeLabs Industrial Training Kit (Project 3)

document.addEventListener('DOMContentLoaded', () => {
    const chipContainer = document.getElementById('skill-chips-container');
    const warningNotice = document.getElementById('warning-msg');
    const resultsContainer = document.getElementById('recommendations-list');
    const matrixBody = document.getElementById('matrix-table-body');
    
    // User selected skills list
    let selectedSkills = new Set();

    // 1. Build Global IDF Mappings
    // N = Total number of job profiles
    const N = JOB_PROFILES.length;
    const documentFrequencies = {};

    // Count how many documents contain each skill
    SKILLS_VOCABULARY.forEach(skill => {
        let count = 0;
        JOB_PROFILES.forEach(profile => {
            if (profile.skills.includes(skill)) {
                count++;
            }
        });
        documentFrequencies[skill] = count;
    });

    // Compute IDF values: IDF = log(N / DF)
    // We add 0.5 to avoid absolute zeroes when DF equals N, maintaining minor weights
    const idfValues = {};
    SKILLS_VOCABULARY.forEach(skill => {
        const df = documentFrequencies[skill] || 1;
        idfValues[skill] = Math.log(N / df) + 0.1;
    });

    // 2. Pre-compute Job Profiles TF-IDF Vectors
    const profileVectors = JOB_PROFILES.map(profile => {
        const vector = {};
        const totalTerms = profile.skills.length;
        
        SKILLS_VOCABULARY.forEach(skill => {
            // Count of term in doc is either 1 or 0 since skills are unique lists
            const count = profile.skills.includes(skill) ? 1 : 0;
            const tf = count / totalTerms; // TF = Count / Total terms
            const idf = idfValues[skill];
            
            vector[skill] = tf * idf; // TF-IDF Weight
        });

        // Compute magnitude of profile vector
        let sumSq = 0;
        SKILLS_VOCABULARY.forEach(skill => {
            sumSq += Math.pow(vector[skill], 2);
        });
        const magnitude = Math.sqrt(sumSq);

        return {
            role: profile.role,
            description: profile.description,
            skills: profile.skills,
            vector: vector,
            magnitude: magnitude
        };
    });

    // 3. Render Skill Chip Selectors in UI
    SKILLS_VOCABULARY.sort().forEach(skill => {
        const chip = document.createElement('button');
        chip.className = 'skill-chip';
        chip.textContent = skill;
        
        chip.addEventListener('click', () => {
            if (selectedSkills.has(skill)) {
                selectedSkills.delete(skill);
                chip.classList.remove('selected');
            } else {
                selectedSkills.add(skill);
                chip.classList.add('selected');
            }
            evaluateRecommendations();
        });

        chipContainer.appendChild(chip);
    });

    // 4. Recommendation Engine Evaluation
    function evaluateRecommendations() {
        const selectedCount = selectedSkills.size;

        // Bypassing user cold start: Require minimum 3 selected skills
        if (selectedCount < 3) {
            warningNotice.style.display = 'block';
            resultsContainer.innerHTML = '<div class="empty-state">Awaiting minimum inputs...</div>';
            matrixBody.innerHTML = '<tr><td colspan="4" class="empty-state">Select 3+ skills above to populate calculations.</td></tr>';
            return;
        }

        warningNotice.style.display = 'none';

        // A. Build User Profile TF-IDF Vector
        const userVector = {};
        // User TF is 1 / total user selections
        SKILLS_VOCABULARY.forEach(skill => {
            const count = selectedSkills.has(skill) ? 1 : 0;
            const tf = count / selectedCount;
            const idf = idfValues[skill];
            userVector[skill] = tf * idf;
        });

        // Compute magnitude of user vector
        let userSumSq = 0;
        SKILLS_VOCABULARY.forEach(skill => {
            userSumSq += Math.pow(userVector[skill], 2);
        });
        const userMagnitude = Math.sqrt(userSumSq);

        // B. Calculate Cosine Similarity for each Job Profile
        // Cosine Similarity = (User * Profile) / (|User| * |Profile|)
        const scoredRecommendations = profileVectors.map(profile => {
            let dotProduct = 0;
            SKILLS_VOCABULARY.forEach(skill => {
                dotProduct += userVector[skill] * profile.vector[skill];
            });

            let similarity = 0;
            if (userMagnitude > 0 && profile.magnitude > 0) {
                similarity = dotProduct / (userMagnitude * profile.magnitude);
            }

            return {
                role: profile.role,
                description: profile.description,
                skills: profile.skills,
                similarity: similarity
            };
        });

        // C. Sort in descending order
        scoredRecommendations.sort((a, b) => b.similarity - a.similarity);

        // D. Filter Top-3 Recommendations
        const top3 = scoredRecommendations.slice(0, 3);

        // E. Render Recommendation Cards in UI
        resultsContainer.innerHTML = '';
        top3.forEach((rec, rank) => {
            const matchPercent = (rec.similarity * 100).toFixed(0);
            
            // Find overlapping skills
            const matchingSkills = rec.skills.filter(s => selectedSkills.has(s));
            const missingSkills = rec.skills.filter(s => !selectedSkills.has(s));

            const card = document.createElement('div');
            card.className = 'rec-card';
            card.innerHTML = `
                <div class="rec-header">
                    <span class="rec-rank">#${rank + 1}</span>
                    <h3>${rec.role}</h3>
                    <span class="rec-match" style="background: rgba(${59 + (1 - rec.similarity)*100}, 130, 246, 0.15)">${matchPercent}% Match</span>
                </div>
                <p class="rec-description">${rec.description}</p>
                <div class="tags-container">
                    <span class="tag-title">Matched:</span>
                    ${matchingSkills.map(s => `<span class="skill-tag match">${s}</span>`).join('')}
                </div>
                ${missingSkills.length > 0 ? `
                <div class="tags-container" style="margin-top: 8px;">
                    <span class="tag-title">Missing:</span>
                    ${missingSkills.map(s => `<span class="skill-tag missing">${s}</span>`).join('')}
                </div>` : ''}
            `;
            resultsContainer.appendChild(card);
        });

        // F. Populate Math Explanations Table
        matrixBody.innerHTML = '';
        const topProfile = profileVectors.find(p => p.role === top3[0].role);

        // Display how the top recommended profile values compare
        SKILLS_VOCABULARY.forEach(skill => {
            const isUserHas = selectedSkills.has(skill);
            const isRoleHas = topProfile.skills.includes(skill);

            // Skip rendering rows where neither user nor role has the skill to keep it readable
            if (!isUserHas && !isRoleHas) return;

            const row = document.createElement('tr');
            if (isUserHas && isRoleHas) row.className = 'row-match';

            const userWeight = userVector[skill].toFixed(3);
            const roleWeight = topProfile.vector[skill].toFixed(3);
            const scoreProduct = (userVector[skill] * topProfile.vector[skill]).toFixed(4);

            row.innerHTML = `
                <td><strong>${skill}</strong></td>
                <td>${userWeight} ${isUserHas ? '✅' : '❌'}</td>
                <td>${roleWeight} ${isRoleHas ? '✅' : '❌'}</td>
                <td>${scoreProduct}</td>
            `;
            matrixBody.appendChild(row);
        });
    }

    // Run initial empty assessment to show empty state
    evaluateRecommendations();
});
