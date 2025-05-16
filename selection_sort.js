let array = [];
let delay = 1000;

let delayElement = document.querySelector('#speed_input');

delayElement.addEventListener('input', function () {
    const minSpeed = 100;
    const maxSpeed = 3000;
    const value = parseInt(delayElement.value);
    delay = maxSpeed - (value - minSpeed);  // Inverse mapping: higher slider = faster
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
    logic += '    let minIndex = i;\n';
    logic += '    for (let j = i + 1; j < n; j++) {\n';
    logic += '      if (arr[j] < arr[minIndex]) {\n';
    logic += '        minIndex = j;\n';
    logic += '      }\n';
    logic += '    }\n';
    logic += '    if (minIndex !== i) {\n';
    logic += '      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];\n';
    logic += '    }\n';
    logic += '  }\n';
    logic += '  return arr;\n';
    logic += '}\n';
    document.getElementById('logicText').textContent = logic;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        boxes[i].classList.add('compare');
        (boxes[i].children)[1].textContent = `i: ${i}`;
        (boxes[i].children)[1].classList.add('icompare');

        boxes[minIndex].classList.add('minimum');
        await sleep(delay);

        for (let j = i + 1; j < n; j++) {
            boxes[j].classList.add('compare');
            (boxes[j].children)[1].textContent = `j: ${j}`;
            (boxes[j].children)[1].classList.add('icompare');

            document.getElementById("status").innerHTML = `Comparing ${array[j]} and ${array[minIndex]}<br>`;

            await sleep(delay);

            if (array[j] < array[minIndex]) {
                boxes[minIndex].classList.remove('minimum');

                minIndex = j;

                // Mark the new minimum
                boxes[minIndex].classList.add('minimum');
                document.getElementById("status").innerHTML += `New minimum found: ${array[j]} at index ${j}<br>`;
                await sleep(2500); // ✅ Show minimum highlight for 1 second

            }

            boxes[j].classList.remove('compare');
            (boxes[j].children)[1].classList.remove('icompare');
        }

        if (minIndex !== i) {
            boxes[i].classList.add('swap');
            boxes[minIndex].classList.add('swap');
            boxes[minIndex].classList.remove('minimum');

            document.getElementById("status").innerHTML = `Swapping ${array[i]} and ${array[minIndex]}<br>`;

            await sleep(1000);

            [array[i], array[minIndex]] = [array[minIndex], array[i]];

            boxes[i].querySelector('.content').textContent = array[i];
            boxes[minIndex].querySelector('.content').textContent = array[minIndex];

            await sleep(delay);

            boxes[i].classList.remove('swap');
            boxes[minIndex].classList.remove('swap');

            document.getElementById("status").innerHTML += `Swapped positions ${i} and ${minIndex}<br>`;
        }

        boxes[i].classList.remove('compare', 'minimum');
        (boxes[i].children)[1].classList.remove('icompare');
        if (minIndex !== i) {
            boxes[minIndex].classList.remove('compare', 'minimum');
            (boxes[minIndex].children)[1].classList.remove('icompare');
        }

        boxes[i].classList.add('sorted');
        boxes[i].classList.remove('unsorted');

        await sleep(delay / 2);
    }

    boxes[n - 1].classList.add('sorted');
    boxes[n - 1].classList.remove('unsorted');

    for (let k = 0; k < n; k++) {
        boxes[k].classList.remove('compare', 'minimum', 'swap', 'unsorted');
        boxes[k].classList.add('sorted');
    }

    document.getElementById("status").innerHTML = "Sorting Complete!";
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}