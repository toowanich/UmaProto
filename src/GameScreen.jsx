import { useState } from 'react'

const TALISMANS = [
  { name: 'Lucky Coin', cost: 200, effect: 'Increases win chance by 10%' },
  { name: 'Crystal Ball', cost: 500, effect: 'Shows horse odds before betting' },
  { name: 'Horseshoe', cost: 300, effect: 'Doubles winnings on victory' }
]

function GameScreen({ gameState, setGameState, races }) {
  const [selectedAction, setSelectedAction] = useState(null)
  const [betAmount, setBetAmount] = useState(0)
  const [selectedHorse, setSelectedHorse] = useState('')
  const [raceResult, setRaceResult] = useState(null)

  const hasRaceToday = races[gameState.currentDay]
  const canAffordTalisman = (talisman) => gameState.money >= talisman.cost
  const ownsTalisman = (talisman) => gameState.talismans.includes(talisman.name)

  const nextDay = () => {
    setGameState(prev => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      daysLeft: prev.daysLeft - 1
    }))
    setSelectedAction(null)
    setRaceResult(null)
  }

  const buyTalisman = (talisman) => {
    if (canAffordTalisman(talisman) && !ownsTalisman(talisman)) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - talisman.cost,
        talismans: [...prev.talismans, talisman.name]
      }))
    }
  }

  const placeBet = () => {
    if (betAmount <= 0 || betAmount > gameState.money || !selectedHorse) return

    const horses = races[gameState.currentDay].horses
    const winnerIndex = Math.floor(Math.random() * horses.length)
    const winner = horses[winnerIndex]
    const won = winner === selectedHorse

    let winnings = 0
    if (won) {
      winnings = betAmount * 3
      if (gameState.talismans.includes('Horseshoe')) {
        winnings *= 2
      }
    }

    setGameState(prev => ({
      ...prev,
      money: prev.money - betAmount + winnings
    }))

    setRaceResult({ winner, won, winnings, betAmount })
  }

  return (
    <div className="game-screen">
      <div className="status">
        <h2>Day {gameState.currentDay} - {gameState.daysLeft} days left</h2>
        <p>Money: ${gameState.money}</p>
        <p>Debt: ${gameState.debt}</p>
        <p>Talismans: {gameState.talismans.join(', ') || 'None'}</p>
      </div>

      {raceResult && (
        <div className="race-result">
          <h3>Race Result</h3>
          <p>Winner: {raceResult.winner}</p>
          <p>{raceResult.won ? `You won $${raceResult.winnings}!` : `You lost $${raceResult.betAmount}`}</p>
        </div>
      )}

      <div className="actions">
        <h3>Choose your action:</h3>
        
        {hasRaceToday && !raceResult && (
          <div className="race-section">
            <h4>🏇 Race Day!</h4>
            <div className="horses">
              {races[gameState.currentDay].horses.map(horse => (
                <label key={horse}>
                  <input 
                    type="radio" 
                    value={horse} 
                    checked={selectedHorse === horse}
                    onChange={(e) => setSelectedHorse(e.target.value)}
                  />
                  {horse}
                </label>
              ))}
            </div>
            <input 
              type="number" 
              placeholder="Bet amount" 
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              max={gameState.money}
            />
            <button onClick={placeBet} disabled={!selectedHorse || betAmount <= 0}>Place Bet</button>
          </div>
        )}

        <div className="talisman-shop">
          <h4>🔮 Talisman Shop</h4>
          {TALISMANS.map(talisman => (
            <div key={talisman.name} className="talisman">
              <span>{talisman.name} - ${talisman.cost}</span>
              <span>{talisman.effect}</span>
              <button 
                onClick={() => buyTalisman(talisman)}
                disabled={!canAffordTalisman(talisman) || ownsTalisman(talisman)}
              >
                {ownsTalisman(talisman) ? 'Owned' : 'Buy'}
              </button>
            </div>
          ))}
        </div>

        <button onClick={nextDay} className="next-day">Next Day</button>
      </div>
    </div>
  )
}

export default GameScreen