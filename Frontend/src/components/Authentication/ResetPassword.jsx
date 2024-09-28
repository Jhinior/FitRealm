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
    const onSubmit = () => {
        setPage('confirmcode');
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
    const onSubmit = () => {
        setPage('addnewpassword');
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
    const onSubmit = () => {
        setPage('resetpasswordemail');
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
