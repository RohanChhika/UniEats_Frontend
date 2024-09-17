import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginLogoutButton from '../components/buttons/LoginLogoutButton';

// Mocking the Auth0 hook to simulate authentication behavior in tests
jest.mock('@auth0/auth0-react');

describe('LoginLogoutButton', () => {
  // Clear any mock calls before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Verifies that the "Log In" button is shown when the user is not authenticated
  it('shows Log In when not authenticated', () => {
    // Mock the Auth0 hook to return a non-authenticated user
    useAuth0.mockReturnValue({
      isAuthenticated: false, // User is not authenticated
      loginWithRedirect: jest.fn(), // Mock login function
    });

    // Render the LoginLogoutButton component wrapped in a MemoryRouter (for routing context)
    render(
      <MemoryRouter>
        <LoginLogoutButton />
      </MemoryRouter>
    );

    // Check that the "Log In" button is rendered and visible
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  // Test case: Verifies that the "Log Out," "View my Profile," and "Back" buttons are shown when the user is authenticated
  it('shows Log Out and other options when authenticated', () => {
    const mockLogout = jest.fn(); // Mock the logout function
    // Mock the Auth0 hook to return an authenticated user
    useAuth0.mockReturnValue({
      isAuthenticated: true, // User is authenticated
      logout: mockLogout, // Mock logout function
    });

    // Render the LoginLogoutButton component wrapped in a MemoryRouter
    render(
      <MemoryRouter>
        <LoginLogoutButton />
      </MemoryRouter>
    );

    // Check that the "Log Out," "View my Profile," and "Back" buttons are rendered
    expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View my Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  // Test case: Verifies that clicking the "Log In" button triggers the `loginWithRedirect` function
  it('calls loginWithRedirect when Log In is clicked', () => {
    const mockLoginWithRedirect = jest.fn(); // Mock the loginWithRedirect function
    // Mock the Auth0 hook to return a non-authenticated user
    useAuth0.mockReturnValue({
      isAuthenticated: false, // User is not authenticated
      loginWithRedirect: mockLoginWithRedirect, // Mock login function
    });

    // Render the LoginLogoutButton component wrapped in a MemoryRouter
    render(
      <MemoryRouter>
        <LoginLogoutButton />
      </MemoryRouter>
    );

    // Simulate clicking the "Log In" button
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
    // Check that `loginWithRedirect` was called
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  // Test case: Verifies that clicking the "Log Out" button triggers the `logout` function with correct parameters
  it('calls logout when Log Out is clicked', () => {
    const mockLogout = jest.fn(); // Mock the logout function
    // Mock the Auth0 hook to return an authenticated user
    useAuth0.mockReturnValue({
      isAuthenticated: true, // User is authenticated
      logout: mockLogout, // Mock logout function
    });

    // Render the LoginLogoutButton component wrapped in a MemoryRouter
    render(
      <MemoryRouter>
        <LoginLogoutButton />
      </MemoryRouter>
    );

    // Simulate clicking the "Log Out" button
    fireEvent.click(screen.getByRole('button', { name: 'Log Out' }));
    // Check that `logout` was called with the correct parameters
    expect(mockLogout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin }, // Ensure `logout` uses the correct return URL
    });
  });

  // Test case: Verifies that clicking the "Back" button triggers the browser's history back action
  it('calls window.history.back when "Back" button is clicked', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true, // User is authenticated
    });

    const historyBackMock = jest.fn(); // Mock the history back function
    window.history.back = historyBackMock; // Override window.history.back with the mock function

    // Render the LoginLogoutButton component wrapped in a MemoryRouter
    render(
      <MemoryRouter>
        <LoginLogoutButton />
      </MemoryRouter>
    );

    // Simulate clicking the "Back" button
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    // Check that `window.history.back` was called
    expect(historyBackMock).toHaveBeenCalled();
  });

  // Test case: Verifies that the "View my Profile" link is rendered correctly with the correct URL
  it('renders "View my Profile" link correctly', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true, // User is authenticated
    });

    // Render the LoginLogoutButton component wrapped in a MemoryRouter
    render(
      <MemoryRouter>
        <LoginLogoutButton />
      </MemoryRouter>
    );

    // Find the "View my Profile" link and check that it has the correct href attribute
    const profileLink = screen.getByText('View my Profile').closest('a');
    expect(profileLink).toHaveAttribute('href', '/profile'); // Ensure it points to '/profile'
  });
});
