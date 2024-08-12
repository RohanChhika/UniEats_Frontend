import React, { useEffect, useState } from 'react';

const FetchDataComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Function to fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:3001/', {
                    method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any other headers you need
                    },
                    // Uncomment the following lines if you're sending data
                    // body: JSON.stringify({
                    //     key: 'value' // your data here
                    // })
                });

                // Check if the request was successful
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                    console.log('Data received from backend:', result);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once after the component mounts

    return (
        <div>
            <h1>Fetched Data</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default FetchDataComponent;
