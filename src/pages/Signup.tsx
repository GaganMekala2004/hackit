import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const SignUp: React.FC = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [username, setUsername] = useState(''); // State for username input
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission

        const data = { username, email, password }; // Prepare data for submission

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setErrorMessage(''); // Clear error message
                const result = await response.json(); // Parse the JSON response
                console.log('Signup successful, redirecting to dashboard with ID:', result.id); // Log the user ID for debugging
                navigate('/dashboard'); // Redirect to the dashboard
            } else {
                const result = await response.json();
                setErrorMessage(result.error || result.message || 'An unexpected error occurred.'); // Show error message from server
                console.error(result.error); // Log the error for debugging
            }

        } catch (error) {
            setErrorMessage('Error signing up. Please try again.'); // Show generic error message
        }
    };

    return (
        <div>
            <style>
                {`
                    html, body {
                        margin: 0;
                        height: 100%;
                        font-family: 'Arial', sans-serif;
                    }
                    .container {
                        display: flex;
                        width: 100%;
                        height: 100vh;
                    }
                    .left {
                        flex: 1;
                        background-color: #ffffff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .right {
                        flex: 1;
                        background-color: #4A6EDB;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: #ffffff;
                    }
                    .right h1 {
                        font-size: 2em;
                        margin: 0;
                    }
                    .right p {
                        margin: 10px 0;
                    }
                    .right a {
                        color: #ffffff;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    .form {
                        display: flex;
                        flex-direction: column;
                        width: 80%;
                        max-width: 300px;
                    }
                    .form input[type="text"], 
                    .form input[type="email"], 
                    .form input[type="password"] {
                        padding: 10px;
                        margin: 10px 0;
                        border: none;
                        border-radius: 5px;
                        font-size: 1em;
                        color: #333;
                    }
                    .form button {
                        padding: 10px;
                        margin: 20px 0;
                        border: none;
                        border-radius: 5px;
                        background-color: #6C8AE4;
                        color: #ffffff;
                        cursor: pointer;
                    }
                    .form button:hover {
                        background-color: #5A7AD1;
                    }
                    .error-message {
                        color: #ff0000;
                    }
                    .dialog {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: white;
                        color: black;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                        display: none; /* Initially hidden */
                    }
                `}
            </style>
            <div className="container">
                <div className="left">
                    <img
                        alt="Illustration of a doctor and a patient interacting through mobile screens"
                        height="400"
                        src="https://storage.googleapis.com/a1aa/image/s7fZWseEPFh920LycYnUK9efyBhwY4N8UFeLXTfdtF4a6g45E.jpg"
                        width="400"
                    />
                </div>
                <div className="right">
                    <h1>Create an Account</h1>
                    <p>
                        Already have an account? 
                        <a onClick={() => navigate('/login')}> Login</a>
                    </p>
                    <form className="form" onSubmit={handleSubmit}>
                        <input 
                            placeholder="Username" 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                        <input 
                            placeholder="Email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            placeholder="Password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit">Create Account</button>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
