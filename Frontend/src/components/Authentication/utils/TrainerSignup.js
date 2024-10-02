const Trainer_Signup = async (values, url) => {
    try {
        const formData = new FormData();
        formData.append('first_name', values.firstname);
        formData.append('last_name', values.lastname);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('yoe', values.yoe);
        formData.append('password', values.passwd); // Use 'password' instead of 'passwd'
        formData.append('confirm_password', values.confirmpasswd); // Use 'confirm_password'
        formData.append('gender', values.gender || ''); // Ensure gender is not null
        if (values.photo) {
            formData.append('image', values.photo);  // Use 'image' for the photo
        }

        const response = await fetch(url, {
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

export default Trainer_Signup;