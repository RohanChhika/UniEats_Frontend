import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../Profile.css';

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [credits, setCredits] = useState(120); // Mock credits
    const [voucher, setVoucher] = useState('');

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
                window.location.reload(true);
            } else {
                alert(`Failed to complete order: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while completing the order.');
        }
    };

    const handleVoucherChange = (event) => {
        setVoucher(event.target.value);
    };

    const handleVoucherSubmit = async () => {
        const validVouchers = ["OneHundred", "TwoHundred", "Fifty"];
        if (!validVouchers.includes(voucher)) {
            alert('Please enter a valid voucher code (OneHundred, TwoHundred, or Fifty).');
            return;
        }
     
        try {
            const token = await getAccessTokenSilently(); 
            const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/addCredits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    userID: user.sub, 
                    vouch: voucher 
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setVoucher(''); 
                window.location.reload(true);
            } else {
                alert(`Failed to apply voucher: ${result.message}`);
            }
        } catch (error) {
            console.error('Error applying voucher:', error);
            alert('An error occurred while applying the voucher.');
        }
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
                        <div className="voucher-section">
                            <input
                                type="text"
                                value={voucher}
                                onChange={handleVoucherChange}
                                placeholder="Enter voucher code"
                            />
                            <button className="button" onClick={handleVoucherSubmit}>Apply Voucher</button>
                        </div>
                    </div>
                    <div className="reservations-section">
                    <h2>Reservations</h2>
                    <ul>
                        {reservations.map((reservation) => {
                        // Format the date and time
                        const formattedDate = new Date(reservation.date).toLocaleDateString();
                        const formattedTime = reservation.time || new Date(reservation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <li key={reservation._id} className="reservation-card">
                            <div><strong>Date:</strong> {formattedDate}</div>
                            <div><strong>Time:</strong> {formattedTime}</div>
                            <div><strong>Restaurant:</strong> {reservation.restaurant}</div>
                            <div><strong>Number Of Guests:</strong> {reservation.numberOfGuests}</div>
                            <div><strong>Special Request:</strong> {reservation.specialRequest}</div>
                            <button className="button" onClick={() => handleDeleteReservation(reservation._id)}>Delete Reservation</button>
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
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default Profile;
