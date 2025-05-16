let array = [];

let delay = 500;


let delayElement = document.querySelector('#speed_input');

// Makes left slow and right fast
delayElement.addEventListener('input', function () {
    // Smaller value = slower speed, so inverse the delay
    const maxDelay = 2000;
    const minDelay = 100;
    const inputValue = parseInt(delayElement.value);
    delay = maxDelay - (inputValue - minDelay);
});




document.getElementById('createArray').addEventListener('click', () => {
    const size = document.getElementById('arraySize').value;
    const elementsInput = document.getElementById('arrayElements').value;
    if (size < 2 || size > 20) {
        alert("Array size must be between 2 and 20.");
        return;
    }
    // Generate array from user input if provided, otherwise create random array
    if (elementsInput) {
        array = elementsInput.split(',').map(Number).filter(num => !isNaN(num));
        if (array.length > size) {
            array = array.slice(0, size);
        }
    } else {
        array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    }

    displayArray();
});
document.getElementById('resetButton').addEventListener('click', () => {
    location.reload();
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

            document.getElementById("status").innerText = `Comparing ${array[j]} and ${array[j + 1]}`;
            await sleep(delay); // Delay for visualization

            if (array[j] > array[j + 1]) {
                document.getElementById("status").innerText = `Swapping ${array[j]} and ${array[j + 1]}`;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                boxes[j].querySelector('.content').textContent = array[j];
                boxes[j + 1].querySelector('.content').textContent = array[j + 1];

                boxes[j].classList.add('swap');
                boxes[j + 1].classList.add('swap');
                boxes[j].classList.remove('compare');
                boxes[j + 1].classList.remove('compare');
                await sleep(1000); // Pause to show swap effect
                boxes[j].classList.remove('swap');
                boxes[j + 1].classList.remove('swap');
            }

            boxes[j].classList.remove('compare');
            boxes[j + 1].classList.remove('compare');
            (boxes[j].children)[1].classList.remove('icompare');
            (boxes[j + 1].children)[1].classList.remove('icompare');
        }
        boxes[n - i - 1].classList.add('sorted');
        boxes[n - i - 1].classList.remove('unsorted');
    }

    boxes[0].classList.add('sorted');
    boxes[0].classList.remove('unsorted');

    for (let k = 0; k < n; k++) {
        boxes[k].classList.remove('compare');
        boxes[k].classList.add('sorted');
    }

    document.getElementById("status").innerText = "Sorting Complete!";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
