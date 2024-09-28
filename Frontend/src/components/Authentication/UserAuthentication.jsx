import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './UserAuthContext';
import Login from './Login';
import Signup from './Signup';
import { useContext } from 'react';
import '../../assets/styles/Authentication/auth.css';

function UserAuthentication() {
    const { whoLogin } = useContext(AuthContext);

    return (
        <>
            <div className="background"></div>
            { 
                whoLogin === 'user-login' ? <Login /> 
                : whoLogin === 'user-signup' ? <Signup /> 
                : null
            }
        </>
    );
}

function AuthWrapper() {
    return (
        <AuthProvider>
            <UserAuthentication />
        </AuthProvider>
    );
}

export default AuthWrapper;
