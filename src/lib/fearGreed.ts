// Mock data for fallback when API fails
const mockFearGreedData = {
  value: 65,
  valueClassification: 'Greed',
  timestamp: Math.floor(Date.now() / 1000).toString(),
  previousClose: 62
};

export interface FearGreedData {
  value: number;
  valueClassification: string;
  timestamp: string;
  previousClose: number;
}

export async function getFearGreedIndex(): Promise<FearGreedData> {
  try {
    // Create an AbortController for the fetch
    const controller = new AbortController();
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error('Request timed out'));
      }, 5000); // 5 second timeout
    });

    // Create the fetch promise
    const fetchPromise = fetch('https://api.alternative.me/fng/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    });

    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid API response format: Missing or empty data array');
    }

    const current = data.data[0];

    // Validate required fields
    if (!current.value || !current.value_classification || !current.timestamp) {
      throw new Error('Invalid API response format: Missing required fields');
    }

    const previousClose = data.data[1]?.value || current.value;

    // Parse and validate numeric values
    const value = parseInt(current.value);
    const prevClose = parseInt(previousClose);

    if (isNaN(value) || isNaN(prevClose)) {
      throw new Error('Invalid API response format: Non-numeric values');
    }

    return {
      value,
      valueClassification: current.value_classification,
      timestamp: current.timestamp,
      previousClose: prevClose
    };
  } catch (error) {
    // Provide detailed error logging
    console.warn('Fear & Greed Index Warning:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? {
        name: error.name,
        stack: error.stack
      } : error
    });

    // Return mock data as fallback
    console.info('Using mock Fear & Greed data as fallback');
    return mockFearGreedData;
  }
}