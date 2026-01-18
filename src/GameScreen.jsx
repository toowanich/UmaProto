import { useState } from 'react'
import { RACE_GRADES } from './horseNames'

const RaceInfoModal = ({ raceDay, races, onClose }) => {
  const race = races[raceDay]
  const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][(raceDay - 1) % 7]
  const gradeInfo = RACE_GRADES[race.grade]
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏇 Race Information</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="race-info">
          <h4>Day {raceDay} ({dayOfWeek})</h4>
          <div className="race-grade">
            <strong>{gradeInfo.prestige}</strong> ({race.grade})
          </div>
          <div className="race-multiplier">
            Win Multiplier: {gradeInfo.multiplier}x
          </div>
          <p><strong>Participating Horses:</strong></p>
          <div className="horse-list">
            {race.horses.map(horse => (
              <div key={horse} className="horse-item">🐎 {horse}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const PaymentModal = ({ installment, gameState, onPay, onRestart }) => {
  const canPay = gameState.money >= installment.amount
  
  return (
    <div className="modal-overlay">
      <div className="modal-content payment-modal">
        <div className="modal-header">
          <h3>💰 Payment Due!</h3>
        </div>
        <div className="payment-info">
          <p>Your installment of <strong>${installment.amount}</strong> is due today!</p>
          <p>Your current money: <strong>${gameState.money}</strong></p>
          {canPay ? (
            <div>
              <p className="success-text">✅ You have enough money to pay!</p>
              <button className="pay-btn" onClick={onPay}>Pay ${installment.amount}</button>
            </div>
          ) : (
            <div>
              <p className="error-text">❌ Insufficient funds! You cannot pay this installment.</p>
              <button className="restart-btn" onClick={onRestart}>Restart Game</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Calendar = ({ gameState, races, onClose, onRaceClick }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📅 Calendar & Objectives</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="calendar-grid">
          {Array.from({length: 30}, (_, i) => {
            const day = i + 1
            const isToday = day === gameState.currentDay
            const isPast = day < gameState.currentDay
            const hasRace = [3, 7, 12, 18, 25].includes(day)
            const hasInstallment = gameState.installments.find(inst => inst.dueDay === day)
            const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(day - 1) % 7]
            
            return (
              <div key={day} className={`calendar-day ${
                isToday ? 'today' : isPast ? 'past' : 'future'
              }`}>
                <div className="day-number">{day}</div>
                <div className="day-of-week">{dayOfWeek}</div>
                {hasRace && (
                  <div className="race-marker" onClick={() => onRaceClick(day)}>
                    🏇
                  </div>
                )}
                {hasInstallment && (
                  <div className={`installment-marker ${
                    hasInstallment.paid ? 'paid' : 'unpaid'
                  }`}>
                    ${hasInstallment.amount}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="objectives">
          <h4>Debt Installments:</h4>
          {gameState.installments.map((inst, i) => (
            <div key={i} className={`objective ${inst.paid ? 'completed' : ''}`}>
              Day {inst.dueDay}: ${inst.amount} {inst.paid ? '✅' : '⏰'}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TALISMANS = [
  { name: 'Lucky Coin', icon: '🪙', cost: 200, effect: 'Increases win chance by 10%' },
  { name: 'Crystal Ball', icon: '🔮', cost: 500, effect: 'Shows horse odds before betting' },
  { name: 'Horseshoe', icon: '🍀', cost: 300, effect: 'Doubles winnings on victory' }
]

function GameScreen({ gameState, setGameState, races }) {
  const [selectedAction, setSelectedAction] = useState(null)
  const [betAmount, setBetAmount] = useState(0)
  const [selectedHorse, setSelectedHorse] = useState('')
  const [raceResult, setRaceResult] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentInstallment, setCurrentInstallment] = useState(null)
  const [showRaceInfo, setShowRaceInfo] = useState(false)
  const [selectedRaceDay, setSelectedRaceDay] = useState(null)

  const hasRaceToday = races[gameState.currentDay]
  const canAffordTalisman = (talisman) => gameState.money >= talisman.cost
  const ownsTalisman = (talisman) => gameState.talismans.includes(talisman.name)

  const getNextDeadline = () => {
    const nextInstallment = gameState.installments.find(inst => 
      inst.dueDay >= gameState.currentDay && !inst.paid
    )
    return nextInstallment
  }

  const getDayOfWeek = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days[(day - 1) % 7]
  }

  const getNextRace = () => {
    const raceDays = [3, 7, 12, 18, 25]
    return raceDays.find(day => day > gameState.currentDay)
  }

  const handleRaceClick = (day) => {
    setSelectedRaceDay(day)
    setShowRaceInfo(true)
    setShowCalendar(false)
  }

  const nextDay = () => {
    const todayInstallment = gameState.installments.find(inst => 
      inst.dueDay === gameState.currentDay && !inst.paid
    )
    
    if (todayInstallment) {
      setCurrentInstallment(todayInstallment)
      setShowPaymentModal(true)
      return
    }
    
    setGameState(prev => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      daysLeft: prev.daysLeft - 1
    }))
    setSelectedAction(null)
    setRaceResult(null)
  }

  const handlePayment = () => {
    setGameState(prev => ({
      ...prev,
      money: prev.money - currentInstallment.amount,
      debt: prev.debt - currentInstallment.amount,
      installments: prev.installments.map(inst => 
        inst.dueDay === currentInstallment.dueDay ? { ...inst, paid: true } : inst
      ),
      currentDay: prev.currentDay + 1,
      daysLeft: prev.daysLeft - 1
    }))
    setShowPaymentModal(false)
    setCurrentInstallment(null)
    setSelectedAction(null)
    setRaceResult(null)
  }

  const handleRestart = () => {
    window.location.reload()
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

  const getBaseWinChance = (horse, horses) => {
    const baseChance = 1 / horses.length
    const randomFactor = Math.random() * 0.4 + 0.8 // 0.8 to 1.2 multiplier
    return baseChance * randomFactor
  }

  const getHorseWinChance = (horse, horses) => {
    let chance = getBaseWinChance(horse, horses)
    
    if (gameState.talismans.includes('Lucky Coin') && horse === selectedHorse) {
      chance += 0.1 // 10% boost
    }
    
    return Math.min(chance, 0.9) // Cap at 90%
  }

  const getPotentialReturn = (horse, horses) => {
    const raceGrade = races[gameState.currentDay]?.grade || 'Ungraded'
    let multiplier = RACE_GRADES[raceGrade].multiplier
    if (gameState.talismans.includes('Horseshoe')) {
      multiplier *= 2
    }
    return (multiplier * betAmount).toFixed(0)
  }

  const placeBet = () => {
    if (betAmount <= 0 || betAmount > gameState.money || !selectedHorse) return

    const horses = races[gameState.currentDay].horses
    const winChances = horses.map(horse => getHorseWinChance(horse, horses))
    const totalChance = winChances.reduce((sum, chance) => sum + chance, 0)
    const normalizedChances = winChances.map(chance => chance / totalChance)
    
    const random = Math.random()
    let cumulative = 0
    let winnerIndex = 0
    
    for (let i = 0; i < normalizedChances.length; i++) {
      cumulative += normalizedChances[i]
      if (random <= cumulative) {
        winnerIndex = i
        break
      }
    }
    
    const winner = horses[winnerIndex]
    const won = winner === selectedHorse

    let winnings = 0
    if (won) {
      const raceGrade = races[gameState.currentDay]?.grade || 'Ungraded'
      winnings = betAmount * RACE_GRADES[raceGrade].multiplier
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
        <div className="status-header">
          <h2>Day {gameState.currentDay} ({getDayOfWeek(gameState.currentDay)}) - {gameState.daysLeft} days left</h2>
          <div className="header-buttons">
            {getNextRace() && (
              <button className="race-info-btn" onClick={() => handleRaceClick(getNextRace())}>
                🏇 Next Race
              </button>
            )}
            <button className="calendar-btn" onClick={() => setShowCalendar(true)}>
              📅 Calendar
            </button>
          </div>
        </div>
        <p>Money: <span>${gameState.money}</span></p>
        <p>Total Debt: <span>${gameState.totalDebt}</span></p>
        <p>Remaining Debt: <span>${gameState.debt}</span></p>
        <p>Talismans: <span>{gameState.talismans.join(', ') || 'None'}</span></p>
        {getNextDeadline() && (
          <div className="next-deadline">
            ⚠️ Next Payment: ${getNextDeadline().amount} due Day {getNextDeadline().dueDay} 
            ({getNextDeadline().dueDay - gameState.currentDay} days left)
          </div>
        )}
      </div>

      {showPaymentModal && currentInstallment && (
        <PaymentModal 
          installment={currentInstallment}
          gameState={gameState}
          onPay={handlePayment}
          onRestart={handleRestart}
        />
      )}

      {showRaceInfo && selectedRaceDay && (
        <RaceInfoModal 
          raceDay={selectedRaceDay}
          races={races}
          onClose={() => setShowRaceInfo(false)}
        />
      )}

      {showCalendar && (
        <Calendar 
          gameState={gameState}
          races={races}
          onClose={() => setShowCalendar(false)}
          onRaceClick={handleRaceClick}
        />
      )}

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
            <div className="race-grade-display">
              {RACE_GRADES[races[gameState.currentDay].grade].prestige} ({races[gameState.currentDay].grade})
            </div>
            <div className="horses">
              {races[gameState.currentDay].horses.map(horse => {
                const showOdds = gameState.talismans.includes('Crystal Ball')
                const winChance = showOdds ? getHorseWinChance(horse, races[gameState.currentDay].horses) : 0
                const potentialReturn = showOdds && betAmount > 0 ? getPotentialReturn(horse, races[gameState.currentDay].horses) : 0
                return (
                  <label key={horse}>
                    <input 
                      type="radio" 
                      value={horse} 
                      checked={selectedHorse === horse}
                      onChange={(e) => setSelectedHorse(e.target.value)}
                    />
                    {horse}
                    {showOdds && <span className="odds"> ({(winChance * 100).toFixed(1)}%{potentialReturn > 0 && `, $${potentialReturn}`})</span>}
                  </label>
                )
              })}
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
              <div className="talisman-info">
                <div className="talisman-name">{talisman.icon} {talisman.name} - ${talisman.cost}</div>
                <div className="talisman-effect">{talisman.effect}</div>
              </div>
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