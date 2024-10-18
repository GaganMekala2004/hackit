import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = { username, password };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setErrorMessage(''); // Clear error message
                navigate('/dashboard'); // Redirect to the dashboard on successful login
            } else {
                const result = await response.json();
                setErrorMessage(result.error || result.message || 'An unexpected error occurred.');
            }
        } catch (error) {
            setErrorMessage('Error logging in. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
        const REDIRECT_URI = 'http://localhost:5173/callback'; // Redirect after Google OAuth
        const SCOPE = 'https://www.googleapis.com/auth/userinfo.profile';

        if (!CLIENT_ID) {
            console.error('CLIENT_ID is not defined in .env file');
            return;
        }

        const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
                        `client_id=${CLIENT_ID}&` +
                        `redirect_uri=${REDIRECT_URI}&` +
                        `response_type=code&` +
                        `scope=${encodeURIComponent(SCOPE)}`;

        window.location.href = authUrl; // Redirect to Google's OAuth URL
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
                    }
                    .form {
                        display: flex;
                        flex-direction: column;
                        width: 80%;
                        max-width: 300px;
                    }
                    .form input[type="text"], 
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
                    .google-button {
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        margin: 20px 0;
                        border: none;
                        border-radius: 5px;
                        background-color: #4285F4;
                        color: #ffffff;
                        cursor: pointer;
                    }
                    .google-button:hover {
                        background-color: #3B5998;
                    }
                    .google-icon {
                        margin-right: 10px;
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
                    <h1>Welcome Back!</h1>
                    <p>
                        Don't have an account yet? 
                        <a href="/signup"> Create an Account</a>
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
                            placeholder="Password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <button className="google-button" onClick={handleGoogleLogin}>
                        <svg className="google-icon" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M16.51 8H8.98v3h4.6V14h3Z" fill="#FFC107" />
                            <path d="M4.5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7  0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM2 12.5C2 11.67 2.67 11 3.5 11h11c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-1z" fill="#FF3E30" />
                            <path d="M7 6h3v3H7V6z" fill="#34A853" />
                            <path d="M7 9h3v3H7V9z" fill="#FFC107" />
                        </svg>
                        <span>Login with Google</span>
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
