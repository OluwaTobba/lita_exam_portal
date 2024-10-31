import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoAccess() {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/register');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                <p className="text-gray-700 mb-6">
                    You have already completed the quiz or used up your available time. Unfortunately, you can no longer retake the exam.
                </p>
                <button
                    onClick={handleReturn}
                    className="mt-6 px-4 py-2 bg-pink-500 text-white font-bold rounded-md hover:bg-blue-700 transition duration-400"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default NoAccess;