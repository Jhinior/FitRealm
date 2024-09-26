import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

const phoneRules = /^(010|011|012|015)[0-9]{8}$/; 
// starts with one of these (010, 011, 012, 015), must 8 number after that

export const loginSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required("Required"),
    password: yup.string().required("Required")
})

export const signupSchema = yup.object().shape({
    firstname: yup.string().min(4).max(14).required("Required"),
    lastname: yup.string().min(4).max(14).required("Required"),
    email: yup.string().email('Please enter a valid email').required("Required"),
    phone: yup.string()
        .matches(phoneRules, 'Please enter a valid phone number')
        .required('Phone number is required'),
    passwd: yup.string()
        .min(8)
        .matches(passwordRules, { message: "Please enter a Strong password" })
        .required("Required"),
    confirmpasswd: yup.string()
        .oneOf([yup.ref('passwd'), null], 'Password doesn\'t match')
        .required("Required")
});