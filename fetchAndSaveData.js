const fs = require('fs');

const fetchQuestions = async () => {
    try {
        const fetch = (await import('node-fetch')).default;
        const apiUrl = 'https://opentdb.com/api.php?amount=10';
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data); // Log the entire response data

        // Write the data to a file
        fs.writeFile('apiData.json', JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
            console.log('Data has been saved to apiData.json');
        });
    } catch (error) {
        console.error(error);
    }
}

// Call the function to fetch and save the data
fetchQuestions();