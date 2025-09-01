const axios = require("axios").create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Async function to fetch all books
async function getAllBooks() {
  try {
    const response = await axios.get("/books");
    console.log("List of books available in the shop:");
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error("Error fetching books:", error.response?.data || error.message);
  }
}

// Call the function
getAllBooks();
