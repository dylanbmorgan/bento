// Secure server-side function. It runs on Vercel, not in the browser

export default async function handler(request, response) {
  // Get the secret API key and default location from Vercel's environment variables.
  const apiKey = process.env.VITE_WEATHER_API_KEY;
  const defaultLat = process.env.VITE_DEFAULT_LAT;
  const defaultLon = process.env.VITE_DEFAULT_LON;

  // Use the latitude and longitude from the client's request if they exist.
  // Otherwise, fall back to your private default location.
  const lat = request.query.lat || defaultLat;
  const lon = request.query.lon || defaultLon;

  // Make sure all required variables are present.
  if (!apiKey || !lat || !lon) {
    return response.status(500).json({ error: 'Server configuration error: Missing required environment variables.' });
  }

  // Construct the real OpenWeatherMap API URL
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    // Fetch data from the OpenWeatherMap API.
    const fetchResponse = await fetch(apiURL);
    const data = await fetchResponse.json();
    
    // If the API returned an error (e.g., invalid key), pass it along.
    if (!fetchResponse.ok) {
      return response.status(fetchResponse.status).json(data);
    }

    // Send the clean weather data back to the client.
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch weather data.' });
  }
}