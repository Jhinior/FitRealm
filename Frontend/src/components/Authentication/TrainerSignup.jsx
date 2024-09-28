import { useContext } from 'react';
import { AuthContext } from './TrainerAuthContext';
import { useFormik } from 'formik';
import '../../assets/styles/Authentication/register.css';
import { signupSchema } from './Schema';
import Logo from './Logo';

const onSubmit = async (values, actions) => {
    // try {
    //     const response = await signupUser(values);

    //     if (response) {
    //         console.log('Sign-up successful:', response);
    //         actions.resetForm();

    //         window.location.href = '/home';
    //     } else {
    //         console.error('Sign-up failed');
    //     }
    // } catch (error) {
    //     console.error('Error during sign-up:', error);
    // } finally {
    //     actions.setSubmitting(false);
    // }
    console.log(values)
};

const TrainerSignup = () => {

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            passwd: '',
            confirmpasswd: '',
            gender: '',
            photo: ''
        },
        validationSchema: signupSchema,
        onSubmit,
    })
    const { setWhoLogin } = useContext(AuthContext);

    const handleFileChange = (event) => {
        setFieldValue('photo', event.target.files[0]); // Set the file in Formik's values
    };


    return (
        <>
            <Logo />
            <div className="trainer-container">
                <div className="row"></div>
                <div className="col-md-12 card signup-form">
                    <form onSubmit={handleSubmit} className="box">
                        <h1>Trainer Registration</h1>
                        <p className="text-muted"> Please enter your data for registration!</p>
                        <input
                            type="text"
                            id='firstname'
                            placeholder="First Name"
                            value={values.firstname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.firstname && touched.firstname ? 'input-error' : ""}>
                        </input>
                        {errors.firstname && touched.firstname && <p className='error'>{errors.firstname}</p>}
                        <input
                            type="text"
                            id='lastname'
                            placeholder="Last Name"
                            value={values.lastname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.lastname && touched.lastname ? 'input-error' : ""}>
                        </input>
                        {errors.lastname && touched.lastname && <p className='error'>{errors.lastname}</p>}
                        <input
                            type="email"
                            id='email'
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email && touched.email ? 'input-error' : ""}>
                        </input>
                        {errors.email && touched.email && <p className='error'>{errors.email}</p>}
                        <input
                            type="text"
                            id='phone'
                            placeholder='Phone'
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.phone && touched.phone ? 'input-error' : ""}>
                        </input>
                        {errors.phone && touched.phone && <p className='error'>{errors.phone}</p>}
                        <input
                            type="password"
                            id='passwd'
                            placeholder="Password"
                            value={values.passwd}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.passwd && touched.passwd ? 'input-error' : ""}>
                        </input>
                        {errors.passwd && touched.passwd && <p className='error'>{errors.passwd}</p>}
                        <input
                            type="password"
                            id='confirmpasswd'
                            placeholder="Confirm Password"
                            value={values.confirmpasswd}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.confirmpasswd && touched.confirmpasswd ? 'input-error' : ""}>
                        </input>
                        {errors.confirmpasswd && touched.confirmpasswd && <p className='error'>{errors.confirmpasswd}</p>}
                        <select id="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="">
                            <option value="">Choose Your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <label className="custom-file-upload">
                            <input 
                            type="file"
                            id='photo'
                            onChange={handleFileChange} />
                            Your Image
                        </label>

                        <input type="submit" disabled={isSubmitting} value="Sign up" href="#"></input>
                        <div id='login-google'><i className="fa-brands fa-google"></i></div>
                        <span className='spn'>
                            Already a member?
                            <a className="login text-muted" onClick={() => setWhoLogin('trainer-login')}>&nbsp;Login</a>
                        </span>
                    </form>
                </div>
            </div>

        </>
    );
}

export default TrainerSignup;
