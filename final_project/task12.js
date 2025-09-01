const axios = require("axios").create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

// Replace this author with the one you want to test
const testAuthor = "Chinua Achebe";

// Async function to get books by author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`/author/${encodeURIComponent(author)}`);
        console.log(`Books by author "${author}":`);
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
getBooksByAuthor(testAuthor);
