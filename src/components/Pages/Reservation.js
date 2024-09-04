import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const ReservationPage = () => {
    const { name } = useParams(); 
    const decodedName = decodeURIComponent(name);
    const { user, isAuthenticated, isLoading } = useAuth0();

    const [reservationData, setReservationData] = useState({
        date: '',
        time: '',
        guests: 1,
        specialRequests: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting reservation data:', reservationData);
        // Add here the POST request to your server or handling logic
        alert(`Reservation submitted for ${decodedName}!`);
        // Optionally redirect the user or clear form
        setReservationData({
            date: '',
            time: '',
            guests: 1,
            specialRequests: ''
        });
    };

    return (
        
        <div>
            <h1>Make a Reservation at {decodedName}</h1>
            {isAuthenticated && !isLoading ? (
                <p>Welcome, {user.sub}</p>  
            ) : (
                <p>Loading user information...</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Date:
                        <input type="date" name="date" value={reservationData.date} onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Time:
                        <input type="time" name="time" value={reservationData.time} onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Number of Guests:
                        <input type="number" name="guests" value={reservationData.guests} min="1" onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        Special Requests:
                        <textarea name="specialRequests" value={reservationData.specialRequests} onChange={handleChange} />
                    </label>
                </div>
                <button type="submit">Submit Reservation</button>
            </form>
        </div>
        
    );
};

export default ReservationPage;
