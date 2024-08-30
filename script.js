const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
});

function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    input.value = formatter.format(value);
}

document.getElementById('rate').addEventListener('input', function () {
    formatCurrency(this);
});

document.getElementById('additional').addEventListener('input', function () {
    formatCurrency(this);
});

document.getElementById('complexity').addEventListener('input', function () {
    document.getElementById('complexityValue').textContent = this.value;
});

function validateInput(input, errorElementId) {
    const value = parseFloat(input.value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    const errorElement = document.getElementById(errorElementId);

    if (isNaN(value) || value < 0) {
        input.classList.add('error');
        errorElement.textContent = 'Por favor, insira um valor válido.';
        return false;
    } else {
        input.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }
}

function calculatePrice() {
    const hoursInput = document.getElementById('hours');
    const rateInput = document.getElementById('rate');
    const additionalInput = document.getElementById('additional');

    const isHoursValid = validateInput(hoursInput, 'hoursError');
    const isRateValid = validateInput(rateInput, 'rateError');
    const isAdditionalValid = validateInput(additionalInput, 'additionalError');

    if (!isHoursValid || !isRateValid || !isAdditionalValid) {
        return;
    }

    const hours = parseFloat(hoursInput.value);
    const rate = parseFloat(rateInput.value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    const complexity = parseFloat(document.getElementById('complexity').value);
    const additional = parseFloat(additionalInput.value.replace(/[^\d,.-]/g, '').replace(',', '.'));

    const basePrice = hours * rate;
    const complexityFactor = complexity * 0.2 + 1; // 1, 1.2, 1.4, 1.6, 1.8
    const totalPrice = (basePrice * complexityFactor) + additional;

    const resultElement = document.getElementById('result');
    resultElement.textContent = formatter.format(totalPrice);
    resultElement.classList.add('show');

    saveToLocalStorage();
}

function saveToLocalStorage() {
    const data = {
        hours: document.getElementById('hours').value,
        rate: document.getElementById('rate').value,
        complexity: document.getElementById('complexity').value,
        additional: document.getElementById('additional').value
    };
    localStorage.setItem('calculatorData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('calculatorData'));
    if (data) {
        document.getElementById('hours').value = data.hours;
        document.getElementById('rate').value = data.rate;
        document.getElementById('complexity').value = data.complexity;
        document.getElementById('complexityValue').textContent = data.complexity;
        document.getElementById('additional').value = data.additional;
    }
}

document.getElementById('darkModeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
});

window.onload = loadFromLocalStorage;