import { useContext } from 'react';
import { AuthContext } from './TrainerAuthContext';
import { useFormik } from 'formik';
import '../../assets/styles/Authentication/login.css';
import { loginSchema } from './Schema';
import Logo from './Logo';
import login from './utils/Login';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import handleLoginSuccess from './utils/GoogleLogin';


const onSubmit = async (values, actions) => {
    try {
        const url = 'http://127.0.0.1:8000/main/login/trainer/'
        const response = await login(values.email, values.password, url);

        if (response && response.message === 'Login successful!') {
            // console.log('Login successful:', response.message);
            localStorage.setItem('role', response.trainer.role)
            localStorage.setItem('userId', response.trainer.id)
            actions.resetForm();
            window.location.href = '/home';
        }
        else if (response && response.non_field_errors[0] === 'Invalid email or password.') {
            console.log("Invalid data: ", response.non_field_errors[0])
            const P = document.querySelector('.incorrect-credintials')
            P.setAttribute('id', 'invalid-data')
        }
        else {
            console.log('Login failed');
            console.log(response)
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
    } finally {
        actions.setSubmitting(false);
    }
};



const TrainerLogin = () => {


    const x = () => {
        const P = document.querySelector('#invalid-data');
        if (P) {
            P.removeAttribute('id');
        }
    }

    // Formik

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
                <div className="col-md-12 cardd">
                    <form onSubmit={handleSubmit} className="box">
                        <h1>Trainer Login</h1>
                        <p className="text-muted">Please enter your login and password!</p>
                        <input
                            type="text"
                            id="email"
                            placeholder="E-mail"
                            value={values.email}
                            onChange={(e) => {
                                handleChange(e);
                                x();
                            }}
                            onBlur={handleBlur}
                            className={errors.email && touched.email ? 'input-error' : ""}
                        ></input>
                        {errors.email && touched.email && <p className='error'>{errors.email}</p>}
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={(e) => {
                                handleChange(e);
                                x();
                            }}
                            onBlur={handleBlur}
                            className={errors.password && touched.password ? 'input-error' : ""}
                        ></input>
                        <p className='incorrect-credintials'
                            style={{ display: 'none' }}>Incorrect credintials</p>
                        {errors.password && touched.password && <p className='error'>{errors.password}</p>}
                        <a className="signup text-muted" href='/reset-password'> forget password ?</a>
                        <input type="submit" disabled={isSubmitting} value="Login" href="#"></input>

                        <GoogleOAuthProvider clientId="532738031986-q71s1r33kn8uek3msllhrog28s8bvt8d.apps.googleusercontent.com">
                            <div id='google-btn'>
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={() => console.log("Login failed")}
                                />
                            </div>
                        </GoogleOAuthProvider>
                        
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