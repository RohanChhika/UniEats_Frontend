import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenuPage = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { getAccessTokenSilently,user} = useAuth0();
  const [reviews, setReviews] = useState([]);
  const [deepLinkURL, setDeepLinkURL] = useState('');
  const [googleMapsSearchURL, setGoogleMapsSearchURL] = useState('');
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token= await getAccessTokenSilently();
        const response = await fetch(`https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewMenuItems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             'Authorization':`Bearer ${token}`
          },
          body: JSON.stringify({ restaurant: name }), // Pass the restaurant name in the request body
        });
        const data = await response.json();
        setMenuItems(data); // Update the state with the fetched menu items
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    console.log("useE done")

    const fetchReviews = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewReviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ restaurant: decodedName })
        });
        const reviewData = await response.json();
        if (response.ok) {
          setReviews(reviewData);
          console.log(reviewData);
        } else {
          throw new Error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };
    const fetchDeepLinkURL = async () => {
      let restaurantName;
      let lat ;
      let long ;
      if (decodedName === "Zesti Lemons") {
        restaurantName = "Zesti Lemonz";
        lat = -26.189650935694054;
        long = 28.027783610790753;
      } else if (decodedName === "Delhi Delicious") {
        restaurantName = "Delhi Delicous"; 
        lat = -26.189919212210018;
        long = 28.030728630878574;
      } else if (decodedName === "Vida Cafe") {
        restaurantName = "Vida e Caffe";
        lat = -26.19118586103877;
        long = 28.02816667030184;
      } else if (decodedName === "Jimmy's Killer Fish & Chips") {
        restaurantName = "Jimmys Killer Fish and Chips (Matrix)";
        lat = -26.189510350743006;
        long = 28.030667960631064;
      } else if (decodedName === "Olives & Plates") {
        restaurantName = "Olives & Plates";
         lat = -26.185527505729922;
         long = 28.02582296605567;
      } else if (decodedName === "Kara Nichas") {
        restaurantName = "Kara Nichas (Matrix)";
        lat = -26.189753684571233;
        long = 28.03068543860127;
      } 

      if (restaurantName) {
        try {
          const response = await fetch(`https://gateway.tandemworkflow.com/api/v1/navigation/poi/name/${(restaurantName)}`, {
            method: 'GET',
            headers: {  // Include the access token in the Authorization header
              'Content-Type': 'application/json'         // Optionally set Content-Type
            }
          });
      
          const data = await response.json();
          if (response.ok) {
            setDeepLinkURL(data.deepLinkUrl); 
            console.log(data);
          } else {
            throw new Error('Failed to fetch deep link URL');
          }
        } catch (error) {
          console.error('Error fetching deep link URL:', error);
        }
      }
      const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
      setGoogleMapsSearchURL(googleMapsURL)
    };
    
    fetchMenuItems();
    fetchReviews();
    fetchDeepLinkURL();
  }, [name,decodedName, getAccessTokenSilently]);

  const handleFilterChange = (filter, isChecked) => {
    if (isChecked) {
      setFilters([...filters, filter]);
    } else {
      setFilters(filters.filter(f => f !== filter));
    }
  };

  const filteredMenuItems = menuItems.filter(item =>
    filters.length === 0 || item.dietary.some(d => filters.includes(d))
  );

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(cartItem => cartItem.name === item.name);
  
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } 
      else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  
    setTotalPrice(totalPrice + item.price);
  };
  

  const handleRemoveFromCart = (index) => {
    const itemToRemove = cartItems[index];
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    setTotalPrice(totalPrice - itemToRemove.price);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
  };

  const handleCheckout = async() => {
    if (window.confirm("Are you sure you want to proceed with this purchase?")) {
      const orderPayload = {
          date: new Date().toISOString().split('T')[0], 
          time: new Date().toTimeString().split(' ')[0], 
          items: cartItems.map(item => item.name),
          restaurant: decodedName, 
          userID: user?.sub, 
          total: totalPrice, 
          email: user.email
      };

      try {
        const token= await getAccessTokenSilently();
          const response = await fetch('https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/addOrder', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${token}`
              },
              body: JSON.stringify(orderPayload)
          });

          if (response.ok) {
              const result = await response.json();
              console.log('Order placed successfully:', result);
              // Redirect to the Profile page if confirmed
              navigate("/profile");
          } else {
              const errorData = await response.json();
              console.error('Error placing order:', errorData.message);
              toast.error('Failed to place the order. Insufficient Funds.');
          }
      } catch (error) {
          console.error('Network error:', error);
          toast.error('Failed to place the order. Please try again.');
      }
  }
};


  return (
    <div className="menu-page-container">
      <div className="button-group">
        <Link to={`/review/${encodeURIComponent(decodedName)}`}>
          <button className="button">Leave Review</button>
        </Link>
        
        <Link to={`/reservation/${encodeURIComponent(decodedName)}`}>
          <button className="button">Book Reservation</button>
        </Link>

        <div className="get-directions">
          <h3>Get Directions to {decodedName}:</h3>
          {deepLinkURL ? (
            <a href={deepLinkURL} target="_blank" rel="noopener noreferrer">
            Click here for directions to {decodedName}
            </a>
            ) : (
            <a href={googleMapsSearchURL} target="_blank" rel="noopener noreferrer">
            Click here for directions to this resturant {decodedName}
            </a>
          )}
          <div className="mobile-separator"></div>
        </div>

      </div>     

      <div className="menu-items">
        <h2 className="Heading">Menu for {name}</h2>

        <div className="filter-group">
          {['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Kosher'].map(diet => (
            <label key={diet}>
              <input type="checkbox" onChange={e => handleFilterChange(diet, e.target.checked)} />
              {diet}
            </label>
          ))}
        </div>
      
        {filteredMenuItems.map(item => (
          <div key={item.name} className="menu-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Ingredients: {item.ingredients.join(', ')}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: R{item.price.toFixed(2)}</p>
            <button className="button" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart-and-reviews">
        <div className="cart-container">
          <h3>Your Cart</h3>
          {cartItems.length > 0 ? (
            <>
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity}) - R{(item.price * item.quantity).toFixed(2)}
                    <button className="button" onClick={() => handleRemoveFromCart(index)}>Remove</button>
                  </li>
                ))}
              </ul>
              <h4>Total: R{totalPrice.toFixed(2)}</h4>
              <button className="button" onClick={handleClearCart}>Clear Cart</button>
              <button className="button" onClick={handleCheckout}>Checkout</button>
            </>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        <div className="reviews-section">
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review, index) => (
                <li key={index}>
                  {review.comment} - Rating: {review.rating}/5
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );

};

export default MenuPage;
