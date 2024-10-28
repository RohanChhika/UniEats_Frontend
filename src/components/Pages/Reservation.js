import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReservationPage = () => {
    const { name } = useParams(); 
    const decodedName = decodeURIComponent(name);
    const { user,getAccessTokenSilently } = useAuth0();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine date and time from the form
        const reservationDateTime = new Date(`${reservationData.date}T${reservationData.time}`);
        const now = new Date();

        // Check if reservation date and time are in the past
        if (reservationDateTime < now) {
            toast.error("Reservation date and time cannot be in the past. Please select a valid date and time.");
            return;
        }

        const reservationPayload = {
            date: reservationData.date,
            time: reservationData.time,
            numberOfGuests: reservationData.guests,
            specialRequest: reservationData.specialRequests,
            restaurant: decodedName,
            userID: user?.sub 
        };

        try {
            const token= await getAccessTokenSilently();
            const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/addReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify(reservationPayload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Reservation submitted:', result);
                toast.success(`Reservation submitted for ${decodedName}!`);
                // Optionally redirect or clear the form
                setReservationData({
                    date: '',
                    time: '',
                    guests: 1,
                    specialRequests: ''
                });
            } else {
                const errorData = await response.json();
                console.error('Error submitting reservation:', errorData.message);
                toast.error('Failed to submit reservation. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Failed to submit reservation. Please try again.');
        }
    };



    return (
        
        <div className='reservation-page'>
            <h1>Make a Reservation at {decodedName}</h1>
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
                <button type="submit" className='submitReservation'>Submit Reservation</button>
            </form>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
        
    );
};

export default ReservationPage;
