"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const buttons = ["AC", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="]

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)
  const [input, setInput] = useState("")
  const [showingResult, setShowingResult] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (buttons.includes(key) || key === "Enter") {
        event.preventDefault()
        handleInput(key === "Enter" ? "=" : key)
      } else if (key === "Backspace") {
        event.preventDefault()
        if (!showingResult && input.length > 0) {
          const newInput = input.slice(0, -1)
          setInput(newInput)
          setDisplay(newInput || "0")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [input, showingResult])

  const handleInput = (value: string) => {
    if (value === "AC") {
      setDisplay("0")
      setInput("")
      setPreviousValue(null)
      setOperation(null)
      setShowingResult(false)
    } else if (value === "±") {
      if (showingResult) {
        setInput(display.startsWith("-") ? display.slice(1) : "-" + display)
      }
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display)
    } else if (value === "%") {
      const result = (Number.parseFloat(display) / 100).toString()
      setDisplay(result)
      setInput(result)
      setShowingResult(true)
    } else if (["+", "-", "×", "÷"].includes(value)) {
      setPreviousValue(Number.parseFloat(display))
      setOperation(value)
      setInput("")
      setShowingResult(false)
    } else if (value === "=") {
      if (previousValue !== null && operation) {
        const current = Number.parseFloat(display)
        let result: number
        switch (operation) {
          case "+":
            result = previousValue + current
            break
          case "-":
            result = previousValue - current
            break
          case "×":
            result = previousValue * current
            break
          case "÷":
            result = previousValue / current
            break
          default:
            return
        }
        setDisplay(result.toString())
        setInput("")
        setPreviousValue(null)
        setOperation(null)
        setShowingResult(true)
      }
    } else if (value === ".") {
      if (!input.includes(".")) {
        const newInput = input + value
        setInput(newInput)
        setDisplay(newInput)
        setShowingResult(false)
      }
    } else {
      const newInput = showingResult ? value : input + value
      setInput(newInput)
      setDisplay(newInput)
      setShowingResult(false)
    }
  }

  const getButtonClass = (value: string) => {
    if (["÷", "×", "-", "+", "="].includes(value)) {
      return "bg-orange-500 hover:bg-orange-600 text-white"
    }
    if (["AC", "±", "%"].includes(value)) {
      return "bg-gray-300 hover:bg-gray-400 text-black"
    }
    return "bg-gray-500 hover:bg-gray-600 text-white"
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-xs">
        <div className="bg-black rounded-t-3xl p-4">
          <div className="h-40 flex flex-col items-end justify-end p-4">
            <span className="text-gray-400 text-3xl font-light tracking-tight min-h-[36px]">
              {previousValue !== null ? `${previousValue} ${operation || ""}` : ""}
            </span>
            <span className="text-white text-7xl font-light tracking-tight">{display}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 bg-black rounded-b-3xl p-2">
          {buttons.map((btn, index) => (
            <Button
              key={btn}
              className={`${getButtonClass(btn)} rounded-full text-2xl font-medium h-16 ${
                btn === "0" ? "col-span-2" : ""
              }`}
              onClick={() => handleInput(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

