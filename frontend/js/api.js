// API Service Module
class APIService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.lastRequestTime = 0;
    }

    async rateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < CONFIG.RATE_LIMIT_DELAY) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_DELAY - timeSinceLastRequest));
        }
        this.lastRequestTime = Date.now();
    }

    async request(endpoint, options = {}) {
        await this.rateLimit();

        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async analyzeCode(code, language, userId = null) {
        return await this.request(CONFIG.ENDPOINTS.ANALYZE_CODE, {
            method: 'POST',
            body: JSON.stringify({
                code,
                language,
                user_id: userId
            })
        });
    }

    async analyzeGitHub(repoUrl, userId = null) {
        return await this.request(CONFIG.ENDPOINTS.ANALYZE_GITHUB, {
            method: 'POST',
            body: JSON.stringify({
                repo_url: repoUrl,
                user_id: userId
            })
        });
    }

    async getAIOptimization(code, language, analysisResults, userId = null) {
        return await this.request(CONFIG.ENDPOINTS.AI_OPTIMIZE, {
            method: 'POST',
            body: JSON.stringify({
                code,
                language,
                analysis_results: analysisResults,
                user_id: userId
            })
        });
    }

    async calculateHostingImpact(provider, region, tier, monthlyRequests) {
        return await this.request(CONFIG.ENDPOINTS.HOSTING_IMPACT, {
            method: 'POST',
            body: JSON.stringify({
                provider,
                region,
                tier,
                monthly_requests: monthlyRequests
            })
        });
    }

    async getHistory(userId) {
        return await this.request(`${CONFIG.ENDPOINTS.HISTORY}/${userId}`);
    }

    async healthCheck() {
        return await this.request('/health');
    }
}

// Create global instance
const api = new APIService();
