import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [credits, setCredits] = useState(120); // Mock credits
    const [amount, setAmount] = useState(0);
    const [isUpcoming, setIsUpcoming] = useState(true);
    const navigate = useNavigate();
    const [yoco, setYoco] = useState(null);
    useEffect(() => {
        // Initialize Yoco SDK
        if (window.YocoSDK) {
            setYoco(new window.YocoSDK({
                publicKey: 'pk_test_e0ce18bfqWmALEL390b4'
            }));
        }
        // ... rest of your existing useEffect code ...
    }, [isAuthenticated, user, getAccessTokenSilently]);
    useEffect(() => {
        const fetchOrders = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewOrders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ userID: user.email }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                        setOrders(sortedOrders);
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

        const fetchReservations = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewReservations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ userID: user.sub }),
                    });

                    if (response.ok) {
                        const reservations = await response.json();
                        setReservations(reservations);
                        console.log(reservations);
                    } else {
                        console.error('Failed to fetch user');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };
        fetchReservations();
        fetchUser();
        fetchOrders();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const completeOrder = async (orderId) => {
        try {
            const token = await getAccessTokenSilently(); 
            const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/completeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({orderID: orderId }), 
            });
    
            const result = await response.json();
    
            if (response.ok) {
                navigate(0);
            } else {
                alert(`Failed to complete order: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while completing the order.');
        }
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleYocoPayment = () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        yoco.showPopup({
            amountInCents: Math.round(amount * 100),
            currency: 'ZAR',
            name: 'Purchase Credits',
            description: `Purchase ${amount} credits`,
            callback: async function (result) {
                if (result.error) {
                    alert("Error: " + result.error.message);
                } else {
                    try {
                        const token = await getAccessTokenSilently();
                        const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/purchaseCredits', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                userID: user.sub,
                                amount: parseFloat(amount),
                                yocoToken: result.id
                            }),
                        });

                        if (response.ok) {
                            // const data = await response.json();
                            setCredits(prevCredits => prevCredits + parseFloat(amount));
                            alert('Credits purchased successfully!');
                            setAmount('');
                        } else {
                            alert('Failed to purchase credits. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error purchasing credits:', error);
                        alert('An error occurred while purchasing credits.');
                    }
                }
            }
        });
    };

    

    const handleDeleteReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                const token = await getAccessTokenSilently(); 
    
                const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/deleteReservation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ _id: reservationId }), 
                });
    
                if (response.ok) {
                    setReservations(prevReservations =>
                        prevReservations.filter(reservation => reservation._id !== reservationId)
                    );
                    alert('Reservation deleted successfully');
                } else {
                    const errorData = await response.json();
                    console.error('Error deleting reservation:', errorData.message);
                    alert('Failed to delete the reservation. Please try again.');
                }
            } catch (error) {
                console.error('Error deleting reservation:', error.message);
                alert('Failed to delete the reservation. Please try again.');
            }
        }
    };
    
    const now = new Date();
    const filteredReservations = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return isUpcoming ? reservationDate >= now : reservationDate < now;
    });
    
    return (
        <div className="profile-container">
            <h1 className="profile-title">User Profile</h1>
            {isAuthenticated ? (
                <>
                    <div className="profile-card">
                        <p><strong>Name:</strong> {user?.nickname || "Guest"}</p>
                        <p><strong>Email:</strong> {user?.email || "guest@example.com"}</p>
                        <h2>Credits: 
                            <span className="prominent-credits">
                                {credits !== undefined ? `R${credits.toFixed(2)}` : 'Loading...'}
                            </span>
                        </h2>
                        <div className="credit-purchase-section">
                            <input
                                type="number"
                                value={amount ||''}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                            />
                            <button className="button" onClick={handleYocoPayment}>Purchase Credits</button>
                        </div>
                    </div>
                    <div className="reservations-section">
                        <h2>Reservations</h2>
                        <div>
                            <button 
                                className={`button ${isUpcoming ? 'active' : ''}`} 
                                onClick={() => setIsUpcoming(true)}
                            >
                                Upcoming Reservations
                            </button>
                            <button 
                                className={`button ${!isUpcoming ? 'active' : ''}`} 
                                onClick={() => setIsUpcoming(false)}
                            >
                                Past Reservations
                            </button>
                        </div>
                        <ul>
                            {filteredReservations.map((reservation) => {
                                const formattedDate = new Date(reservation.date).toLocaleDateString();
                                const formattedTime = reservation.time || new Date(reservation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <li key={reservation._id} className="reservation-card">
                                        <div><strong>Date:</strong> {formattedDate}</div>
                                        <div><strong>Time:</strong> {formattedTime}</div>
                                        <div><strong>Restaurant:</strong> {reservation.restaurant}</div>
                                        <div><strong>Number Of Guests:</strong> {reservation.numberOfGuests}</div>
                                        <div><strong>Special Request:</strong> {reservation.specialRequest}</div>
                                        {isUpcoming && (
                                            <button className="button" onClick={() => handleDeleteReservation(reservation._id)}>
                                                Delete Reservation
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="order-history">
                        <h2>Orders</h2>
                        <ul className="order-list">
                            {orders.map(order => (
                                <li key={order._id} className="order-card">
                                    <div><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
                                    <div><strong>Total:</strong> R{order.total.toFixed(2)}</div>
                                    <div><strong>Restaurant:</strong> {order.restaurant}</div>
                                    <div><strong>Status:</strong> {order.status}</div>
                                    {order.status !== "completed" && (
                                    <button className="button"
                                        onClick={() => completeOrder(order.orderID)} 
                                        disabled={order.status !== "ready for collection"} 
                                    >
                                        {order.status === "ready for collection" ? "Collected" : "Not Ready"}
                                    </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
