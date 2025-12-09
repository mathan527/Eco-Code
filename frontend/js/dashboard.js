// Dashboard Module
async function loadDashboard() {
    if (!auth.isAuthenticated()) {
        document.getElementById('dashboardContent').style.display = 'block';
        document.getElementById('dashboardData').style.display = 'none';
        return;
    }

    const userId = auth.getUserId();
    
    try {
        showLoading('Loading dashboard...');
        
        const history = await api.getHistory(userId);
        
        if (history.success) {
            displayDashboardData(history);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showNotification('Failed to load dashboard: ' + error.message, 'error');
    }
}

function displayDashboardData(history) {
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('dashboardData').style.display = 'block';

    const codeAnalyses = history.code_analyses || [];
    const githubAnalyses = history.github_analyses || [];

    // Calculate statistics
    const totalAnalyses = codeAnalyses.length;
    
    let totalCO2 = 0;
    let totalGreenScore = 0;
    
    codeAnalyses.forEach(analysis => {
        const results = analysis.analysis_results;
        if (results.co2_estimate_grams) {
            totalCO2 += results.co2_estimate_grams;
        }
        if (results.green_score) {
            totalGreenScore += results.green_score;
        }
    });

    const avgGreenScore = totalAnalyses > 0 ? (totalGreenScore / totalAnalyses).toFixed(1) : 0;

    // Update stats
    document.getElementById('totalAnalyses').textContent = totalAnalyses;
    document.getElementById('avgGreenScore').textContent = avgGreenScore;
    document.getElementById('totalCO2').textContent = `${totalCO2.toFixed(2)}g`;

    // Display history
    displayHistory(codeAnalyses, githubAnalyses);
}

function displayHistory(codeAnalyses, githubAnalyses) {
    const historyList = document.getElementById('historyList');
    
    if (codeAnalyses.length === 0 && githubAnalyses.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No analyses yet. Start by analyzing some code!</p>
            </div>
        `;
        return;
    }

    let historyHtml = '';

    // Combine and sort by date
    const allItems = [
        ...codeAnalyses.map(item => ({ ...item, type: 'code' })),
        ...githubAnalyses.map(item => ({ ...item, type: 'github' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    allItems.forEach(item => {
        if (item.type === 'code') {
            const results = item.analysis_results;
            historyHtml += `
                <div class="history-item">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-code" style="color: var(--primary-color);"></i>
                            <strong>Code Analysis - ${item.language}</strong>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">
                            Green Score: <strong>${results.green_score}</strong> | 
                            CO₂: <strong>${results.co2_estimate_grams}g</strong>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.25rem;">
                            ${new Date(item.created_at).toLocaleString()}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span class="badge" style="background: ${getScoreColor(results.green_score)};">
                            ${results.rating}
                        </span>
                    </div>
                </div>
            `;
        } else if (item.type === 'github') {
            const results = item.analysis_results;
            const repoInfo = results.repo_info;
            historyHtml += `
                <div class="history-item">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fab fa-github" style="color: var(--secondary-color);"></i>
                            <strong>${repoInfo.owner}/${repoInfo.name}</strong>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">
                            CO₂: <strong>${results.impact_estimate.total_co2_monthly_grams.toFixed(4)}g/month</strong>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.25rem;">
                            ${new Date(item.created_at).toLocaleString()}
                        </div>
                    </div>
                </div>
            `;
        }
    });

    historyList.innerHTML = historyHtml;
}

function getScoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
}

// Add badge styles
const badgeStyles = `
<style>
.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
}
</style>
`;

if (!document.getElementById('badge-styles')) {
    const styleTag = document.createElement('div');
    styleTag.id = 'badge-styles';
    styleTag.innerHTML = badgeStyles;
    document.head.appendChild(styleTag);
}
