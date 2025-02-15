document.addEventListener("DOMContentLoaded", () => {
  // should fetch the data from the API not from a local file
  fetch("Data.json")
    .then((response) => response.json())
    .then((data) => {
      let currentIndex = 0;
      const answeredQuestions = new Map(); // Use a Map to store the selected answer for each question
      displayQuestion(data.results, currentIndex, answeredQuestions);

      const nextButton = document.getElementById("next-button");
      nextButton.style.display = "none"; // Hide the next button initially

      document.getElementById("next-button").addEventListener("click", () => {
        if (currentIndex < data.results.length - 1) {
          currentIndex++;
          displayQuestion(data.results, currentIndex, answeredQuestions);
          // could be simplified using a ternary operator
          nextButton.style.display = answeredQuestions.has(currentIndex)
            ? "inline"
            : "none";
        }
      });

      document.getElementById("prev-button").addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          displayQuestion(data.results, currentIndex, answeredQuestions);
          nextButton.style.display = "inline"; // Show the next button for previously answered questions
        }
      });

      document.getElementById("submit-button").addEventListener("click", () => {
        const selectedAnswer = document.querySelector(".question li.selected");
        if (!selectedAnswer) {
          alert("Please select an answer before submitting.");
          return;
        }

        const isCorrect =
          selectedAnswer.textContent ===
          data.results[currentIndex].correct_answer;

        // this could be simplified by using a ternary operator
        alert(
          isCorrect
            ? "Correct!"
            : "Incorrect. The correct answer is: " +
                data.results[currentIndex].correct_answer
        );

        answeredQuestions.set(currentIndex, selectedAnswer.textContent); // Store the selected answer
        nextButton.style.display = "inline"; // Show the next button after submission
        displayQuestion(data.results, currentIndex, answeredQuestions); // Refresh the question to highlight the correct answer
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function displayQuestion(results, index, answeredQuestions) {
  const container = document.getElementById("data-container");
  // use textContent instead of innerHTML
  container.textContent = ""; // Clear any existing content

  const item = results[index];
  const questionElement = document.createElement("div");
  questionElement.classList.add("question");

  const questionText = document.createElement("h2");
  questionText.textContent = `Q${index + 1}: ${item.question}`;
  questionElement.appendChild(questionText);

  const answersList = document.createElement("ul");

  // Combine correct and incorrect answers
  const answers = [item.correct_answer, ...item.incorrect_answers];

  answers.forEach((answer) => {
    const answerItem = document.createElement("li");
    answerItem.textContent = answer;
    answerItem.addEventListener("click", () => {
      // Remove highlight from all answers
      const allAnswers = answersList.querySelectorAll("li");
      allAnswers.forEach((li) => li.classList.remove("selected"));

      // Highlight the selected answer
      answerItem.classList.add("selected");
    });
    answersList.appendChild(answerItem);
  });

  questionElement.appendChild(answersList);
  container.appendChild(questionElement);

  // Highlight the correct answer if the question has been answered
  if (answeredQuestions.has(index)) {
    const selectedAnswer = answeredQuestions.get(index);
    const allAnswers = answersList.querySelectorAll("li");
    // this can be simplified for readability
    allAnswers.forEach((li) => {
      li.classList.toggle("selected", li.textContent === selectedAnswer);
      li.classList.toggle("correct", li.textContent === item.correct_answer);
    });
  }
}
