const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://frontend-aaa.onrender.com'  // Замените позже
    : 'http://localhost:8000'
};

export default config;