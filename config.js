// Configuration file for EcoCode
const CONFIG = {
    // API Configuration
    API_BASE_URL: 'http://localhost:8000', // Change this to your deployed backend URL
    
    // Supabase Configuration
    SUPABASE_URL: 'YOUR_SUPABASE_URL',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
    
    // API Endpoints
    ENDPOINTS: {
        ANALYZE_CODE: '/analyze-code',
        ANALYZE_GITHUB: '/analyze-github',
        AI_OPTIMIZE: '/ai-optimize',
        HOSTING_IMPACT: '/hosting-impact',
        HISTORY: '/history'
    },
    
    // App Settings
    MAX_CODE_LENGTH: 50000,
    RATE_LIMIT_DELAY: 1000,
    
    // Monaco Editor Settings
    MONACO_CONFIG: {
        theme: 'vs-dark',
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
