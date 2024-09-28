import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './TrainerAuthContext';
import Login from './TrainerLogin';
import Signup from './TrainerSignup';
import { useContext } from 'react';
import '../../assets/styles/Authentication/auth.css';

function TrainerAuthintication() {
    const { whoLogin } = useContext(AuthContext);

    return (
        <>
            <div className="background"></div>
            { 
                whoLogin === 'trainer-login' ? <Login /> 
                : whoLogin === 'trainer-signup' ? <Signup /> 
                : null
            }
        </>
    );
}

function TrainerAuthWrapper() {
    return (
        <AuthProvider>
            <TrainerAuthintication />
        </AuthProvider>
    );
}

export default TrainerAuthWrapper;
