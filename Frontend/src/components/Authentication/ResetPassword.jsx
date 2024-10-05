import '../../assets/styles/Authentication/auth.css';
import '../../assets/styles/Authentication/resetpassword.css';
import { useFormik } from 'formik';
import { resetpasswordSchema, resetcodeSchema, NewPassword } from './Schema';
import { useState } from 'react';
import Logo from './Logo';


function ResetPassword() {
    // Corrected useState hook declaration
    const [whichPage, setPage] = useState('resetpasswordemail');

    return (
        <>
            {
                whichPage === 'resetpasswordemail' ? <ResetPasswordEmail setPage={setPage} /> :
                    whichPage === 'confirmcode' ? <ConfirmCode setPage={setPage} /> :
                        whichPage === 'addnewpassword' ? <AddNewPassword setPage={setPage} /> :
                            null
            }
        </>
    );
}

function ResetPasswordEmail({ setPage }) {
    const onSubmit = async (values, actions) => {
        const url = 'http://127.0.0.1:8000/main/reset-password/'
        const data = {
            email: values.email
        }
        localStorage.setItem('email', data.email)
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const jsonResponse = await response.json()
            setPage('confirmcode');

        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    };

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: resetpasswordSchema,
        onSubmit,
    });

    return (
        <>
            <Logo />
            <div className="background"></div>
            <div className='reset-card'>
                <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    <p>A code will be sent to your email</p>
                    <div className='input-group'>
                        <label>Enter your email:</label>
                        <input
                            type="email"
                            id="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {errors.email && touched.email && <span className='reset-error'>{errors.email}</span>}
                    </div>
                    <input type="submit" disabled={isSubmitting} id='submit' value="Send Code" />
                </form>
            </div>
        </>
    );
}

function ConfirmCode({ setPage }) {
    const onSubmit = async (values, actions) => {
        const url = 'http://127.0.0.1:8000/main/pass-code/';
        const data = {
            code: values.code,
            email: localStorage.getItem('email') // Retain email from localStorage
        };
    
        console.log("code:", data.code);
        console.log("email:", data.email);
        
        // localStorage.removeItem('email'); // Only remove the specific item
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            // Check if response is okay
            if (!response.ok) {
                const errorText = await response.text(); // Log error response for debugging
                console.error('Error response:', errorText);
                const redir = document.querySelector('.input-group');
                if (redir) {
                    redir.innerHTML = '<h6 style="color: red; text-align: center">Server error occurred. Please try again later.</h6>';
                }
                return; // Exit early if response is not ok
            }
    
            const jsonResponse = await response.json();
    
            if (jsonResponse.message == "ok") {
                setPage('addnewpassword');
            } else {
                const redir = document.querySelector('.input-group');
                if (redir) {
                    redir.innerHTML = '<h6 style="color: red; text-align: center">Wrong code..redirect to home page</h6>';
                    setTimeout(() => {
                        localStorage.setItem('user','fady')
                        window.location.href = '/'; 
                    }, 3000);
                } else {
                    console.error("Input group not found!");
                }
            }
    
        } catch (error) {
            console.error('Error: ', error);
            const redir = document.querySelector('.input-group');
            if (redir) {
                redir.innerHTML = '<h6 style="color: red; text-align: center">An unexpected error occurred. Please try again.</h6>';
            }
        }
    };
    


    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            code: ''
        },
        validationSchema: resetcodeSchema,
        onSubmit,
    });

    return (
        <>
            <Logo />
            <div className="background"></div>
            <div className='reset-card'>
                <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    <p>Enter the code</p>
                    <div className='input-group'>
                        <input
                            type="text"
                            id="code"
                            value={values.code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {errors.code && touched.code && <span className='reset-error'>{errors.code}</span>}
                    </div>
                    <input type="submit" disabled={isSubmitting} id='submit' value="Reset Password" />
                </form>
            </div>
        </>
    );
}

function AddNewPassword({ setPage }) {

    const onSubmit = async (values, actions) => {
        const url = 'http://127.0.0.1:8000/main/update-password/'
        const data = {
            email: localStorage.getItem('email'),
            password : values.password
        }

        // localStorage.removeItem('email')
        console.log(data)

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const jsonResponse = await response.json()

            if (jsonResponse.status == 'ok'){
                window.location.href = '/'
            }

        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    };

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            password: '',
            confirmpassword: ''
        },
        validationSchema: NewPassword,
        onSubmit,
    });

    return (
        <>
            <Logo />
            <div className="background"></div>
            <div className='reset-card'>
                <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    <p>Enter your new password</p>
                    <div className='input-group'>
                        <input
                            type="password"
                            id='password'
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password && touched.password ? 'input-error' : ""}
                        />
                        {errors.password && touched.password && <p className='error'>{errors.password}</p>}
                        <input
                            type="password"
                            id='confirmpassword'
                            placeholder="Confirm Password"
                            value={values.confirmpassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.confirmpassword && touched.confirmpassword ? 'input-error' : ""}
                        />
                        {errors.confirmpassword && touched.confirmpassword && <p className='error'>{errors.confirmpassword}</p>}
                    </div>
                    <input type="submit" disabled={isSubmitting} id='submit' value="Reset Password" />
                </form>
            </div>
        </>
    );
}

export default ResetPassword;