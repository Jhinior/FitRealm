
async function signupUser(data) {
    const url = ''; 
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

    try {
        const formData = new FormData();

        formData.append('firstname', data.firstname);
        formData.append('lastname', data.lastname);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('passwd', data.passwd);
        formData.append('confirmpasswd', data.confirmpasswd);
        formData.append('gender', data.gender);
        if (data.photo) {
            formData.append('photo', data.photo);
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            body: formData, 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error('Error during sign-up:', error);
        return null;
    }
}

export default signupUser;
