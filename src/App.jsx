import { useState, useEffect } from 'react'
import GameScreen from './GameScreen'
import { generateHorseNames, selectRandomHorses, generateRaceGrade } from './horseNames'
import './App.css'

function App() {
  const [horsePool] = useState(() => generateHorseNames(30))
  
  const [gameState, setGameState] = useState({
    money: 1000,
    debt: 5000,
    totalDebt: 5000,
    daysLeft: 30,
    currentDay: 1,
    talismans: [],
    gameOver: false,
    won: false,
    installments: [
      { amount: 1000, dueDay: 10, paid: false },
      { amount: 1500, dueDay: 20, paid: false },
      { amount: 2500, dueDay: 30, paid: false }
    ]
  })

  const [races] = useState(() => ({
    3: { horses: selectRandomHorses(horsePool, 4), grade: generateRaceGrade() },
    7: { horses: selectRandomHorses(horsePool, 4), grade: generateRaceGrade() },
    12: { horses: selectRandomHorses(horsePool, 4), grade: generateRaceGrade() },
    18: { horses: selectRandomHorses(horsePool, 4), grade: generateRaceGrade() },
    25: { horses: selectRandomHorses(horsePool, 4), grade: generateRaceGrade() }
  })))

  useEffect(() => {
    if (gameState.daysLeft <= 0) {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        won: prev.money >= prev.debt
      }))
    }
  }, [gameState.daysLeft, gameState.money, gameState.debt])

  if (gameState.gameOver) {
    return (
      <div className="game-over">
        <h1>{gameState.won ? 'Victory!' : 'Game Over'}</h1>
        <p>{gameState.won ? 'You paid off your debt!' : 'You failed to pay off your debt in time.'}</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    )
  }

  return (
    <div className="app">
      <GameScreen 
        gameState={gameState} 
        setGameState={setGameState} 
        races={races}
      />
    </div>
  )
}

export default App