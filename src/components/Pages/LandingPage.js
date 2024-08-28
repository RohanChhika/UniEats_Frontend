//import React from 'react';
import React, { useState,useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../App.css';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <img src={restaurant.image} alt={restaurant.name} />
      <h3 className='restaurant-links'><Link to={`/restaurant/${restaurant.name}`}>{restaurant.name}</Link></h3>
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
};

// const LandingPage = () => {
//   const [restaurants, setRestaurants] = useState([
//     {
//       name: "Jimmy's Killer Fish & Chips",
//       image: "https://www.safranchisebrands.co.za/wp-content/uploads/elementor/thumbs/Jimmys-Killer-Grills-p7lp4yd4qlnhpdstf4tmikdp0p6x8m8akk23ruru4o.png",
//       description: "Delicious fish and chips",
//       rating: 4
//     },
//     {
//       name: "Zesti Lemons",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1QucXZIV5ZY8-9J9lE-mTNbG1pzlGwggi_Q&s",
//       description: "Fresh and zesty lemon dishes",
//       rating: 5
//     },
//     {
//       name: "Olives & Plates",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Q1YIvQizeAD0VxgRbGUkzkvmssRVXFzpwQ&s",
//       description: "Mediterranean cuisine",
//       rating: 3
//     },
//     {
//       name: "Kara Nichas",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXfI4CS0RPX91UhaOsiJEiWwNQyUV5D7kVyw&s",
//       description: "Authentic Thai food",
//       rating: 5
//     },
//     {
//       name: "Delhi Delicious",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUY1hVRe03QyjmYsOiczLjs59gUzwX8AHU6Q&s",
//       description: "Indian street food",
//       rating: 4
//     },
//     {
//       name:"Vida Cafe",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8hyx0bIiw4krsFQ0kATvTFz6UY7d6i8KKPA&s",
//       description: "Coffees",
//       rating:3 
//     }
//   ]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredRestaurants = restaurants.filter((restaurant) =>
//     restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );



const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getAccessTokenSilently} = useAuth0();
  // Fetch restaurants data from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token= await getAccessTokenSilently();
        const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewRestaurants',{
                    method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':`Bearer ${token}`
                        // Add any other headers you need
                        }
                    // Uncomment the following lines if you're sending data
                    // body: JSON.stringify({
                    //     key: 'value' // your data here
                    // })
                }); // Replace with your actual backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurants();
  }, [getAccessTokenSilently]);

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
