const fetchQuestions = async () => {
  try {
    const apiUrl = "https://opentdb.com/api.php?amount=10";
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
function showFeedback(message, isSuccess) {
  feedbackElement.textContent = message;
  feedbackElement.className = "feedback " + (isSuccess ? "success" : "error");
  feedbackElement.style.display = "block";

  // Clear any existing timeout
  if (window.feedbackTimeout) {
    clearTimeout(window.feedbackTimeout);
  }

  // Set new timeout
  window.feedbackTimeout = setTimeout(() => {
    feedbackElement.style.display = "none";
  }, 3000);
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetchQuestions();
    if (!data) {
      throw new Error("Failed to fetch questions");
    }
    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("feedback");
    document.getElementById("data-container").appendChild(feedbackElement);

    function showFeedback(message, isSuccess) {
      feedbackElement.textContent = message;
      feedbackElement.className =
        "feedback " + (isSuccess ? "success" : "error");
      feedbackElement.style.display = "block";
      setTimeout(() => {
        feedbackElement.style.display = "none";
      }, 3000); // Hide after 3 seconds
    }
    let currentIndex = 0;
    const answeredQuestions = new Map(); // Use a Map to store the selected answer for each question
    displayQuestion(data.results, currentIndex, answeredQuestions);

    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "none"; // Hide the next button initially

    document.getElementById("next-button").addEventListener("click", () => {
      if (currentIndex < data.results.length - 1) {
        currentIndex++;
        displayQuestion(data.results, currentIndex, answeredQuestions);
        if (answeredQuestions.has(currentIndex)) {
          nextButton.style.display = "inline"; // Show the next button if the question is already answered
        } else {
          nextButton.style.display = "none"; // Hide the next button until the next answer is submitted
        }
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
        showFeedback("Please select an answer before submitting.", false);
        return;
      }
      const isCorrect =
        selectedAnswer.textContent ===
        data.results[currentIndex].correct_answer;
      if (isCorrect) {
        showFeedback("✅ Correct! Well done!", true);
      } else {
        showFeedback(
          `❌ Incorrect. The correct answer is: ${data.results[currentIndex].correct_answer}`,
          false
        );
      }
      answeredQuestions.set(currentIndex, selectedAnswer.textContent); // Store the selected answer
      nextButton.style.display = "inline"; // Show the next button after submission
      displayQuestion(data.results, currentIndex, answeredQuestions); // Refresh the question to highlight the correct answer
    });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("data-container").innerHTML =
      "<p>Failed to load questions. Please try again later.</p>";
  }
});

function displayQuestion(results, index, answeredQuestions) {
  const container = document.getElementById("data-container");
  container.innerHTML = "";

  const item = results[index];
  const questionElement = document.createElement("div");
  questionElement.classList.add("question");

  const questionText = document.createElement("h2");
  // Decode the question text
  questionText.textContent = `Q${index + 1}: ${decodeHTMLEntities(
    item.question
  )}`;
  questionElement.appendChild(questionText);

  const answersList = document.createElement("ul");

  // Combine correct and incorrect answers
  const answers = [item.correct_answer, ...item.incorrect_answers].map(
    (answer) => decodeHTMLEntities(answer)
  );

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
    allAnswers.forEach((li) => {
      if (li.textContent === selectedAnswer) {
        li.classList.add("selected");
      }
      if (li.textContent === item.correct_answer) {
        li.classList.add("correct");
      }
    });
  }
}
