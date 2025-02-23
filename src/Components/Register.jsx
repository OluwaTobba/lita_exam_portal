import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Modal from './RegModal';
import { BiShow, BiHide } from "react-icons/bi";

function Register() {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();
        
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/login');
        } catch (error) {
            let message;
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'This email is already registered. Please use a different email or log in.';
                break;
                case 'auth/invalid-email':
                    message = 'Invalid email format.';
                break;
                case 'auth/weak-password':
                    message = 'Password should be at least 6 characters.';
                break;
                case 'auth/network-request-failed':
                    message = 'Connect to a network!';
                    break;
                default:
                message = 'An error occurred. Please try again.';
            }
            setModalMessage(message);
            setModalOpen(true);
        }
        
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">

                <h2 className="text-2xl font-bold mb-6 text-center text-pink-500">Register for your LITA Exam</h2>

                <form onSubmit={handleRegister}>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>

                        <div className="relative">
                            <input
                            type={passwordVisible ? "text" : "password"}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type='button'
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className='absolute inset-y-0 right-0 pr-3 text-pink-700'
                            >
                                {passwordVisible? <BiHide /> : <BiShow />}
                            </button>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="mt-2 w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-700 transition duration-300"
                    >
                        Register
                    </button>

                </form>

                <p className="mt-4 text-center">
                Registered Already? <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
                </p>

            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />

        </div>

    );
}

export default Register;