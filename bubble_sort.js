let array = [];

let delay = 500;


let delayElement = document.querySelector('#speed_input');
delayElement.addEventListener('input', function () {
    console.log(delayElement.value, typeof (delayElement.value));
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
        box.classList.add('box', 'unsorted', 'box-creation'); // Add animation class
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
    await bubbleSort();
});

async function bubbleSort() {
    const boxes = document.querySelectorAll('.box');
    let n = array.length;

    // Bubble sort logic to display
    let logic = '';
    logic += 'for (let i = 0; i < n - 1; i++) {\n';
    logic += '  for (let j = 0; j < n - i - 1; j++) {\n';
    logic += '    if (array[j] > array[j + 1]) {\n';
    logic += '      [array[j], array[j + 1]] = [array[j + 1], array[j]];\n';
    logic += '    }\n';
    logic += '  }\n';
    logic += '}\n';
    document.getElementById('logicText').textContent = logic;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Compare boxes
            boxes[j].classList.add('compare');
            boxes[j + 1].classList.add('compare');
            (boxes[j].children)[1].textContent = `i: ${i}`;
            (boxes[j + 1].children)[1].textContent = `j: ${j}`;
            (boxes[j].children)[1].classList.add('icompare');
            (boxes[j + 1].children)[1].classList.add('icompare');

            await sleep(delay); // Delay for visualization

            if (array[j] > array[j + 1]) {
                // Swap elements in the array
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Update the box content to reflect swapped values
                boxes[j].querySelector('.content').textContent = array[j];
                boxes[j + 1].querySelector('.content').textContent = array[j + 1];

                boxes[j].classList.add('swap');
                boxes[j + 1].classList.add('swap');
                boxes[j].classList.remove('compare');
                boxes[j + 1].classList.remove('compare');
                await sleep(500); // Pause to show swap effect
                boxes[j].classList.remove('swap');
                boxes[j + 1].classList.remove('swap');
            }

            // Reset highlight
            boxes[j].classList.remove('compare');
            boxes[j + 1].classList.remove('compare');
            (boxes[j].children)[1].classList.remove('icompare');
            (boxes[j + 1].children)[1].classList.remove('icompare');
        }
        boxes[n - i - 1].classList.add('sorted'); // Mark the last element as sorted
        boxes[n - i - 1].classList.remove('unsorted');
    }
    boxes[0].classList.add('sorted'); // Mark the last element as sorted
    boxes[0].classList.remove('unsorted');


    // Ensure all elements are marked as sorted
    for (let k = 0; k < n; k++) {
        boxes[k].classList.remove('compare');
        boxes[k].classList.add('sorted');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
