import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Callback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');

            if (code) {
                try {
                    const response = await fetch('http://localhost:3000/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }), 
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch access token');
                    }

                    const data = await response.json();
                    setAccessToken(data.access_token); // Store the access token
                    navigate('/dashboard'); // Redirect to dashboard after successful token fetch
                } catch (error: any) {
                    setError(error.message);
                }
            } else {
                setError('No authorization code found in the URL');
            }
        };

        fetchAccessToken();
    }, [location, navigate]);

    return (
        <div>
            <h1>OAuth Callback</h1>
            {error && <p>Error: {error}</p>}
            {accessToken && <p>Access Token: {accessToken}</p>}
        </div>
    );
};

export default Callback;
