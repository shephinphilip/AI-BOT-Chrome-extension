// This content script runs on https://www.google.com/* pages
const searchInput = document.querySelector('input[name="q"]');
if (searchInput) {
  // Add event listener to capture user input
  searchInput.addEventListener("input", (event) => {
    const userInput = event.target.value.trim();
    if (userInput !== "") {
      // Send the userInput to your chatbot API or process it as desired
      // Replace the code below with your API call or processing logic
      console.log("User input from Google search bar:", userInput);
    }
  });
}
