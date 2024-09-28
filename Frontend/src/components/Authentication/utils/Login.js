const login = async function login(username, password) {
    const url = 'http://127.0.0.1:8000/main/login/';
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const data = {
        email: username,
        password: password,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(data),
        });

        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        const jsonResponse = await response.json();

        // window.location.href = '/home';

        return jsonResponse;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export default login;

// const login = async (username, password) => {
//     const url = 'http://127.0.0.1:8000/main/login/';
//     const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

//     const data = {
//         email: username,
//         password: password,
//     };

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRF-Token': csrfToken,
//             },
//             body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const jsonResponse = await response.json();
//         console.log('Full Response:', jsonResponse);  // Log entire response for debugging

//         return jsonResponse;
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// };

// export default login;
