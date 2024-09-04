import React, { useState,useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../App.css';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <img src={restaurant.image} alt={restaurant.name} />
      <h3 className='restaurant-links'>
        <Link to={`/restaurant/${encodeURIComponent(restaurant.name)}`}>{restaurant.name}</Link>
      </h3>
      <p>{restaurant.description}</p>
      <div className="rating">
        {Array(restaurant.rating).fill(null).map((_, i) => (
          <span key={i}>★</span>
        ))}
        {Array(5 - restaurant.rating).fill(null).map((_, i) => (
          <span key={i}>☆</span>
        ))}
      </div>
    </div>
  );
}

const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getAccessTokenSilently,user} = useAuth0();
  // Fetch restaurants data from backend
  useEffect(() => {
    // Function to fetch restaurants
    const fetchRestaurants = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewRestaurants', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };
  
    // Function to sign up user
    const signUpUser = async () => {
      if (user) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/signUp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userID: user.sub })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            console.log('User signed up successfully:', data.message);
          } else {
            console.error('Error signing up user:', data.message);
          }
        } catch (error) {
          console.error('Error during sign-up:', error);
        }
      }
    };
  console.log("useEffect done")
    // Call the functions
    fetchRestaurants();
    signUpUser();
  
    // Ensure useEffect runs only when user or getAccessTokenSilently changes
  }, [user, getAccessTokenSilently]);
 

  // Filtered restaurants based on search term
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <section>
        <section>
          <section className="center-container">
            <h2>Available Restaurants</h2>
          </section>
          <section className="center-container">
            <input
            type="text"
            placeholder="Search for a restaurant"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
          </section>     
        </section>
        
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
