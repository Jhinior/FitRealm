import axios from 'axios';
    
    // Oauth - Google login
    
    const handleLoginSuccess = (response) => {
        const token = response.credential;

        axios.post('http://localhost:8000/auth/google/login/', {
            access_token: token,
        }, {
            headers: {
                // 'X-CSRFToken': csrfToken, // Include CSRF token in the headers
            }
        })
            .then((res) => {
                const data = res.data; 
                if (data.message === 'Login successful') {
                    // Log message, role, and user_id
                    console.log("Login successful:", data.message, data.role, data.user_id);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('userId', data.user_id);
                }
                window.location.href = '/'
            })
            .catch((err) => {
                console.error("Login error:", err);
            });
    };
    
    // End of Google login

    export default handleLoginSuccess;