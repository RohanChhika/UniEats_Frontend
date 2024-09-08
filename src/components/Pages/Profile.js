import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../Profile.css';

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [orders, setOrders] = useState([]);
    const [credits, setCredits] = useState(120); // Mock credits

    useEffect(() => {
        const fetchOrders = async () => {
            const token = await getAccessTokenSilently();
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch('https://api-url/viewOrders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ userID: user.sub }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setOrders(data);
                    } else {
                        console.error('Failed to fetch orders');
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            }
        };

        const fetchUser = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch('https://api-url/viewUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ userID: user.sub }),
                    });

                    if (response.ok) {
                        const userInformation = await response.json();
                        setCredits(userInformation[0].credits);
                    } else {
                        console.error('Failed to fetch user');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
        fetchOrders();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const trackOrder = (orderId) => {
        alert(`Tracking logic for order ID: ${orderId}. Assume tracking details here.`);
    };

    // Handle back navigation
    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="profile-container">
            <button className="back-button" onClick={handleBack}>Back</button>
            <h1 className="profile-title">User Profile</h1>
            {isAuthenticated ? (
                <>
                    <div className="profile-card">
                        <p><strong>Name:</strong> {user?.nickname || "Guest"}</p>
                        <p><strong>Email:</strong> {user?.email || "guest@example.com"}</p>
                        <h2>Credits: 
                            <span className="prominent-credits">
                                {credits !== undefined ? `$${credits.toFixed(2)}` : 'Loading...'}
                            </span>
                        </h2>
                    </div>
                    <div className="order-history">
                        <h2>Orders</h2>
                        <ul className="order-list">
                            {orders.map(order => (
                                <li key={order._id} className="order-card">
                                    <div><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
                                    <div><strong>Total:</strong> ${order.total.toFixed(2)}</div>
                                    <div><strong>Restaurant:</strong> {order.restaurant}</div>
                                    <div><strong>Status:</strong> {order.status}</div>
                                    <button onClick={() => trackOrder(order._id)}>Track Order</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default Profile;
