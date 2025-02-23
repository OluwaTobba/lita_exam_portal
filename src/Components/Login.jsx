import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Modal from './LoginModal';
import { BiShow, BiHide } from "react-icons/bi";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/exam');
        } catch (error) {
            let message;
            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'No user found with this email.';
                break;
                case 'auth/wrong-password':
                    message = 'Invalid password. Please try again.';
                break;
                case 'auth/invalid-email':
                    message = 'Invalid email format.';
                break;
                case 'auth/invalid-credential':
                    message = 'Invalid Login Credentials.';
                break;
                case 'auth/network-request-failed':
                    message = 'Connect to a network!';
                break;
                default:
                    message = 'Invalid Login Credentials. Please try again.';
            }
            setModalMessage(message);
            setModalOpen(true);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">

                <h2 className="text-2xl font-bold mb-6 text-center text-pink-500">Login to take your LITA Exam</h2>
                
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>

                        <div className="relative">
                            <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                            />

                            <button
                                type='button'
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className='absolute inset-y-0 right-0 pr-3 text-pink-700'
                            >
                                {passwordVisible ? <BiHide /> : <BiShow />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-2 px-4 bg-pink-500 text-white font-bold rounded-md hover:bg-pink-700 transition duration-300"
                    >
                        Login
                    </button>

                </form>

                <p className="mt-4 text-center">
                    Haven't Registered yet? <Link to="/register" className="text-pink-600 hover:underline">Register</Link>
                </p>

            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />

        </div>

    );
}

export default Login;