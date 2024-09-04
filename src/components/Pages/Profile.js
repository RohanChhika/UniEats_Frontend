import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [orders, setOrders] = useState([]);
    const [credits, setCredits] = useState(120);  // Mock credits

    useEffect(() => {
        const fetchOrders = async () => {
            const token = await getAccessTokenSilently();
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewOrders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ userID: user.sub }) // Pass user ID to fetch orders
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setOrders(data); // Update the state with the fetched orders
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
                    const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ userID: user.sub }) // Pass user ID to fetch orders
                    });

                    if (response.ok) {
                        const userInformation = await response.json();
                        setCredits(userInformation[0].credits)
                        console.log(userInformation[0].credits)
                    } else {
                        console.error('Failed to fetch users');
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };
        fetchUser()
        fetchOrders();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const trackOrder = (orderId) => {
        alert(`Tracking logic for order ID: ${orderId}. Assume tracking details here.`);
    };

    return (
        <div>
            <h1>User Profile</h1>
            {isAuthenticated ? (
                <>
                    <p>Name: {user?.nickname || "Guest"}</p>
                    <p>Email: {user?.email || "guest@example.com"}</p>
                    <div>
                        <h2>Orders</h2>
                        <ul>
                            {orders.map(order => (
                                <li key={order._id}>
                                    <div>
                                        <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <strong>Time:</strong> {order.time}
                                    </div>
                                    <div>
                                        <strong>Total:</strong> ${order.total.toFixed(2)}
                                    </div>
                                    <div>
                                        <strong>Restaurant:</strong> {order.restaurant}
                                    </div>
                                    <div>
                                        <strong>Items:</strong> {order.items.join(', ')}
                                    </div>
                                    <div>
                                        <strong>Status:</strong> {order.status}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                    <h2>Credits: {credits !== undefined ? `$${credits.toFixed(2)}` : 'Loading...'}</h2>
                    </div>
                </>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default Profile;
