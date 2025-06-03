// Example of how to connect to your backend from your Netlify frontend

// Using fetch API
async function fetchDataFromBackend() {
  try {
    const response = await fetch("https://your-backend-url.com/api/data")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    console.log("Data from backend:", data)
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

// Using axios (if you prefer)
// import axios from 'axios';
//
// async function fetchDataWithAxios() {
//   try {
//     const response = await axios.get('https://your-backend-url.com/api/data');
//     console.log('Data from backend:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// }
