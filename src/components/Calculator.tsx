import { useState, useCallback, useEffect } from 'react'

type Operator = '+' | '-' | '*' | '/'

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }, [])

  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    if (value !== 0) {
      setDisplay(String(-value))
    }
  }, [display])

  const inputPercent = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  const calculate = useCallback((left: number, right: number, op: Operator): number => {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
      case '/': return right !== 0 ? left / right : 0
    }
  }, [])

  const performOperation = useCallback((nextOperator: Operator) => {
    const currentValue = parseFloat(display)

    if (previousValue !== null && operator && !waitingForOperand) {
      const result = calculate(previousValue, currentValue, operator)
      const resultStr = parseFloat(result.toFixed(10)).toString()
      setDisplay(resultStr)
      setPreviousValue(result)
    } else {
      setPreviousValue(currentValue)
    }

    setOperator(nextOperator)
    setWaitingForOperand(true)
  }, [display, previousValue, operator, waitingForOperand, calculate])

  const handleEquals = useCallback(() => {
    if (previousValue === null || operator === null) return

    const currentValue = parseFloat(display)
    const result = calculate(previousValue, currentValue, operator)
    const resultStr = parseFloat(result.toFixed(10)).toString()

    setDisplay(resultStr)
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }, [display, previousValue, operator, calculate])

  const backspace = useCallback(() => {
    if (waitingForOperand) return
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }, [display, waitingForOperand])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDecimal()
      else if (e.key === '+') performOperation('+')
      else if (e.key === '-') performOperation('-')
      else if (e.key === '*') performOperation('*')
      else if (e.key === '/') { e.preventDefault(); performOperation('/') }
      else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Escape') clear()
      else if (e.key === 'Backspace') backspace()
      else if (e.key === '%') inputPercent()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDecimal, performOperation, handleEquals, clear, backspace, inputPercent])

  const formatDisplay = (value: string) => {
    if (value.length > 12) {
      const num = parseFloat(value)
      if (Math.abs(num) >= 1e12) {
        return num.toExponential(6)
      }
      return value.slice(0, 12)
    }
    return value
  }

  const buttonClass = (type: 'number' | 'operator' | 'function') => {
    const base = 'flex items-center justify-center rounded-2xl text-xl font-medium cursor-pointer select-none active:scale-95 transition-transform h-16'
    switch (type) {
      case 'number':
        return `${base} bg-gray-700 hover:bg-gray-600 text-white`
      case 'operator':
        return `${base} bg-orange-500 hover:bg-orange-400 text-white`
      case 'function':
        return `${base} bg-gray-500 hover:bg-gray-400 text-white`
    }
  }

  const isActiveOp = (op: Operator) => operator === op && waitingForOperand

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <div className="text-right px-4 py-6 mb-2">
          <div className="text-white text-5xl font-light tracking-tight overflow-hidden">
            {formatDisplay(display)}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button className={buttonClass('function')} onClick={clear}>AC</button>
          <button className={buttonClass('function')} onClick={toggleSign}>+/−</button>
          <button className={buttonClass('function')} onClick={inputPercent}>%</button>
          <button
            className={isActiveOp('/') ? `${buttonClass('operator')} !bg-white !text-orange-500` : buttonClass('operator')}
            onClick={() => performOperation('/')}
          >÷</button>

          {/* Row 2 */}
          <button className={buttonClass('number')} onClick={() => inputDigit('7')}>7</button>
          <button className={buttonClass('number')} onClick={() => inputDigit('8')}>8</button>
          <button className={buttonClass('number')} onClick={() => inputDigit('9')}>9</button>
          <button
            className={isActiveOp('*') ? `${buttonClass('operator')} !bg-white !text-orange-500` : buttonClass('operator')}
            onClick={() => performOperation('*')}
          >×</button>

          {/* Row 3 */}
          <button className={buttonClass('number')} onClick={() => inputDigit('4')}>4</button>
          <button className={buttonClass('number')} onClick={() => inputDigit('5')}>5</button>
          <button className={buttonClass('number')} onClick={() => inputDigit('6')}>6</button>
          <button
            className={isActiveOp('-') ? `${buttonClass('operator')} !bg-white !text-orange-500` : buttonClass('operator')}
            onClick={() => performOperation('-')}
          >−</button>

          {/* Row 4 */}
          <button className={buttonClass('number')} onClick={() => inputDigit('1')}>1</button>
          <button className={buttonClass('number')} onClick={() => inputDigit('2')}>2</button>
          <button className={buttonClass('number')} onClick={() => inputDigit('3')}>3</button>
          <button
            className={isActiveOp('+') ? `${buttonClass('operator')} !bg-white !text-orange-500` : buttonClass('operator')}
            onClick={() => performOperation('+')}
          >+</button>

          {/* Row 5 */}
          <button
            className={`${buttonClass('number')} col-span-2`}
            onClick={() => inputDigit('0')}
          >0</button>
          <button className={buttonClass('number')} onClick={inputDecimal}>.</button>
          <button className={buttonClass('operator')} onClick={handleEquals}>=</button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          Keyboard supported
        </p>
      </div>
    </div>
  )
}
