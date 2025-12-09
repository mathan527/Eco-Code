// Code Analyzer Module
let currentAnalysisResults = null;
let metricsChart = null;

async function analyzeCode() {
    const code = getEditorCode();
    const language = document.getElementById('languageSelect').value;

    if (!code.trim()) {
        showNotification('Please enter some code to analyze', 'warning');
        return;
    }

    if (code.length > CONFIG.MAX_CODE_LENGTH) {
        showNotification('Code exceeds maximum length', 'error');
        return;
    }

    try {
        showLoading('Analyzing code...');
        
        const userId = auth.getUserId();
        const result = await api.analyzeCode(code, language, userId);
        
        if (result.success) {
            currentAnalysisResults = result.analysis;
            displayAnalysisResults(result.analysis, language);
            showNotification('Analysis complete!', 'success');
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showNotification('Analysis failed: ' + error.message, 'error');
    }
}

function displayAnalysisResults(analysis, language) {
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.style.display = 'block';

    // Display Green Score
    const greenScore = analysis.green_score;
    document.getElementById('greenScoreValue').textContent = greenScore;
    
    // Animate score ring
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (greenScore / 100) * circumference;
    const progressRing = document.getElementById('scoreRingProgress');
    progressRing.style.strokeDashoffset = offset;
    
    // Set color based on score
    const color = analysis.color || 'green';
    progressRing.style.stroke = getScoreColor(greenScore);
    
    // Display rating
    const ratingElement = document.getElementById('scoreRating');
    ratingElement.textContent = analysis.rating;
    ratingElement.style.background = getScoreColor(greenScore);
    ratingElement.style.color = 'white';

    // Display metrics
    displayMetrics(analysis.metrics, analysis.scores);

    // Display CO2 estimate
    document.getElementById('co2Value').textContent = `${analysis.co2_estimate_grams}g`;

    // Create chart
    createMetricsChart(analysis.scores);

    // Scroll to results
    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayMetrics(metrics, scores) {
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = '';

    const metricData = [
        { label: 'Lines of Code', value: metrics.lines_of_code, icon: 'code' },
        { label: 'Loops', value: metrics.loops, icon: 'sync' },
        { label: 'Nested Loops', value: metrics.nested_loops, icon: 'layer-group' },
        { label: 'API Calls', value: metrics.api_calls, icon: 'network-wired' },
        { label: 'File I/O', value: metrics.file_io_operations, icon: 'file' },
        { label: 'Recursion', value: metrics.recursion_count, icon: 'recycle' },
        { label: 'DB Queries', value: metrics.db_queries, icon: 'database' },
        { label: 'CPU Score', value: scores.cpu_score.toFixed(2), icon: 'microchip' },
        { label: 'Network Score', value: scores.network_score.toFixed(2), icon: 'wifi' },
        { label: 'Memory Score', value: scores.memory_score.toFixed(2), icon: 'memory' }
    ];

    metricData.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.innerHTML = `
            <div class="metric-label">
                <i class="fas fa-${metric.icon}"></i>
                ${metric.label}
            </div>
            <div class="metric-value">${metric.value}</div>
        `;
        metricsGrid.appendChild(card);
    });
}

function createMetricsChart(scores) {
    const canvas = document.getElementById('metricsChart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (metricsChart) {
        metricsChart.destroy();
    }

    metricsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['CPU Usage', 'Network Usage', 'Memory Usage'],
            datasets: [{
                label: 'Impact Score',
                data: [scores.cpu_score, scores.network_score, scores.memory_score],
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

async function getAIOptimization() {
    if (!currentAnalysisResults) {
        showNotification('Please analyze code first', 'warning');
        return;
    }

    const code = getEditorCode();
    const language = document.getElementById('languageSelect').value;

    try {
        showLoading('Getting AI optimization suggestions...');
        
        const userId = auth.getUserId();
        const result = await api.getAIOptimization(code, language, currentAnalysisResults, userId);
        
        if (result.success) {
            displayOptimization(result.optimization);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showNotification('AI optimization failed: ' + error.message, 'error');
    }
}

function displayOptimization(optimization) {
    const panel = document.getElementById('optimizationPanel');
    const content = document.getElementById('optimizationContent');
    
    panel.style.display = 'block';
    
    let html = '';
    
    if (optimization.ai_analysis) {
        const analysis = optimization.ai_analysis;
        
        // Inefficiencies
        if (analysis.inefficiencies && analysis.inefficiencies.length > 0) {
            html += `
                <div class="optimization-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> Inefficiencies Found</h4>
                    <ul class="optimization-list">
                        ${analysis.inefficiencies.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Suggestions
        if (analysis.suggestions && analysis.suggestions.length > 0) {
            html += `
                <div class="optimization-section">
                    <h4><i class="fas fa-lightbulb"></i> Optimization Suggestions</h4>
                    <ul class="optimization-list">
                        ${analysis.suggestions.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Explanations
        if (analysis.explanations && analysis.explanations.length > 0) {
            html += `
                <div class="optimization-section">
                    <h4><i class="fas fa-info-circle"></i> Explanations</h4>
                    <ul class="optimization-list">
                        ${analysis.explanations.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Optimized Code
        if (analysis.optimized_code) {
            html += `
                <div class="optimization-section">
                    <h4><i class="fas fa-code"></i> Optimized Code</h4>
                    <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;"><code>${escapeHtml(analysis.optimized_code)}</code></pre>
                    <button class="btn btn-secondary" onclick="copyOptimizedCode()">
                        <i class="fas fa-copy"></i> Copy to Clipboard
                    </button>
                </div>
            `;
        }
    } else if (optimization.suggestions) {
        html += `
            <div class="optimization-section">
                <ul class="optimization-list">
                    ${optimization.suggestions.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    content.innerHTML = html;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyOptimizedCode() {
    const codeElement = document.querySelector('#optimizationContent pre code');
    if (codeElement) {
        const code = codeElement.textContent;
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        });
    }
}

function hideResults() {
    document.getElementById('resultsPanel').style.display = 'none';
}

function hideOptimization() {
    document.getElementById('optimizationPanel').style.display = 'none';
}

function downloadReport() {
    if (!currentAnalysisResults) {
        showNotification('No analysis results to download', 'warning');
        return;
    }

    const report = generateReport(currentAnalysisResults);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecocode-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Report downloaded!', 'success');
}

function generateReport(analysis) {
    return `
EcoCode Carbon Footprint Analysis Report
Generated: ${new Date().toLocaleString()}

========================================
GREEN SCORE: ${analysis.green_score}/100
Rating: ${analysis.rating}
========================================

CO2 ESTIMATE: ${analysis.co2_estimate_grams}g

METRICS:
- Lines of Code: ${analysis.metrics.lines_of_code}
- Loops: ${analysis.metrics.loops}
- Nested Loops: ${analysis.metrics.nested_loops}
- API Calls: ${analysis.metrics.api_calls}
- File I/O Operations: ${analysis.metrics.file_io_operations}
- Recursion Count: ${analysis.metrics.recursion_count}
- Database Queries: ${analysis.metrics.db_queries}

SCORES:
- CPU Score: ${analysis.scores.cpu_score.toFixed(2)}
- Network Score: ${analysis.scores.network_score.toFixed(2)}
- Memory Score: ${analysis.scores.memory_score.toFixed(2)}

========================================
Visit EcoCode for more insights!
https://ecocode.app
========================================
    `.trim();
}

function getScoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
