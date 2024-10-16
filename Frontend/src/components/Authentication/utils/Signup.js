
const signupUser = async (values, url) => {
    try {
        console.log(values)
        console.log(url)
        const formData = new FormData();
        formData.append('first_name', values.firstname);
        formData.append('last_name', values.lastname);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('password', values.passwd); 
        formData.append('password_confirm', values.confirmpasswd);
        formData.append('gender', values.gender || '');
        if (values.photo) {
            formData.append('image', values.photo);  
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const data = await response.json(); 
        console.log(data)
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            console.error('Server error:', data); 
            console.log('e:', data.email);
            return data
        }
    } catch (error) {
        console.error('Network error:', error);
        return { success: false, message: 'Network error: ' + error.message };
    }
};

export default signupUser;

