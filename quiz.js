// script.js

const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#num-questions"),
    category = document.querySelector("#category"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startScreen = document.querySelector(".start-screen"),
    submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");

let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;
numQuestions.innerHTML = `
    <option value="5">5</option>
    <option value="10">10</option>
  `;

category.innerHTML = `
    <option value="Bubble Sort">Bubble Sort</option>
    <option value="Quick Sort">Quick Sort</option>
    <option value="Merge Sort">Merge Sort</option>
    <option value="Selection Sort">Selection Sort</option>
    <option value="Insertion Sort">Insertion Sort</option>
  `;

timePerQuestion.innerHTML = `
    <option value="10">10 seconds</option>
    <option value="20">20 seconds</option>
    <option value="30">30 seconds</option>
    <option value="40">40 seconds</option>
    <option value="50">50 seconds</option>
    <option value="60">60 seconds</option>
  `;
const questionBank = {
    "Bubble Sort": [
        { question: "What is the worst-case time complexity of Bubble Sort?", options: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"], answer: "O(n^2)" },
        { question: "Bubble Sort is a ___ algorithm.", options: ["Stable", "Unstable", "Non-comparative", "Recursive"], answer: "Stable" },
        { question: "What is the worst-case time complexity of Bubble Sort?", options: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"], answer: "O(n^2)" },
        { question: "Bubble Sort is a ___ algorithm.", options: ["Stable", "Unstable", "Non-comparative", "Recursive"], answer: "Stable" },
        { question: "What is the best-case time complexity of Bubble Sort?", options: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"], answer: "O(n)" },
        { question: "Which technique does Bubble Sort use?", options: ["Divide and Conquer", "Greedy", "Exchanging", "Recursion"], answer: "Exchanging" },
        { question: "Bubble Sort is an example of which type of sorting?", options: ["Comparison-based", "Non-comparison-based", "Hybrid", "Bucket Sort"], answer: "Comparison-based" },
        { question: "Which of the following is a drawback of Bubble Sort?", options: ["High time complexity", "Requires additional memory", "Only works on sorted data", "None of the above"], answer: "High time complexity" },
        { question: "In Bubble Sort, after the first pass, the largest element is at?", options: ["Middle", "End", "Start", "Random Position"], answer: "End" },
        { question: "How many passes are required to fully sort an array of n elements using Bubble Sort?", options: ["n", "n-1", "log n", "n/2"], answer: "n-1" },
        { question: "What happens if we apply Bubble Sort on an already sorted array?", options: ["Performs unnecessary swaps", "Runs in O(n) time", "Runs in O(n^2) time", "Fails to sort"], answer: "Runs in O(n) time" },
        { question: "Bubble Sort works best for?", options: ["Large datasets", "Nearly sorted datasets", "Random datasets", "All datasets"], answer: "Nearly sorted datasets" },
        { question: "Which of the following sorting algorithms is similar to Bubble Sort?", options: ["Selection Sort", "Merge Sort", "Quick Sort", "Radix Sort"], answer: "Selection Sort" },
        { question: "Bubble Sort repeatedly swaps adjacent elements if they are in the ___ order.", options: ["Same", "Correct", "Wrong", "Any"], answer: "Wrong" }
    ],
    "Quick Sort": [
        { question: "What is the average-case time complexity of Quick Sort?", options: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"], answer: "O(n log n)" },
        { question: "Which element is chosen as the pivot in Quick Sort in this implementation?", options: ["First element", "Last element", "Middle element", "Random element"], answer: "First element" },
        { question: "What is the worst-case time complexity of Quick Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
        { question: "Quick Sort is based on which algorithmic paradigm?", options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"], answer: "Divide and Conquer" },
        { question: "Which sorting algorithm generally performs better: Quick Sort or Bubble Sort?", options: ["Quick Sort", "Bubble Sort", "Both are the same", "Depends on the dataset"], answer: "Quick Sort" },
        { question: "In the worst case, Quick Sort behaves like which sorting algorithm?", options: ["Merge Sort", "Selection Sort", "Bubble Sort", "Insertion Sort"], answer: "Bubble Sort" },
        { question: "Which partitioning method is commonly used in Quick Sort?", options: ["Hoare Partition", "Lomuto Partition", "Radix Partition", "Heap Partition"], answer: "Lomuto Partition" },
        { question: "What is the best-case time complexity of Quick Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n log n)" },
        { question: "Quick Sort is typically implemented using which data structure?", options: ["Queue", "Stack", "Graph", "Linked List"], answer: "Stack" },
        { question: "Which operation is primarily performed in Quick Sort?", options: ["Swapping", "Merging", "Counting", "Heapifying"], answer: "Swapping" },
        { question: "What type of sorting algorithm is Quick Sort?", options: ["Stable", "Unstable", "Non-comparative", "Parallel"], answer: "Unstable" },
        { question: "Why is Quick Sort preferred over Merge Sort for arrays?", options: ["Less memory usage", "Better average performance", "Easier to implement", "All of the above"], answer: "All of the above" }
    ]
    ,
    "Merge Sort": [
        { question: "What is the average-case time complexity of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n log n)" },
        { question: "Merge Sort is based on which algorithmic paradigm?", options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"], answer: "Divide and Conquer" },
        { question: "What is the worst-case time complexity of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n log n)" },
        { question: "Which sorting algorithm is generally faster for larger datasets?", options: ["Merge Sort", "Bubble Sort", "Selection Sort", "Insertion Sort"], answer: "Merge Sort" },
        { question: "Merge Sort is typically implemented using which data structure?", options: ["Queue", "Stack", "Graph", "Array"], answer: "Array" },
        { question: "What is the best-case time complexity of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n log n)" },
        { question: "Merge Sort is more efficient than Quick Sort when dealing with which type of data?", options: ["Random data", "Already sorted data", "Linked lists", "Small datasets"], answer: "Linked lists" },
        { question: "How does Merge Sort divide the input array?", options: ["By selecting a pivot", "Into two equal halves", "By selecting smallest element", "Randomly"], answer: "Into two equal halves" },
        { question: "Merge Sort is a ___ sorting algorithm.", options: ["Stable", "Unstable", "Non-comparative", "Parallel"], answer: "Stable" },
        { question: "How many subarrays are formed in each recursive call of Merge Sort?", options: ["1", "2", "3", "Depends on input"], answer: "2" },
        { question: "What is the space complexity of Merge Sort?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: "O(n)" },
        { question: "Which sorting algorithm is best suited for external sorting (large datasets that don't fit in memory)?", options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Heap Sort"], answer: "Merge Sort" }
    ]
    ,
    "Selection Sort": [
        { question: "What is the average-case time complexity of Selection Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
        { question: "Selection Sort is based on which algorithmic approach?", options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"], answer: "Greedy" },
        { question: "What is the worst-case time complexity of Selection Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
        { question: "How many swaps are required in the worst case of Selection Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n)" },
        { question: "Which sorting algorithm is similar to Selection Sort in terms of time complexity?", options: ["Merge Sort", "Bubble Sort", "Heap Sort", "Quick Sort"], answer: "Bubble Sort" },
        { question: "What is the best-case time complexity of Selection Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
        { question: "Selection Sort is a ___ sorting algorithm.", options: ["Stable", "Unstable", "Non-comparative", "Parallel"], answer: "Unstable" },
        { question: "Which of the following sorting algorithms performs the least number of swaps?", options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"], answer: "Selection Sort" },
        { question: "What is the space complexity of Selection Sort?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: "O(1)" },
        { question: "Which element does Selection Sort pick during each pass?", options: ["Largest element", "Smallest element", "Middle element", "Random element"], answer: "Smallest element" },
        { question: "In Selection Sort, how many passes are required to sort an array of n elements?", options: ["O(n)", "O(n-1)", "O(log n)", "O(n log n)"], answer: "O(n-1)" },
        { question: "Which of the following is a drawback of Selection Sort?", options: ["Uses extra memory", "Has high time complexity", "Requires recursion", "Works only on linked lists"], answer: "Has high time complexity" }
    ]
    ,
    "Insertion Sort": [
        { question: "What is the average-case time complexity of Insertion Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
        { question: "Insertion Sort is based on which algorithmic approach?", options: ["Divide and Conquer", "Greedy", "Incremental", "Backtracking"], answer: "Incremental" },
        { question: "What is the worst-case time complexity of Insertion Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
        { question: "Which sorting algorithm is similar to Insertion Sort in terms of best-case time complexity?", options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Selection Sort"], answer: "Bubble Sort" },
        { question: "What is the best-case time complexity of Insertion Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n)" },
        { question: "Insertion Sort is a ___ sorting algorithm.", options: ["Stable", "Unstable", "Non-comparative", "Parallel"], answer: "Stable" },
        { question: "Insertion Sort works efficiently on which type of data?", options: ["Large datasets", "Random data", "Nearly sorted data", "All datasets"], answer: "Nearly sorted data" },
        { question: "What is the space complexity of Insertion Sort?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: "O(1)" },
        { question: "Which of the following is true about Insertion Sort?", options: ["It is recursive", "It is an in-place sorting algorithm", "It requires extra memory", "It does not work on small datasets"], answer: "It is an in-place sorting algorithm" },
        { question: "Insertion Sort inserts elements into the ___ position in the sorted part of the array.", options: ["First", "Correct", "Last", "Random"], answer: "Correct" },
        { question: "How many swaps does Insertion Sort perform in the best case?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"], answer: "O(1)" },
        { question: "Which of the following sorting algorithms performs better than Insertion Sort for large datasets?", options: ["Bubble Sort", "Selection Sort", "Merge Sort", "None"], answer: "Merge Sort" }
    ]
    ,
    "Searching (Linear & Binary)": [
        { question: "What is the worst-case time complexity of Linear Search?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], answer: "O(n)" },
        { question: "What is the best-case time complexity of Linear Search?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], answer: "O(1)" },
        { question: "Which search algorithm is more efficient for sorted arrays?", options: ["Linear Search", "Binary Search", "Both are same", "Depends on input"], answer: "Binary Search" },
        { question: "What is the worst-case time complexity of Binary Search?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], answer: "O(log n)" },
        { question: "Binary Search works on which type of data?", options: ["Unsorted", "Sorted", "Both", "Depends on implementation"], answer: "Sorted" },
        { question: "Linear Search is best suited for which scenario?", options: ["Small datasets", "Large datasets", "Sorted arrays", "Tree structures"], answer: "Small datasets" },
        { question: "What is the best-case time complexity of Binary Search?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: "O(1)" },
        { question: "Binary Search follows which algorithmic paradigm?", options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"], answer: "Divide and Conquer" },
        { question: "Which searching algorithm does not require sorted data?", options: ["Binary Search", "Linear Search", "Both", "None"], answer: "Linear Search" },
        { question: "How many comparisons does Binary Search make in the worst case for an array of size n?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: "O(log n)" },
        { question: "Which search algorithm is generally faster for a large dataset?", options: ["Linear Search", "Binary Search", "Both are same", "Depends on input"], answer: "Binary Search" },
        { question: "What is the space complexity of Binary Search in an iterative implementation?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: "O(1)" }
    ]

};
const startQuiz = () => {
    const num = parseInt(numQuestions.value);
    const cat = category.value;

    // Make a deep copy of the question set to avoid modifying the original
    let questionSet = [...questionBank[cat]];

    // Shuffle questions using Fisher-Yates algorithm
    for (let i = questionSet.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [questionSet[i], questionSet[j]] = [questionSet[j], questionSet[i]];
    }

    // Select the first 'num' questions
    questions = questionSet.slice(0, num);

    startScreen.classList.add("hide");
    quiz.classList.remove("hide");
    currentQuestion = 0;
    showQuestion(questions[currentQuestion]);
};


startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
        answersWrapper = document.querySelector(".answer-wrapper"),
        questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;
    answersWrapper.innerHTML = "";

    question.options.forEach((option) => {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");
        answerDiv.innerHTML = `<span class="text">${option}</span>
                               <span class="checkbox"><i class="fas fa-check"></i></span>`;
        answerDiv.addEventListener("click", () => {
            document.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
            answerDiv.classList.add("selected");
            submitBtn.disabled = false;
        });
        answersWrapper.appendChild(answerDiv);
    });

    questionNumber.innerHTML = ` Question <span class="current">${currentQuestion + 1}</span>
            <span class="total">/${questions.length}</span>`;

    time = parseInt(timePerQuestion.value);
    startTimer(time);
};

const startTimer = (time) => {
    timer = setInterval(() => {
        if (time >= 0) {
            progress(time);
            time--;
        } else {
            checkAnswer(true);
        }
    }, 1000);
};

const checkAnswer = (timeOut = false) => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    const correctAnswer = questions[currentQuestion].answer;

    if (selectedAnswer) {
        const userAnswer = selectedAnswer.querySelector(".text").innerText;
        if (userAnswer === correctAnswer) {
            selectedAnswer.classList.add("correct");
            score++;
        } else {
            selectedAnswer.classList.add("wrong");
        }
    }

    document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerText === correctAnswer) {
            answer.classList.add("correct");
        }
    });

    document.querySelectorAll(".answer").forEach((answer) => answer.classList.add("checked"));
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

submitBtn.addEventListener("click", () => checkAnswer(false));
nextBtn.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(questions[currentQuestion]);
        submitBtn.style.display = "block";
        nextBtn.style.display = "none";
    } else {
        showScore();
    }
});

const showScore = () => {
    document.querySelector(".end-screen").classList.remove("hide");
    quiz.classList.add("hide");
    document.querySelector(".final-score").innerHTML = score;
    document.querySelector(".total-score").innerHTML = `/ ${questions.length}`;
};

document.querySelector(".restart").addEventListener("click", () => {
    window.location.reload();
});
