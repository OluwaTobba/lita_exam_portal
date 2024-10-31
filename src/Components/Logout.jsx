import { useContext, useEffect } from 'react';
import { AuthContext } from '../Auth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

function Logout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const saveProgress = async (userId, currentScore, remainingTime, currentQuestion) => {
        try {
            await updateDoc(doc(db, 'quizResults', userId), {
                score: currentScore,
                remainingTime: remainingTime,
                currentQuestion: currentQuestion,
                completed: false, // Change to true when quiz is completed
            });
            console.log("Progress saved successfully.");
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    const handleLogout = async () => {
        if (auth.currentUser) await saveProgress(auth.currentUser.uid);
        logout();
        navigate('/login');
    };

    useEffect(() => {
        handleLogout();
    }, []);

    const handleReturnOne = () => {
        navigate('/register');
    };

    const handleReturnTwo = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Log Out</h2>
                <p className="mb-6 text-lg text-gray-700">You logged out!</p>
                <p className="mb-3 text-lg text-gray-700">Are you done?</p>
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleReturnOne}
                        className="mt-6 px-4 py-2 bg-pink-500 text-white font-bold rounded-md hover:bg-blue-700 transition duration-400"
                    >
                        YES
                    </button>
                    <button
                        onClick={handleReturnTwo}
                        className="mt-6 px-4 py-2 bg-pink-500 text-white font-bold rounded-md hover:bg-blue-700 transition duration-400"
                    >
                        NO
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Logout;