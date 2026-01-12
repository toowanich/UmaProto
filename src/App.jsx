import { useState, useEffect } from 'react'
import GameScreen from './GameScreen'
import './App.css'

function App() {
  const [gameState, setGameState] = useState({
    money: 1000,
    debt: 5000,
    daysLeft: 30,
    currentDay: 1,
    talismans: [],
    gameOver: false,
    won: false
  })

  const [races] = useState({
    3: { horses: ['Thunder', 'Lightning', 'Storm', 'Wind'] },
    7: { horses: ['Blaze', 'Fire', 'Ember', 'Spark'] },
    12: { horses: ['Shadow', 'Midnight', 'Eclipse', 'Void'] },
    18: { horses: ['Gold', 'Silver', 'Bronze', 'Copper'] },
    25: { horses: ['Swift', 'Quick', 'Fast', 'Rapid'] }
  })

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