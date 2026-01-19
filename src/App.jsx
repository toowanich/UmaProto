import { useState, useEffect } from 'react'
import GameScreen from './GameScreen'
import { generateHorseNames, selectRandomHorses, generateRaceGrade } from './horseNames'
import './App.css'

function App() {
  const [horsePool] = useState(() => generateHorseNames(30))
  const [horseProfiles] = useState(() => {
    const profiles = {}
    const weatherTypes = ['sunny', 'cloudy', 'raining']
    
    horsePool.forEach(horse => {
      profiles[horse] = {
        preferredWeather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        power: Math.floor(Math.random() * 41) + 60, // 60-100
        speed: Math.floor(Math.random() * 41) + 60, // 60-100
        stamina: Math.floor(Math.random() * 41) + 60 // 60-100
      }
    })
    
    return profiles
  })
  
  const [gameState, setGameState] = useState({
    money: 1000,
    debt: 5000,
    totalDebt: 5000,
    daysLeft: 30,
    currentDay: 1,
    talismans: [],
    gameOver: false,
    won: false,
    loanTaken: false,
    fortuneTellerUses: 0,
    dailyActions: {}, // Track actions taken each day
    installments: [
      { amount: 1000, dueDay: 10, paid: false },
      { amount: 1500, dueDay: 20, paid: false },
      { amount: 2500, dueDay: 30, paid: false }
    ]
  })

  const [races] = useState(() => {
    const raceData = {}
    const raceDays = [3, 7, 12, 18, 25]
    const weatherTypes = ['sunny', 'cloudy', 'raining']
    
    raceDays.forEach(day => {
      const horses = selectRandomHorses(horsePool, 4)
      const grade = generateRaceGrade()
      const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
      const winner = horses[Math.floor(Math.random() * horses.length)]
      const finishingOrder = [...horses].sort(() => Math.random() - 0.5)
      
      raceData[day] = {
        horses,
        grade,
        weather,
        result: {
          winner,
          finishingOrder
        }
      }
    })
    
    return raceData
  })

  useEffect(() => {
    const canTakeLoan = !gameState.loanTaken && (gameState.money <= 0 || gameState.currentDay > 10)
    
    if (gameState.daysLeft <= 0 || (gameState.money <= 0 && !canTakeLoan)) {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        won: prev.money >= prev.debt && prev.money > 0
      }))
    }
  }, [gameState.daysLeft, gameState.money, gameState.debt, gameState.loanTaken, gameState.currentDay])

  if (gameState.gameOver) {
    const reason = gameState.money <= 0 ? 'You ran out of money!' : 
                   gameState.won ? 'You paid off your debt!' : 'You failed to pay off your debt in time.'
    
    return (
      <div className="game-over">
        <h1>{gameState.won ? 'Victory!' : 'Game Over'}</h1>
        <p>{reason}</p>
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
        horseProfiles={horseProfiles}
      />
    </div>
  )
}

export default App