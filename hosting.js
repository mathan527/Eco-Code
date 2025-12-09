// Hosting Impact Calculator Module
let hostingChart = null;

async function calculateHostingImpact() {
    const provider = document.getElementById('providerSelect').value;
    const region = document.getElementById('regionSelect').value;
    const tier = document.getElementById('tierSelect').value;
    const monthlyRequests = parseInt(document.getElementById('monthlyRequests').value);

    if (!monthlyRequests || monthlyRequests < 1000) {
        showNotification('Please enter a valid number of monthly requests (minimum 1000)', 'warning');
        return;
    }

    try {
        showLoading('Calculating hosting impact...');
        
        const result = await api.calculateHostingImpact(provider, region, tier, monthlyRequests);
        
        if (result.success) {
            displayHostingResults(result.impact);
            showNotification('Calculation complete!', 'success');
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showNotification('Calculation failed: ' + error.message, 'error');
    }
}

function displayHostingResults(impact) {
    const resultsContainer = document.getElementById('hostingResults');
    resultsContainer.style.display = 'block';

    // Display metrics
    displayHostingMetrics(impact);

    // Display chart
    displayHostingChart(impact);

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayHostingMetrics(impact) {
    const grid = document.getElementById('hostingMetricsGrid');
    
    const metrics = [
        {
            icon: 'server',
            label: 'Provider',
            value: impact.provider.toUpperCase(),
            color: 'var(--primary-color)'
        },
        {
            icon: 'map-marker-alt',
            label: 'Region',
            value: impact.region.replace('-', ' ').toUpperCase(),
            color: 'var(--secondary-color)'
        },
        {
            icon: 'layer-group',
            label: 'Service Tier',
            value: impact.tier.charAt(0).toUpperCase() + impact.tier.slice(1),
            color: 'var(--accent-color)'
        },
        {
            icon: 'chart-line',
            label: 'Monthly Requests',
            value: impact.monthly_requests.toLocaleString(),
            color: 'var(--success-color)'
        },
        {
            icon: 'bolt',
            label: 'Energy Usage',
            value: `${impact.monthly_energy_kwh.toFixed(6)} kWh`,
            color: 'var(--warning-color)'
        },
        {
            icon: 'cloud',
            label: 'Monthly CO₂',
            value: `${impact.monthly_co2_grams.toFixed(2)}g`,
            color: 'var(--danger-color)'
        },
        {
            icon: 'tree',
            label: 'Yearly CO₂',
            value: `${impact.yearly_co2_kg.toFixed(2)} kg`,
            color: '#10b981'
        },
        {
            icon: 'dollar-sign',
            label: 'Est. Monthly Cost',
            value: `$${impact.estimated_monthly_cost_usd.toFixed(2)}`,
            color: '#8b5cf6'
        },
        {
            icon: 'leaf',
            label: 'Carbon Intensity',
            value: `${impact.carbon_intensity_region}g/kWh`,
            color: '#06b6d4'
        },
        {
            icon: 'award',
            label: 'Efficiency Score',
            value: (impact.provider_efficiency_score * 100).toFixed(0) + '%',
            color: '#f59e0b'
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

function displayHostingChart(impact) {
    const canvas = document.getElementById('hostingChart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (hostingChart) {
        hostingChart.destroy();
    }

    // Calculate breakdown for visualization
    const monthlyImpact = impact.monthly_co2_grams;
    const yearlyImpact = impact.yearly_co2_kg * 1000; // Convert to grams
    
    // Simulate breakdown (in a real app, this would come from backend)
    const breakdown = {
        compute: monthlyImpact * 0.5,
        storage: monthlyImpact * 0.2,
        network: monthlyImpact * 0.3
    };

    hostingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Compute', 'Storage', 'Network Transfer'],
            datasets: [{
                label: 'CO₂ Impact (grams/month)',
                data: [breakdown.compute, breakdown.storage, breakdown.network],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Monthly CO₂ Impact Breakdown',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(2)}g CO₂`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'CO₂ Emissions (grams)'
                    }
                }
            }
        }
    });

    // Add comparison section
    const comparisonHtml = `
        <div style="margin-top: 2rem; padding: 1.5rem; background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
            <h3 style="margin-bottom: 1rem;"><i class="fas fa-balance-scale"></i> Environmental Context</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div style="padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md);">
                    <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">Equivalent to</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-color);">
                        ${(impact.yearly_co2_kg / 0.411).toFixed(1)} km
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">driving per year</div>
                </div>
                <div style="padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md);">
                    <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">Trees needed</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--success-color);">
                        ${(impact.yearly_co2_kg / 21.77).toFixed(2)}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">to offset yearly</div>
                </div>
                <div style="padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md);">
                    <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">Smartphone charges</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--secondary-color);">
                        ${(impact.monthly_energy_kwh / 0.012).toFixed(0)}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">per month</div>
                </div>
            </div>
        </div>
    `;

    // Insert comparison after the chart
    const chartContainer = canvas.parentElement;
    let comparisonDiv = chartContainer.nextElementSibling;
    if (!comparisonDiv || !comparisonDiv.classList.contains('hosting-comparison')) {
        comparisonDiv = document.createElement('div');
        comparisonDiv.className = 'hosting-comparison';
        chartContainer.parentElement.insertBefore(comparisonDiv, chartContainer.nextSibling);
    }
    comparisonDiv.innerHTML = comparisonHtml;
}
