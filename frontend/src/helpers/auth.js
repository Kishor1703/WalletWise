import jwt_decode from 'jwt-decode';

const token = localStorage.getItem('token');
if (token) {
    const decodedToken = jwt_decode(token);
    console.log('Decoded token:', decodedToken);

    // Check for token expiration
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decodedToken.exp < currentTime) {
        console.error('Token has expired.');
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
    }
}
axios.get('https://walletwise-backend-ls6d.onrender.com/api/transactions', {
    headers: { Authorization: `Bearer ${token}` },
});