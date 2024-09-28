import '../../assets/styles/Authentication/auth.css';
import '../../assets/styles/Authentication/Register.css';
import Logo from './Logo';

const Register = () => {
    return (
        <>  
            <Logo />
            <div className="background"></div>
            <div className="register-container">
                <div className="card">
                    <a href="/login" id="trainee">Trainee</a>
                    <a href="/login-trainer" id="trainer">Trainer</a>
                </div>
            </div>
        </>
    )
}

export default Register;