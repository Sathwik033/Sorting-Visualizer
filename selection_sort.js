let array = [];
let delay = 500;

let delayElement = document.querySelector('#speed_input');
delayElement.addEventListener('input', function () {
    delay = 2500 - parseInt(delayElement.value);
});

document.getElementById('createArray').addEventListener('click', () => {
    const size = document.getElementById('arraySize').value;
    const elementsInput = document.getElementById('arrayElements').value;

    // Generate array from user input if provided, otherwise create random array
    if (elementsInput) {
        array = elementsInput.split(',').map(Number);
        if (array.length > size) {
            array = array.slice(0, size);
        }
    } else {
        array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    }

    displayArray();
});

function displayArray() {
    const container = document.getElementById('arrayBoxes');
    container.innerHTML = '';

    array.forEach((value) => {
        const box = document.createElement('div');
        box.classList.add('box', 'unsorted');
        const content = document.createElement('div');
        content.textContent = value;
        content.classList.add('content');
        const innerBox = document.createElement('div');
        innerBox.textContent = array.indexOf(value);
        innerBox.classList.add('innerbox');
        box.appendChild(content);
        box.appendChild(innerBox);
        container.appendChild(box);
    });
}

document.getElementById('startSort').addEventListener('click', async () => {
    await selectionSort();
});

async function selectionSort() {
    const boxes = document.querySelectorAll('.box');
    let n = array.length;

    // Selection sort logic to display
    let logic = '';
    logic += 'function selectionSort(arr) {\n';
    logic += '  const n = arr.length;\n';
    logic += '  for (let i = 0; i < n - 1; i++) {\n';
    logic += '    // Find the minimum element in the unsorted portion\n';
    logic += '    let minIndex = i;\n';
    logic += '    for (let j = i + 1; j < n; j++) {\n';
    logic += '      if (arr[j] < arr[minIndex]) {\n';
    logic += '        minIndex = j;\n';
    logic += '      }\n';
    logic += '    }\n';
    logic += '    // Swap the minimum element with the first element of unsorted portion\n';
    logic += '    if (minIndex !== i) {\n';
    logic += '      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];\n';
    logic += '    }\n';
    logic += '  }\n';
    logic += '  return arr;\n';
    logic += '}\n';
    document.getElementById('logicText').textContent = logic;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        // Mark the current position
        boxes[i].classList.add('compare');
        (boxes[i].children)[1].textContent = `i: ${i}`;
        (boxes[i].children)[1].classList.add('icompare');

        // Initially mark the first element as minimum
        boxes[minIndex].classList.add('minimum');
        await sleep(delay);

        // Find the minimum element in the remaining unsorted array
        for (let j = i + 1; j < n; j++) {
            boxes[j].classList.add('compare');
            (boxes[j].children)[1].textContent = `j: ${j}`;
            (boxes[j].children)[1].classList.add('icompare');

            await sleep(delay);

            if (array[j] < array[minIndex]) {
                // Remove minimum class from previous min
                boxes[minIndex].classList.remove('minimum');

                // Update minimum index
                minIndex = j;

                // Mark the new minimum
                boxes[minIndex].classList.add('minimum');

                await sleep(delay / 2);
            }

            // Remove comparison highlight
            boxes[j].classList.remove('compare');
            (boxes[j].children)[1].classList.remove('icompare');
        }

        // If the minimum is not the current position, swap them
        if (minIndex !== i) {
            // Mark elements to be swapped
            boxes[i].classList.add('swap');
            boxes[minIndex].classList.add('swap');
            boxes[minIndex].classList.remove('minimum');

            await sleep(delay);

            // Swap elements in the array
            [array[i], array[minIndex]] = [array[minIndex], array[i]];

            // Update the box content to reflect swapped values
            boxes[i].querySelector('.content').textContent = array[i];
            boxes[minIndex].querySelector('.content').textContent = array[minIndex];

            await sleep(delay);

            // Remove swap highlighting
            boxes[i].classList.remove('swap');
            boxes[minIndex].classList.remove('swap');
        }

        // Remove any remaining comparison or minimum highlights
        boxes[i].classList.remove('compare', 'minimum');
        (boxes[i].children)[1].classList.remove('icompare');
        if (minIndex !== i) {
            boxes[minIndex].classList.remove('compare', 'minimum');
            (boxes[minIndex].children)[1].classList.remove('icompare');
        }

        // Mark current position as sorted
        boxes[i].classList.add('sorted');
        boxes[i].classList.remove('unsorted');

        await sleep(delay / 2);
    }

    // Mark the last element as sorted
    boxes[n - 1].classList.add('sorted');
    boxes[n - 1].classList.remove('unsorted');

    // Ensure all elements are marked as sorted (just to be safe)
    for (let k = 0; k < n; k++) {
        boxes[k].classList.remove('compare', 'minimum', 'swap', 'unsorted');
        boxes[k].classList.add('sorted');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}