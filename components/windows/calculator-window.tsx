"use client"

import { useState } from "react"
import { Delete, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CalculatorWindow() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)

      // Agregar al historial
      const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`
      setHistory((prev) => [historyEntry, ...prev.slice(0, 9)]) // Mantener solo 10 entradas
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const percentage = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(value / 100))
  }

  const toggleSign = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(value * -1))
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  const buttonClass = "h-14 text-lg font-semibold transition-all hover:scale-105"
  const numberButtonClass = `${buttonClass} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600`
  const operatorButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`
  const specialButtonClass = `${buttonClass} bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500`

  return (
    <div className="p-6 h-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculadora principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Calculadora</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display */}
                <div className="mb-4 p-4 bg-gray-900 dark:bg-gray-800 rounded-lg">
                  <div className="text-right text-3xl font-mono text-white overflow-hidden">{display}</div>
                </div>

                {/* Botones */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Primera fila */}
                  <Button onClick={clear} className={specialButtonClass}>
                    AC
                  </Button>
                  <Button onClick={toggleSign} className={specialButtonClass}>
                    ±
                  </Button>
                  <Button onClick={percentage} className={specialButtonClass}>
                    %
                  </Button>
                  <Button onClick={() => performOperation("÷")} className={operatorButtonClass}>
                    ÷
                  </Button>

                  {/* Segunda fila */}
                  <Button onClick={() => inputNumber("7")} className={numberButtonClass}>
                    7
                  </Button>
                  <Button onClick={() => inputNumber("8")} className={numberButtonClass}>
                    8
                  </Button>
                  <Button onClick={() => inputNumber("9")} className={numberButtonClass}>
                    9
                  </Button>
                  <Button onClick={() => performOperation("×")} className={operatorButtonClass}>
                    ×
                  </Button>

                  {/* Tercera fila */}
                  <Button onClick={() => inputNumber("4")} className={numberButtonClass}>
                    4
                  </Button>
                  <Button onClick={() => inputNumber("5")} className={numberButtonClass}>
                    5
                  </Button>
                  <Button onClick={() => inputNumber("6")} className={numberButtonClass}>
                    6
                  </Button>
                  <Button onClick={() => performOperation("-")} className={operatorButtonClass}>
                    -
                  </Button>

                  {/* Cuarta fila */}
                  <Button onClick={() => inputNumber("1")} className={numberButtonClass}>
                    1
                  </Button>
                  <Button onClick={() => inputNumber("2")} className={numberButtonClass}>
                    2
                  </Button>
                  <Button onClick={() => inputNumber("3")} className={numberButtonClass}>
                    3
                  </Button>
                  <Button onClick={() => performOperation("+")} className={operatorButtonClass}>
                    +
                  </Button>

                  {/* Quinta fila */}
                  <Button onClick={() => inputNumber("0")} className={`${numberButtonClass} col-span-2`}>
                    0
                  </Button>
                  <Button onClick={inputDecimal} className={numberButtonClass}>
                    .
                  </Button>
                  <Button onClick={() => performOperation("=")} className={operatorButtonClass}>
                    =
                  </Button>
                </div>

                {/* Botones adicionales */}
                <div className="flex gap-2 mt-4">
                  <Button onClick={backspace} variant="outline" className="flex-1 bg-transparent">
                    <Delete className="w-4 h-4 mr-2" />
                    Borrar
                  </Button>
                  <Button onClick={() => setHistory([])} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpiar Historial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Historial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-auto">
                  {history.length > 0 ? (
                    history.map((entry, index) => (
                      <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                        {entry}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No hay cálculos en el historial</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Funciones adicionales */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Funciones Científicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = Number.parseFloat(display)
                      setDisplay(String(Math.sqrt(value)))
                    }}
                  >
                    √
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = Number.parseFloat(display)
                      setDisplay(String(Math.pow(value, 2)))
                    }}
                  >
                    x²
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = Number.parseFloat(display)
                      setDisplay(String(Math.sin((value * Math.PI) / 180)))
                    }}
                  >
                    sin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = Number.parseFloat(display)
                      setDisplay(String(Math.cos((value * Math.PI) / 180)))
                    }}
                  >
                    cos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = Number.parseFloat(display)
                      setDisplay(String(Math.log10(value)))
                    }}
                  >
                    log
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = Number.parseFloat(display)
                      setDisplay(String(Math.log(value)))
                    }}
                  >
                    ln
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
