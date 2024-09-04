import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    const [orders, setOrders] = useState([
        { id: 1, description: "Grilled Salmon Order", status: "Pending", isCompleted: false },
        { id: 2, description: "Vegan Burger Order", status: "Shipped", isCompleted: false },
        { id: 3, description: "Caesar Salad Order", status: "Delivered", isCompleted: true }
    ]);
    const [credits, setCredits] = useState(120);  // Mock credits

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
                        <h2>Ongoing Orders</h2>
                        <ul>
                            {orders.filter(order => !order.isCompleted).map(order => (
                                <li key={order.id}>
                                    {order.description} - Status: {order.status}
                                    <button onClick={() => trackOrder(order.id)}>Track Order</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Past Orders</h2>
                        <ul>
                            {orders.filter(order => order.isCompleted).map(order => (
                                <li key={order.id}>
                                    {order.description} - Delivered on: {new Date().toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Credits: ${credits}</h2>
                    </div>
                </>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default Profile;
