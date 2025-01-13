document.addEventListener('DOMContentLoaded', () => {
    fetch('Data.json')
        .then(response => response.json())
        .then(data => {
            let currentIndex = 0;
            displayQuestion(data.results, currentIndex);

            document.getElementById('next-button').addEventListener('click', () => {
                if (currentIndex < data.results.length - 1) {
                    currentIndex++;
                    displayQuestion(data.results, currentIndex);
                }
            });

            document.getElementById('prev-button').addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    displayQuestion(data.results, currentIndex);
                }
            });

            document.getElementById('submit-button').addEventListener('click', () => {
                const selectedAnswer = document.querySelector('.question li.selected');
                if (!selectedAnswer) {
                    alert('Please select an answer before submitting.');
                    return;
                }

                const isCorrect = selectedAnswer.textContent === data.results[currentIndex].correct_answer;
                if (isCorrect) {
                    alert('Correct!');
                } else {
                    alert('Incorrect. The correct answer is: ' + data.results[currentIndex].correct_answer);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

function displayQuestion(results, index) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // Clear any existing content

    const item = results[index];
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const questionText = document.createElement('h2');
    questionText.textContent = `Q${index + 1}: ${item.question}`;
    questionElement.appendChild(questionText);

    const answersList = document.createElement('ul');

    // Combine correct and incorrect answers, then shuffle them
    const answers = [item.correct_answer, ...item.incorrect_answers];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const answerItem = document.createElement('li');
        answerItem.textContent = answer;
        answerItem.addEventListener('click', () => {
            // Remove highlight from all answers
            const allAnswers = answersList.querySelectorAll('li');
            allAnswers.forEach(li => li.classList.remove('selected'));

            // Highlight the selected answer
            answerItem.classList.add('selected');
        });
        answersList.appendChild(answerItem);
    });

    questionElement.appendChild(answersList);
    container.appendChild(questionElement);
}