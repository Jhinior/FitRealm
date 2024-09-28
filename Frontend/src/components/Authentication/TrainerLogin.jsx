import { useContext } from 'react';
import { AuthContext } from './TrainerAuthContext';
import { useFormik } from 'formik';
import '../../assets/styles/Authentication/login.css';
import { loginSchema } from './Schema';
import Logo from './Logo';
import login from './utils/Login';

const onSubmit = async (values, actions) => {
    
    try {
        const response = login(values.email, values.password);

        if (response) {
            // console.log('Login successful:', response.message);
            actions.resetForm();
            window.location.href = '/home';
        } else {
            console.error('Login failed');
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
    } finally {
        actions.setSubmitting(false);
    }
};

const TrainerLogin = () => {

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit,
    })
    const { setWhoLogin } = useContext(AuthContext);

    return (
        <>
            <Logo />
            <div className="trainer-container">
                <div className="row"></div>
                <div className="col-md-12 card">
                    <form onSubmit={handleSubmit} className="box">
                        <h1>Trainer Login</h1>
                        <p className="text-muted">Please enter your login and password!</p>
                        <input
                            type="text"
                            id="email"
                            placeholder="E-mail"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email && touched.email ? 'input-error' : ""}
                        ></input>
                        {errors.email && touched.email && <p className='error'>{errors.email}</p>}
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password && touched.password ? 'input-error' : ""}
                        ></input>
                        {errors.password && touched.password && <p className='error'>{errors.password}</p>}
                        <a className="signup text-muted" href='/reset-password'> forget password ?</a>
                        <input type="submit" disabled={isSubmitting} value="Login" href="#"></input>
                        <div id='login-google'><i className="fa-brands fa-google"></i></div>
                        <span className='spn'>
                            New Hero?
                            <a className="signup text-muted" onClick={() => setWhoLogin('trainer-signup')}> Signup</a>
                        </span>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TrainerLogin;