import { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand: number, secondOperand: number, operator: string): number => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    if (!operator || firstOperand === null) return;
    
    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-80">
        <div className="bg-gray-200 p-4 mb-4 rounded text-right text-3xl font-bold h-16 flex items-center justify-end overflow-hidden">
          {display}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button 
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={clearDisplay}
          >
            C
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded text-xl font-semibold transition-colors">
            +/-
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded text-xl font-semibold transition-colors">
            %
          </button>
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={() => performOperation('/')}
          >
            ÷
          </button>
          
          {[7, 8, 9].map((digit) => (
            <button 
              key={digit}
              className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded text-xl font-semibold transition-colors"
              onClick={() => inputDigit(digit.toString())}
            >
              {digit}
            </button>
          ))}
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={() => performOperation('*')}
          >
            ×
          </button>
          
          {[4, 5, 6].map((digit) => (
            <button 
              key={digit}
              className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded text-xl font-semibold transition-colors"
              onClick={() => inputDigit(digit.toString())}
            >
              {digit}
            </button>
          ))}
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={() => performOperation('-')}
          >
            -
          </button>
          
          {[1, 2, 3].map((digit) => (
            <button 
              key={digit}
              className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded text-xl font-semibold transition-colors"
              onClick={() => inputDigit(digit.toString())}
            >
              {digit}
            </button>
          ))}
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={() => performOperation('+')}
          >
            +
          </button>
          
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded text-xl font-semibold col-span-2 transition-colors"
            onClick={() => inputDigit('0')}
          >
            0
          </button>
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={inputDecimal}
          >
            .
          </button>
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded text-xl font-semibold transition-colors"
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

//  To run this calculator app, you'll need to:

//  Create a new React TypeScript project: npx create-react-app calculator-app --template typescript
//  Replace the content of src/App.tsx with the calculator code I provided
//  Install Tailwind CSS: npm install -D tailwindcss && npx tailwindcss init && npm start

//  This will set up and launch your calculator app in development mode.