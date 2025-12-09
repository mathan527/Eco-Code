// GitHub Repository Analyzer Module
let languagesChart = null;

async function analyzeGithub() {
    const repoUrl = document.getElementById('githubRepoUrl').value.trim();

    if (!repoUrl) {
        showNotification('Please enter a GitHub repository URL', 'warning');
        return;
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-]+\/[\w\-\.]+\/?$/;
    if (!githubUrlPattern.test(repoUrl)) {
        showNotification('Please enter a valid GitHub repository URL', 'error');
        return;
    }

    try {
        showLoading('Analyzing GitHub repository...');
        
        const userId = auth.getUserId();
        const result = await api.analyzeGitHub(repoUrl, userId);
        
        if (result.success) {
            displayGitHubResults(result.analysis);
            showNotification('GitHub analysis complete!', 'success');
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showNotification('GitHub analysis failed: ' + error.message, 'error');
    }
}

function displayGitHubResults(analysis) {
    const resultsContainer = document.getElementById('githubResults');
    resultsContainer.style.display = 'block';

    // Display repository info
    displayRepoInfo(analysis.repo_info);

    // Display metrics
    displayGitHubMetrics(analysis.impact_estimate);

    // Display languages chart
    displayLanguagesChart(analysis.languages);

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayRepoInfo(repoInfo) {
    const card = document.getElementById('repoInfoCard');
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div>
                <h3 style="font-size: 1.75rem; margin-bottom: 0.5rem;">
                    <i class="fab fa-github"></i> ${repoInfo.owner}/${repoInfo.name}
                </h3>
                <p style="color: var(--gray-600); margin-bottom: 1rem;">
                    ${repoInfo.description || 'No description available'}
                </p>
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                    <div>
                        <i class="fas fa-star" style="color: var(--accent-color);"></i>
                        <strong>${repoInfo.stars.toLocaleString()}</strong> stars
                    </div>
                    <div>
                        <i class="fas fa-code-branch" style="color: var(--primary-color);"></i>
                        <strong>${repoInfo.forks.toLocaleString()}</strong> forks
                    </div>
                    <div>
                        <i class="fas fa-file-code" style="color: var(--secondary-color);"></i>
                        <strong>${(repoInfo.size_kb / 1024).toFixed(2)} MB</strong>
                    </div>
                    <div>
                        <i class="fas fa-code" style="color: var(--gray-600);"></i>
                        <strong>${repoInfo.language || 'Multiple'}</strong>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
            <div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">Created</div>
                <div style="font-weight: 600;">${new Date(repoInfo.created_at).toLocaleDateString()}</div>
            </div>
            <div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">Last Updated</div>
                <div style="font-weight: 600;">${new Date(repoInfo.updated_at).toLocaleDateString()}</div>
            </div>
        </div>
    `;
}

function displayGitHubMetrics(impact) {
    const grid = document.getElementById('githubMetricsGrid');
    
    const metrics = [
        {
            icon: 'microchip',
            label: 'Compute Score',
            value: impact.compute_score.toFixed(2),
            color: 'var(--primary-color)'
        },
        {
            icon: 'sync-alt',
            label: 'Est. CI/CD Runs/Month',
            value: impact.estimated_cicd_runs_monthly.toFixed(0),
            color: 'var(--secondary-color)'
        },
        {
            icon: 'database',
            label: 'Storage CO₂',
            value: `${impact.co2_storage_grams.toFixed(4)}g`,
            color: 'var(--accent-color)'
        },
        {
            icon: 'server',
            label: 'Compute CO₂',
            value: `${impact.co2_compute_grams.toFixed(4)}g`,
            color: 'var(--success-color)'
        },
        {
            icon: 'cog',
            label: 'CI/CD CO₂',
            value: `${impact.co2_cicd_grams.toFixed(4)}g`,
            color: 'var(--warning-color)'
        },
        {
            icon: 'cloud',
            label: 'Total Monthly CO₂',
            value: `${impact.total_co2_monthly_grams.toFixed(4)}g`,
            color: 'var(--danger-color)'
        }
    ];

    grid.innerHTML = metrics.map(metric => `
        <div class="metric-card" style="border-left-color: ${metric.color};">
            <div class="metric-label">
                <i class="fas fa-${metric.icon}" style="color: ${metric.color};"></i>
                ${metric.label}
            </div>
            <div class="metric-value" style="color: ${metric.color};">${metric.value}</div>
        </div>
    `).join('');
}

function displayLanguagesChart(languages) {
    const canvas = document.getElementById('languagesChart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (languagesChart) {
        languagesChart.destroy();
    }

    // Prepare data
    const sortedLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 languages

    if (sortedLanguages.length === 0) {
        canvas.parentElement.style.display = 'none';
        return;
    }

    canvas.parentElement.style.display = 'block';

    const labels = sortedLanguages.map(([lang]) => lang);
    const data = sortedLanguages.map(([, bytes]) => bytes);
    const total = data.reduce((sum, val) => sum + val, 0);
    const percentages = data.map(val => ((val / total) * 100).toFixed(1));

    const colors = [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
    ];

    languagesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map((label, i) => `${label} (${percentages[i]}%)`),
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Language Distribution',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const bytes = context.parsed;
                            const kb = (bytes / 1024).toFixed(2);
                            return `${context.label}: ${kb} KB`;
                        }
                    }
                }
            }
        }
    });
}
