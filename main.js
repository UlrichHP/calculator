const calculator = document.querySelector('.calculator')
const keys = document.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {

        const key = e.target
        const displayedNum = display.textContent
        
        // Pure functions
        const resultString = createResultString(key, displayedNum, calculator.dataset)
        
        // Update states
        display.textContent = resultString
        updateCalculatorState(key, calculator, resultString, displayedNum)
        updateVisualState(key, calculator)
    }
})

const createResultString = (key, displayedNum, state) => {
    
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const {
        firstValue,
        modValue,
        operator,
        previousKeyType,
    } = state

    if (keyType === 'number') {
        return displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate' ? keyContent : displayedNum + keyContent
    }
    
    if (keyType === 'operator') {
        return firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate' ? calculate(firstValue, operator, displayedNum) : displayedNum
    }
    
    if (keyType === 'decimal') {
        if (!displayedNum.includes('.')) { return displayedNum + '.' }
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') { return '0.' }
        return displayedNum
    }
    
    if (keyType === 'clear') { return 0 }
    
    if (keyType === 'calculate') {
        if (firstValue) {
            return previousKeyType === 'calculate' ? calculate(firstValue, operator, modValue) : calculate(firstValue, operator, displayedNum)
        } else {
            return displayedNum
        }
    }
}

const calculate = (n1, operator, n2) => {
    const num1 = parseFloat(n1)
    const num2 = parseFloat(n2)

    if (operator === 'add') { return num1 + num2 }
    if (operator === 'subtract') { return num1 - num2 }
    if (operator === 'multiply') { return num1 * num2 }
    if (operator === 'divide') { return num1 / num2 }
}

const getKeyType = (key) => {
    
    const { action } = key.dataset
    
    if (!action) return 'number'
    
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) return 'operator'

    // For everything else, return the action
    return action
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {

    const keyType = getKeyType(key)
    calculator.dataset.previousKeyType = keyType

    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = calculator.dataset.firstValuetValue && calculator.dataset.operator && previousKeyType !== 'operator' && calculator.dataset.previousKeyType !== 'calculate' ? calculatedValue : displayedNum
    }

    if (keyType === 'clear') {
        if (key.textContent === 'AC') {
            calculator.dataset.firstValue = ''
            calculator.dataset.modValue = ''
            calculator.dataset.operator = ''
            calculator.dataset.previousKeyType = ''
        }
    }

    if (keyType === 'calculate') {
        calculator.dataset.modValue = calculator.dataset.firstValue && calculator.dataset.previousKeyType === 'calculate' ? calculator.dataset.modValue : displayedNum
    }
}

const updateVisualState = (key, calculator) => {
    
    const keyType = getKeyType(key)
    
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
    
    if (keyType === 'operator') { key.classList.add('is-depressed') }
    
    if (keyType === 'clear' && key.textContent !== 'AC') {
        key.textContent = 'AC'
    }
    
    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'CE'
    }
}
