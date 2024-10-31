import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


const quizQuestions = [
    // Question 1
    {
        question: "What does 'HTTP' stand for?",
        options: ["HyperText Transmission Protocol", "HyperText Transfer Protocol", "HyperText Transfer Platform", "HyperTransfer Transmission Protocol"],
        answer: "HyperText Transfer Protocol",
    },
    // Question 2
    {
        question: "Which of the following is a non-relational database?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
        answer: "MongoDB",
    },
    // Question 3
    {
        question: "Which programming language is primarily used for web development on the client side?",
        options: ["Python", "JavaScript", "C++", "Java"],
        answer: "JavaScript",
    },
    // Question 4
    {
        question: "What does 'IP' in 'IP address' stand for?",
        options: ["Internet Protocol", "Internet Program", "Integrated Protocol", "Internal Protocol"],
        answer: "Internet Protocol",
    },
    // Question 5
    {
        question: "Which is the most common port for HTTP traffic?",
        options: ["80", "443", "21", "8080"],
        answer: "80",
    }
];

function Exam() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState('');
    const [ShowErrorModal, setShowErrorModal] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(2400);
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [isNamePrompted, setIsNamePrompted] = useState(true);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (ShowErrorModal) {

            const timer = setTimeout(() => {
                setShowErrorModal(false);
            }, 1000);

            return () => clearTimeout(timer);

        }

    }, [ShowErrorModal]);

    useEffect(() => {

        if (showWarningModal) {

            const timer = setTimeout(() => {
                setShowWarningModal(false);
            }, 2000);

            return () => clearTimeout(timer);

        }

    }, [showWarningModal]);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadQuizStatus(currentUser.uid);
            }
        });

        const timerInterval = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerInterval);
                    handleEndQuiz(); // End quiz when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    // useEffect(() => {
    // // Set up timer
    //     const timerInterval = setInterval(() => {
    //         setTimeRemaining(prevTime => {
    //         if (prevTime <= 1) {
    //             clearInterval(timerInterval);
    //             handleEndQuiz();
    //             return 0;
    //         }
    //         updateRemainingTime(user.uid, prevTime - 1);
    //         return prevTime - 1;
    //     });
    // }, 1000);

    // return () => clearInterval(timerInterval);
    // }, [user?.uid]);


    const handleOptionChange = (e) => setSelectedOption(e.target.value);

    const handleNextQuestion = () => {
        if (!selectedOption) {
            setError('Please select an option before proceeding.');
            setShowErrorModal(true);
            return;
        }
        const isCorrect = selectedOption === quizQuestions[currentQuestion].answer;
        if (isCorrect) setScore(score + 1);

        setUserAnswers([...userAnswers, { question: quizQuestions[currentQuestion], selectedOption, isCorrect }]);
        setSelectedOption('');
        setError('');

        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleEndQuiz();
        }
    };

    const handleEndQuiz = async () => {
        setShowResults(true);
        if (user) {
            const userDocRef = doc(db, 'quizResults', user.uid);
            await setDoc(userDocRef, {
                name: user.displayName || name,
                email: user.email,
                score,
                completed: true,
                remainingTime: timeRemaining,
            });
        }
    };

    const loadQuizStatus = async (uid) => {
        const userDocRef = doc(db, 'quizResults', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.completed || data.remainingTime <= 0) {
                navigate('/no-access');
            } else {
                setTimeRemaining(data.remainingTime);
                setScore(data.score);
                setCurrentQuestion(data.lastQuestion || 0);
            }
        }
    };

    const handleSaveName = async () => {
        if (!name.trim()) return alert('Please enter your name.');

        await updateProfile(auth.currentUser, { displayName: name });
        setIsNamePrompted(false);
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleProceed = () => {
        navigate('/logout');
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-w-lg lg:max-w-4xl">

                {isNamePrompted ? (
                    <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-bold mb-4">Please Enter Your Full Name</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Your name"
                        />
                        <button
                            onClick={handleSaveName}
                            className="py-2 px-4 bg-pink-500 text-white font-bold rounded-md hover:bg-pink-700 transition duration-400"
                        >
                            Start Exam
                        </button>
                    </div>
                ) : !showResults ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">Question {currentQuestion + 1}/{quizQuestions.length}</h3>
                            {/* <div className="hidden md:flex font-bold">
                                <Link to="/logout" className="bg-black text-white py-2 px-6 rounded-full hover:bg-black transition duration-300 ease-in-out transform hover:scale-105">LOGOUT</Link>
                            </div> */}
                            <h4 className="text-lg text-gray-600 font-bold">Time Remaining: {formatTime(timeRemaining)}</h4>
                        </div>

                        <div className="mt-4 mb-4 w-full bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-pink-500 h-2 rounded-full"
                                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                            ></div>
                        </div>

                        <h4 className="text-xl font-semibold mb-4">{quizQuestions[currentQuestion].question}</h4>

                        <div className="space-y-4">
                            {quizQuestions[currentQuestion].options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="option"
                                        value={option}
                                        checked={selectedOption === option}
                                        onChange={handleOptionChange}
                                        className="mr-3"
                                    />
                                    <label>{option}</label>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleNextQuestion} className="mt-6 w-full py-2 bg-pink-500 text-white font-bold rounded-md">
                            Next
                        </button>
                    </>
                ) : (
                    <div>
                        <h3 className="text-3xl font-bold mb-4 text-center">Quiz Results</h3>
                        <p className="text-2xl mb-4 text-center">Your score: {score} / {quizQuestions.length}</p>
                        <button onClick={handleProceed} className="mt-4 w-full py-2 bg-pink-500 text-white font-bold rounded-md">
                            End Exam
                        </button>
                    </div>
                )}
            </div>

            {ShowErrorModal && (
                <div className="fixed text-center inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {showWarningModal && (
                <div className="fixed text-center inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Warning</h3>
                        <p>You have either completed the quiz or used up all available time.</p>
                        <button
                        onClick={() => navigate('/')}
                        className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 transition duration-300"
                        >
                        Go Back
                        </button>
                    </div>
                </div>
            )}

        </div>

    );

}

export default Exam;