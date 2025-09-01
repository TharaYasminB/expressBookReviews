const axios = require("axios").create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

// Replace this ISBN with the one you want to test
const testISBN = 1; // Example: book ID from your booksdb.js

// Async function to get book details by ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`/isbn/${isbn}`);
        console.log(`Book details for ISBN ${isbn}:`);
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        if (error.response) {
            console.error("Server responded with status", error.response.status);
            console.error(error.response.data);
        } else if (error.request) {
            console.error("No response received. Is the server running?");
        } else {
            console.error("Error:", error.message);
        }
    }
}

// Call the function
getBookByISBN(testISBN);
