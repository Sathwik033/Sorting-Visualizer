let array = [];

let delay = 500;

let delayElement = document.querySelector('#speed_input');
delayElement.addEventListener('input', function () {
    delay = 2500 - parseInt(delayElement.value);
});

document.getElementById('createArray').addEventListener('click', () => {
    const size = document.getElementById('arraySize').value;
    const elementsInput = document.getElementById('arrayElements').value;
    if (size < 2 || size > 20) {
        alert("Array size must be between 2 and 20.");
        return;
    }
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

    array.forEach((value, index) => {
        const box = document.createElement('div');
        box.classList.add('box', 'unsorted');
        const content = document.createElement('div');
        content.textContent = value;
        content.classList.add('content');
        const innerBox = document.createElement('div');
        innerBox.textContent = index; // ✅ Use correct index here
        innerBox.classList.add('innerbox');
        box.appendChild(content);
        box.appendChild(innerBox);
        container.appendChild(box);
    });
}


document.getElementById('startSort').addEventListener('click', async () => {
    await insertionSort();
});

async function insertionSort() {
    const boxes = document.querySelectorAll('.box');
    let n = array.length;

    let logic = '';
    logic += 'for (let i = 1; i < n; i++) {\n';
    logic += '  let key = array[i];\n';
    logic += '  let j = i - 1;\n';
    logic += '  while (j >= 0 && array[j] > key) {\n';
    logic += '    array[j + 1] = array[j];\n';
    logic += '    j--;\n';
    logic += '  }\n';
    logic += '  array[j + 1] = key;\n';
    logic += '}\n';
    document.getElementById('logicText').textContent = logic;

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        document.getElementById("status").innerHTML = `Current key: ${key} (at index ${i})<br>`;

        boxes[i].classList.add('compare');
        boxes[i].children[1].textContent = `i: ${i}`;
        boxes[i].children[1].classList.add('icompare');

        await sleep(delay);

        while (j >= 0 && array[j] > key) {
            document.getElementById("status").innerHTML += `Comparing ${array[j]} and ${key} → Shifting ${array[j]}<br>`;

            boxes[j].classList.add('compare');
            boxes[j].children[1].textContent = `j: ${j}`;
            boxes[j].children[1].classList.add('icompare');

            await sleep(delay);

            array[j + 1] = array[j];
            boxes[j + 1].querySelector('.content').textContent = array[j];

            boxes[j].classList.remove('compare');
            boxes[j].children[1].classList.remove('icompare');

            j--;
        }

        array[j + 1] = key;
        boxes[j + 1].querySelector('.content').textContent = key;

        document.getElementById("status").innerHTML += `Inserting ${key} at position ${j + 1}<br>`;

        await sleep(delay);

        boxes[i].classList.remove('compare');
        boxes[i].children[1].classList.remove('icompare');

        for (let k = 0; k <= i; k++) {
            boxes[k].classList.add('sorted');
            boxes[k].classList.remove('unsorted');
        }
    }

    boxes.forEach(box => box.classList.add('sorted'));
    document.getElementById("status").innerHTML = "Sorting Complete!";
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
