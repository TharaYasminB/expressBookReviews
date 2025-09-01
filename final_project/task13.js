const axios = require("axios").create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

// Replace this with the book title you want to test
const testTitle = "Things Fall Apart";

// Async function to get books by title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`/title/${encodeURIComponent(title)}`);
        console.log(`Books with title "${title}":`);
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
getBooksByTitle(testTitle);
