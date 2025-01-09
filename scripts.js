// Function to fetch the JSON data
const loadJsonData = async () => {
    try {
        const response = await fetch('./apiData.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data); // Log the imported data to verify

        // Use the imported data
        const questions = data.results;
        console.log(questions);
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

// Call the function to load the JSON data
loadJsonData();