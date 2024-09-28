
// async function signupUser(data) {
//     const url = 'http://127.0.0.1:8000/main/signup/'; 
//     const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

//     try {
//         const formData = new FormData();

//         formData.append('first_name', data.firstname);
//         formData.append('last_name', data.lastname);
//         formData.append('email', data.email);
//         formData.append('phone', data.phone);
//         formData.append('password', data.passwd);
//         formData.append('confirm_password', data.confirmpasswd);
//         formData.append('gender', data.gender);
//         if (data.photo) {
//             formData.append('image', data.photo);
//         }

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'X-CSRF-Token': csrfToken,
//             },
//             body: formData, 
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const jsonResponse = await response.json();

//         return jsonResponse;
//     } catch (error) {
//         console.error('Error during sign-up:', error);
//         return null;
//     }
// }

// export default signupUser;


const signupUser = async (values) => {
    try {
        const formData = new FormData();
        formData.append('first_name', values.firstname);
        formData.append('last_name', values.lastname);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('password', values.passwd); // Use 'password' instead of 'passwd'
        formData.append('confirm_password', values.confirmpasswd); // Use 'confirm_password'
        formData.append('gender', values.gender || ''); // Ensure gender is not null
        if (values.photo) {
            formData.append('image', values.photo);  // Use 'image' for the photo
        }

        const response = await fetch('http://127.0.0.1:8000/main/signup/', {
            method: 'POST',
            body: formData
        });

        const data = await response.json(); // Parse the JSON response

        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            console.error('Server error:', data); // Log the server error
            console.log('e:', data.email); // Log the server error
            return data
        }
    } catch (error) {
        console.error('Network error:', error);
        return { success: false, message: 'Network error: ' + error.message };
    }
};

export default signupUser;

