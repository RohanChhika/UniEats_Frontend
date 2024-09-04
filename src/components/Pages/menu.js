import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../../App.css';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const navigate = useNavigate();


  // const mockMenuItems = [
  //   {
  //     id: 1,
  //     name: "Grilled Salmon",
  //     description: "Freshly grilled salmon with a touch of lemon",
  //     ingredients: ["Salmon", "Lemon", "Salt"],
  //     quantity: "1 piece",
  //     price: 15.99,
  //     dietary: ["Gluten-Free", "Pescatarian"]

  //   },
  //   {
  //     id: 2,
  //     name: "Caesar Salad",
  //     description: "Classic Caesar salad with romaine lettuce and parmesan",
  //     ingredients: ["Lettuce", "Parmesan", "Croutons"],
  //     quantity: "1 bowl",
  //     price: 12.00,
  //     dietary: ["Vegetarian"]
  //   },
  //   {
  //     id: 3,
  //     name: "Vegan Burger",
  //     description: "Plant-based burger with avocado and sprouts",
  //     ingredients: ["Plant Patty", "Avocado", "Sprouts", "Bun"],
  //     quantity: "1 burger",
  //     price: 13.00,
  //     dietary: ["Vegan", "Kosher"]
  //   }
  // ];

  const [menuItems, setMenuItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { getAccessTokenSilently,user} = useAuth0();
  
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
    fetchMenuItems();
  }, [name,getAccessTokenSilently]);

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
    setCartItems([...cartItems, item]);
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
    // Ask the user to confirm the checkout
    if (window.confirm("Are you sure you want to proceed with checkout?")) {
      const orderPayload = {
          date: new Date().toISOString().split('T')[0], // Current date in ISO format
          time: new Date().toTimeString().split(' ')[0], // Current time in HH:mm:ss format
          items: cartItems.map(item => item.name),
          restaurant: decodedName, // Assuming you have this fixed or derived from somewhere
          userID: user?.sub, // Auth0 user ID
          total: totalPrice // Example calculation
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
              alert('Failed to place the order. Please try again.');
          }
      } catch (error) {
          console.error('Network error:', error);
          alert('Failed to place the order. Please try again.');
      }
  }
};


  return (
    <div className="menu-page-container">
      <div className="menu-items">
        <h2 className="Heading">Menu for {name}</h2>
        
        <div>
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
            <p>Price: ${item.price.toFixed(2)}</p>
            <button className="button" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <Link to={`/review/${encodeURIComponent(decodedName)}`}>
            <button className="button">Leave Review</button>
        </Link>

        <Link to={`/reservation/${encodeURIComponent(decodedName)}`}>
            <button className="button">Book Reservation</button>
        </Link>
      <div className="cart-container">
        <h3>Your Cart</h3>
        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price.toFixed(2)}
                  <button className="button" onClick={() => handleRemoveFromCart(index)}>Remove</button>
                </li>
              ))}
            </ul>
            <h4>Total: ${totalPrice.toFixed(2)}</h4>
            <button className="button" onClick={handleClearCart}>Clear Cart</button>
            <button className="button" onClick={handleCheckout}>Checkout</button>  
          </>
        ) : (
          <p>Your cart is empty</p>
          
        )}
      </div>
    </div>
  );
};

export default MenuPage;
