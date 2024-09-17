import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import MenuPage from '../components/Pages/menu'; // Adjust the import path as necessary

// Mocking the useAuth0 hook to simulate Auth0 behavior in the tests
jest.mock('@auth0/auth0-react');

// Mocked menu items for the tests
const mockedMenuItems = [
  {
    name: "Grilled Salmon",
    description: "Freshly grilled salmon with a touch of lemon",
    ingredients: ["Salmon", "Lemon", "Salt"],
    quantity: "1 piece",
    price: 15.99,
    dietary: ["Gluten-Free", "Pescatarian"]
  },
  {
    name: "Caesar Salad",
    description: "Classic Caesar salad with romaine lettuce and parmesan",
    ingredients: ["Lettuce", "Parmesan", "Croutons"],
    quantity: "1 bowl",
    price: 12.00,
    dietary: ["Vegetarian"]
  }
];

// Mock function to simulate getting the access token silently from Auth0
const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('fake_token'));

// Before each test, mock the Auth0 hook and set up global fetch calls
beforeEach(() => {
  useAuth0.mockReturnValue({
    getAccessTokenSilently: mockGetAccessTokenSilently,
    user: { email: 'test@example.com', sub: 'auth0|1234567890' }
  });

  // Mock global fetch function to return different responses based on the URL
  global.fetch = jest.fn((url, options) => {
    switch (url) {
      case 'https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewMenuItems':
        // Return mocked menu items for this URL
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockedMenuItems)
        });
      case 'https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/viewReviews':
        // Return mocked reviews for this URL
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { comment: "Great food", rating: 5 }
          ])
        });
      default:
        // Return a rejected promise for any unhandled URLs
        return Promise.reject(new Error('not found'));
    }
  });
});

// Clear all mock data after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Describe block for the MenuPage tests
describe('MenuPage', () => {
  
  // Test case: Ensure items can be added to the cart and the total price is updated
  test('handles adding items to cart and updates total price', async () => {
    const { getAllByText, getByText } = render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );

    // Wait for the menu items to be fetched and rendered, and click "Add to Cart"
    const addButtons = await waitFor(() => getAllByText('Add to Cart'));
    fireEvent.click(addButtons[0]); // Click the first "Add to Cart" button

    // Assertions to ensure the cart is updated with the total price
    await waitFor(() => {
      expect(getByText('Your Cart')).toBeInTheDocument(); // Check that the cart is visible
      expect(getByText(/Total: R[0-9.]+/)).toBeInTheDocument(); // Check that the total price is displayed
    });
  });

  // Test case: Ensure reviews are displayed after fetching
  test('displays reviews after fetching', async () => {
    const { findAllByText, getByText } = render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );

    // Wait for reviews to be fetched and displayed on the page
    const reviewItems = await findAllByText(/Rating:/i);
    expect(reviewItems.length).toBeGreaterThan(0); // Ensure at least one review is fetched
    expect(getByText(/Great food - Rating: 5/)).toBeInTheDocument(); // Check for specific review content
  });

  // Test case: Ensure items can be removed from the cart and the total price is updated accordingly
  test('removes items from cart and updates total price', async () => {
    const { getAllByText, findByText, queryByText } = render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );

    // Add an item to the cart by clicking "Add to Cart"
    const addButtons = await waitFor(() => getAllByText('Add to Cart'));
    fireEvent.click(addButtons[0]);

    // Now remove the item by clicking "Remove"
    const removeButton = await findByText('Remove');
    fireEvent.click(removeButton);

    // Assertions to ensure the cart is updated correctly after item removal
    await waitFor(() => {
      expect(queryByText('Your cart is empty')).toBeInTheDocument(); // Ensure the cart is empty after removal
    });
  });
  
});
