const express = require('express');
const axios = require('axios');

// Create Express app
const app = express();
const port = 9876;

// Test server base URL
const TEST_SERVER = 'http://20.244.56.144/evaluation-service';

// Configuration
const config = {
  windowSize: 10,
  timeout: 500 // ms
};

// Storage for different number types
const storage = {
  p: [], // prime
  f: [], // fibonacci
  e: [], // even
  r: []  // random
};

// Helper function to fetch numbers from test server
async function fetchNumbers(type) {
  let endpoint = '';
  
  // Map type to endpoint
  switch(type) {
    case 'p': endpoint = 'primes'; break;
    case 'f': endpoint = 'fibo'; break;
    case 'e': endpoint = 'even'; break;
    case 'r': endpoint = 'random'; break;
    default: throw new Error('Invalid number type');
  }
  
  try {
    console.log(`Fetching ${endpoint} numbers from ${TEST_SERVER}/${endpoint}`);
    // Set timeout to avoid long-running requests
    const response = await axios.get(`${TEST_SERVER}/${endpoint}`, {
      timeout: config.timeout
    });
    
    // Return empty array if response is not as expected
    if (!response.data || !response.data.numbers) {
      console.log('Invalid response format or no numbers received');
      return [];
    }
    
    console.log(`Received ${response.data.numbers.length} ${endpoint} numbers`);
    return response.data.numbers;
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error.message);
    return []; // Return empty array on error
  }
}

// Helper function to calculate average
function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
}

// Helper function to maintain window size
function updateWindow(window, newNumbers) {
  // Create a copy of the current window
  let result = [...window];
  
  // Add new unique numbers
  for (const num of newNumbers) {
    if (!result.includes(num)) {
      result.push(num);
    }
  }
  
  // Keep only the newest numbers if exceeding window size
  if (result.length > config.windowSize) {
    result = result.slice(result.length - config.windowSize);
  }
  
  return result;
}

// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('Average Calculator Service is running. Use /numbers/{type} where type is p, f, e, or r.');
});

// Route handler for number requests
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;
  console.log(`Received request for numbers type: ${type}`);
  
  // Validate number type
  if (!['p', 'f', 'e', 'r'].includes(type)) {
    console.log(`Invalid number type: ${type}`);
    return res.status(400).json({ error: 'Invalid number type. Use p, f, e, or r.' });
  }
  
  // Store previous state before making new API call
  const prevState = [...storage[type]];
  console.log(`Previous state for ${type}:`, prevState);
  
  try {
    // Fetch new numbers
    const newNumbers = await fetchNumbers(type);
    console.log(`New numbers for ${type}:`, newNumbers);
    
    // Update storage with new numbers
    storage[type] = updateWindow(storage[type], newNumbers);
    console.log(`Updated state for ${type}:`, storage[type]);
    
    // Calculate average
    const avg = calculateAverage(storage[type]);
    console.log(`Average for ${type}: ${avg}`);
    
    // Prepare response
    const response = {
      windowPrevState: prevState,
      windowCurrState: storage[type],
      numbers: newNumbers,
      avg: avg
    };
    
    res.json(response);
  } catch (error) {
    console.error(`Error processing request for ${type}:`, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Average Calculator service running at http://localhost:${port}`);
  console.log(`Window size set to ${config.windowSize}`);
});