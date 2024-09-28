const login = () => async function login(username, password) {
    const url = '';
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const data = {
        username: username,
        password: password,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        window.location.href = '/home';

        return jsonResponse;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export default login;