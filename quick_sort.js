let array = [];
let isPaused = false;
let delay = 1000;
let sortedIndices = [];
let currentI = -1;
let currentJ = -1;

function generateArray() {
    let size = document.getElementById("arraySize").value;
    if (size < 2 || size > 20) {
        alert("Array size must be between 2 and 20.");
        return;
    }
    array = [];
    sortedIndices = [];
    currentI = -1;
    currentJ = -1;
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100));
    }
    displayArray();
    document.getElementById("status").innerText = "Random array generated. Ready to sort.";
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
    sortedIndices = [];
    currentI = -1;
    currentJ = -1;
    displayArray();
    document.getElementById("status").innerText = "Custom array loaded. Ready to sort.";
}

function displayArray(highlightedIndices = [], color = "#66ccff", pivotIndex = -1) {
    const container = document.getElementById("arrayContainer");
    container.innerHTML = "";

    array.forEach((value, index) => {
        // Create a container for each array element
        let elementContainer = document.createElement("div");
        elementContainer.className = "array-element";

        // Create the box for the value
        let box = document.createElement("div");
        box.className = "box";
        box.innerText = value;

        // Determine box color based on various conditions
        if (sortedIndices.includes(index)) {
            box.style.backgroundColor = "#66ff66"; // Sorted color
        } else if (highlightedIndices.includes(index)) {
            box.style.backgroundColor = color; // Highlight elements being swapped
        } else if (index === pivotIndex) {
            box.style.backgroundColor = "#ff6666"; // Highlight pivot element
        } else {
            box.style.backgroundColor = "#66ccff"; // Default color
        }

        // If this is the current i or j, add a special border
        if (index === currentI) {
            box.style.borderColor = "#9c27b0";
            box.style.borderWidth = "3px";
        } else if (index === currentJ) {
            box.style.borderColor = "#ff9800";
            box.style.borderWidth = "3px";
        }

        // Add the box to the container
        elementContainer.appendChild(box);

        // Add index label
        let indexLabel = document.createElement("div");
        indexLabel.className = "index-label";
        indexLabel.innerText = `[${index}]`;
        elementContainer.appendChild(indexLabel);

        // Add pointer labels if applicable
        if (index === currentI) {
            let pointer = document.createElement("div");
            pointer.className = "pointer";
            pointer.innerText = "i";
            pointer.style.backgroundColor = "#9c27b0";
            elementContainer.appendChild(pointer);
        } else if (index === currentJ) {
            let pointer = document.createElement("div");
            pointer.className = "pointer";
            pointer.innerText = "j";
            pointer.style.backgroundColor = "#ff9800";
            elementContainer.appendChild(pointer);
        }

        // Add the element container to the main container
        container.appendChild(elementContainer);
    });
}

async function startQuickSort() {
    if (array.length === 0) {
        alert("Please generate or provide an array first.");
        return;
    }
    isPaused = false;
    sortedIndices = [];
    document.getElementById("status").innerText = "Starting Quick Sort...";
    await quickSort(array, 0, array.length - 1);
    if (!isPaused) {
        document.getElementById("status").innerText = "Sorting Complete!";
        currentI = -1;
        currentJ = -1;
        displayArray([...Array(array.length).keys()], "#66ff66");
    }
}

async function quickSort(arr, low, high) {
    if (low < high && !isPaused) {
        document.getElementById("status").innerText = `Sorting subarray from index ${low} to ${high}`;
        await sleep(delay / 2);

        let pi = await partition(arr, low, high);
        sortedIndices.push(pi);

        document.getElementById("status").innerText = `Pivot (${arr[pi]}) is now in its correct position at index ${pi}`;
        displayArray([], "#66ccff", pi);
        await sleep(delay);

        document.getElementById("status").innerText = `Recursively sorting left subarray (${low} to ${pi - 1})`;
        await sleep(delay / 2);
        await quickSort(arr, low, pi - 1);

        document.getElementById("status").innerText = `Recursively sorting right subarray (${pi + 1} to ${high})`;
        await sleep(delay / 2);
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    currentI = i;

    document.getElementById("status").innerText = `Partitioning: Pivot = ${pivot} at index ${high}`;
    displayArray([], "#66ccff", high);
    await sleep(delay);

    for (let j = low; j < high; j++) {
        if (isPaused) break;

        currentJ = j;
        document.getElementById("status").innerText = `Comparing: arr[${j}] = ${arr[j]} with Pivot = ${pivot}`;
        displayArray([], "#66ccff", high);
        await sleep(delay);

        if (arr[j] < pivot) {
            i++;
            currentI = i;

            document.getElementById("status").innerText = `${arr[j]} < ${pivot}, so increment i to ${i} and swap arr[${i}] = ${arr[i]} with arr[${j}] = ${arr[j]}`;
            displayArray([i, j], "#ffcc00", high);
            await sleep(delay);

            [arr[i], arr[j]] = [arr[j], arr[i]];
            displayArray([i, j], "#ffcc00", high);
            await sleep(delay);
        } else {
            document.getElementById("status").innerText = `${arr[j]} >= ${pivot}, so no swap needed`;
            await sleep(delay / 2);
        }
    }

    document.getElementById("status").innerText = `Placing Pivot = ${pivot} in its correct position by swapping with index ${i + 1}`;
    displayArray([i + 1, high], "#ffcc00", high);
    await sleep(delay);

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    currentI = i + 1;
    currentJ = -1;

    displayArray([i + 1], "#ffcc00", -1);
    await sleep(delay);

    return i + 1;
}

function pauseSort() {
    isPaused = true;
    document.getElementById("status").innerText = "Sorting Paused";
}

function resumeSort() {
    if (isPaused) {
        isPaused = false;
        document.getElementById("status").innerText = "Resuming Sort...";
        startQuickSort();
    }
}


function reset() {
    location.reload();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("speed").addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    delay = 3100 - value; // Now supports slower speeds
});
