let array = [];
let isPaused = false;
let delay = 500;
let stepCount = 0;

function generateArray() {
    let size = document.getElementById("arraySize").value;
    if (size < 2 || size > 20) {
        alert("Array size must be between 2 and 20.");
        return;
    }
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100));
    }
    displayArray();
    //resetCounters();
}

function useCustomArray() {
    const input = document.getElementById("arrayElements").value;
    if (!input) {
        alert("Please enter numbers separated by commas.");
        return;
    }
    array = input.split(",").map(Number).filter(num => !isNaN(num));
    if (array.length < 2 || array.length > 20) {
        alert("Array size must be between 2 and 20.");
        return;
    }
    displayArray();
    // resetCounters();
}

function displayArray(highlightedIndices = [], color = "#66ccff", enlargedIndices = []) {
    const container = document.getElementById("arrayContainer");
    container.innerHTML = "";
    array.forEach((value, index) => {
        let div = document.createElement("div");
        div.className = "box";
        div.innerText = value;
        if (highlightedIndices.includes(index)) {
            div.style.backgroundColor = color;
        }
        if (enlargedIndices.includes(index)) {
            div.classList.add("enlarged");
        }
        container.appendChild(div);
    });
}

async function startMergeSort() {
    if (array.length === 0) {
        alert("Please generate or provide an array first.");
        return;
    }
    isPaused = false;
    //resetCounters();
    document.getElementById("status").innerText = "Starting Merge Sort...";
    //updateStep("Starting Merge Sort");
    await mergeSort(array, 0, array.length - 1);
    if (!isPaused) {
        document.getElementById("status").innerText = "Sorting Complete!";
        //updateStep("Sorting Complete");
        displayArray([...Array(array.length).keys()], "#66ff66"); // Highlight all as sorted
    }
}

async function mergeSort(arr, l, r) {
    if (l < r && !isPaused) {
        let m = Math.floor((l + r) / 2);

        // Show dividing step
        const divideMessage = `Dividing: [${arr.slice(l, r + 1).join(", ")}]`;
        document.getElementById("status").innerText = divideMessage;
        //updateStep(divideMessage);

        // Highlight and enlarge the current subarray
        let currentIndices = [...Array.from({ length: r - l + 1 }, (_, idx) => idx + l)];
        displayArray(currentIndices, "#ffcc00", currentIndices);
        await sleep(delay);

        // Recursively sort first and second halves
        await mergeSort(arr, l, m);
        await mergeSort(arr, m + 1, r);

        // Merge the sorted halves
        await merge(arr, l, m, r);
    }
}

async function merge(arr, l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    const leftIndices = Array.from({ length: left.length }, (_, idx) => idx + l);
    const rightIndices = Array.from({ length: right.length }, (_, idx) => idx + m + 1);
    const allIndices = [...leftIndices, ...rightIndices];

    const mergeMessage = `Merging: Left [${left.join(", ")}] and Right [${right.join(", ")}]`;
    document.getElementById("status").innerText = mergeMessage;
    //updateStep(mergeMessage);

    // Highlight and enlarge the subarrays being merged
    displayArray(allIndices, "#00cc66", allIndices);
    await sleep(delay);

    while (i < left.length && j < right.length && !isPaused) {
        // Highlight the elements being compared
        const compareMessage = `Comparing: ${left[i]} and ${right[j]}`;
        document.getElementById("status").innerText = compareMessage;
        //updateStep(compareMessage);

        // Highlight in red the elements being compared
        displayArray([l + i, m + 1 + j], "#ff6666", allIndices);
        await sleep(delay);

        if (left[i] < right[j]) {
            arr[k] = left[i];
            const placeMessage = `Placing ${left[i]} at position ${k}`;
            document.getElementById("status").innerText = placeMessage;
            //updateStep(placeMessage);
            i++;
        } else {
            arr[k] = right[j];
            const placeMessage = `Placing ${right[j]} at position ${k}`;
            document.getElementById("status").innerText = placeMessage;
            //updateStep(placeMessage);
            j++;
        }

        // Show the placement
        displayArray([k], "#66ccff", allIndices);
        await sleep(delay);
        k++;
    }

    // Copy remaining elements from left array
    while (i < left.length && !isPaused) {
        arr[k] = left[i];
        const placeMessage = `Placing remaining ${left[i]} from left array at position ${k}`;
        document.getElementById("status").innerText = placeMessage;
        //updateStep(placeMessage);

        displayArray([k], "#66ccff", allIndices);
        await sleep(delay);
        i++;
        k++;
    }

    // Copy remaining elements from right array
    while (j < right.length && !isPaused) {
        arr[k] = right[j];
        const placeMessage = `Placing remaining ${right[j]} from right array at position ${k}`;
        document.getElementById("status").innerText = placeMessage;
        //updateStep(placeMessage);

        displayArray([k], "#66ccff", allIndices);
        await sleep(delay);
        j++;
        k++;
    }

    if (!isPaused) {
        const mergedMessage = `Merged: [${arr.slice(l, r + 1).join(", ")}]`;
        document.getElementById("status").innerText = mergedMessage;
        //updateStep(mergedMessage);

        // Show the merged result
        displayArray(Array.from({ length: r - l + 1 }, (_, idx) => idx + l), "#00cc66");
        await sleep(delay);

        // Return to normal display
        displayArray();
    }
}

function pauseSort() {
    isPaused = true;
    document.getElementById("status").innerText = "Paused";
    //updateStep("Sorting Paused");
}

function resumeSort() {
    if (isPaused) {
        isPaused = false;
        document.getElementById("status").innerText = "Resuming...";
        //updateStep("Resuming Sort");
        startMergeSort();
    }
}

function reset() {
    location.reload();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStep(description) {
    stepCount++;
    document.getElementById("stepCount").innerText = stepCount;
}

function resetCounters() {
    stepCount = 0;
    document.getElementById("stepCount").innerText = "0";
}

// Initialize speed display
document.getElementById("speed").addEventListener("input", (e) => {
    delay = 2000 - e.target.value;
    document.getElementById("speedValue").innerText = `${delay}ms`;
});

// Set initial speed display value
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("speedValue").innerText = `${delay}ms`;
});