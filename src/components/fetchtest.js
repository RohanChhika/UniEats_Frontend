import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';

const FetchDataComponent = () => {
    const [data, setData] = useState(null);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    useEffect(() => {
       
        // Function to fetch data from the backend
        const fetchData = async () => {
            try {
                const token= await getAccessTokenSilently();
                const response = await fetch('http://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/', {
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
                });

                // Check if the request was successful
                if (response.ok) {
                    const result = await response.text();
                    setData(result);
                    console.log('Data received from backend:', result);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        if(isAuthenticated){
        fetchData();
        }
    }, [isAuthenticated,getAccessTokenSilently]); // Empty dependency array ensures this runs once after the component mounts

    return (
        <div>
            <h1>Fetched Data</h1>
            {data ? (
                <pre>{data}</pre> // Display the plain text directly
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default FetchDataComponent;
