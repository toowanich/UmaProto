import { useState } from 'react'
import { RACE_GRADES } from './horseNames'

const StatsDiagram = ({ power, speed, stamina }) => {
  const maxStat = 100
  const centerX = 60
  const centerY = 60
  const radius = 40
  
  // Calculate points for the triangle (power at top, speed at bottom-right, stamina at bottom-left)
  const powerAngle = -Math.PI / 2 // Top
  const speedAngle = Math.PI / 6 // Bottom-right
  const staminaAngle = (5 * Math.PI) / 6 // Bottom-left
  
  const powerPoint = {
    x: centerX + (radius * power / maxStat) * Math.cos(powerAngle),
    y: centerY + (radius * power / maxStat) * Math.sin(powerAngle)
  }
  
  const speedPoint = {
    x: centerX + (radius * speed / maxStat) * Math.cos(speedAngle),
    y: centerY + (radius * speed / maxStat) * Math.sin(speedAngle)
  }
  
  const staminaPoint = {
    x: centerX + (radius * stamina / maxStat) * Math.cos(staminaAngle),
    y: centerY + (radius * stamina / maxStat) * Math.sin(staminaAngle)
  }
  
  // Outer triangle points for reference
  const outerPower = { x: centerX + radius * Math.cos(powerAngle), y: centerY + radius * Math.sin(powerAngle) }
  const outerSpeed = { x: centerX + radius * Math.cos(speedAngle), y: centerY + radius * Math.sin(speedAngle) }
  const outerStamina = { x: centerX + radius * Math.cos(staminaAngle), y: centerY + radius * Math.sin(staminaAngle) }
  
  return (
    <div className="stats-diagram">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Outer reference triangle */}
        <polygon 
          points={`${outerPower.x},${outerPower.y} ${outerSpeed.x},${outerSpeed.y} ${outerStamina.x},${outerStamina.y}`}
          fill="none" 
          stroke="#ddd" 
          strokeWidth="1"
        />
        
        {/* Stats triangle */}
        <polygon 
          points={`${powerPoint.x},${powerPoint.y} ${speedPoint.x},${speedPoint.y} ${staminaPoint.x},${staminaPoint.y}`}
          fill="rgba(59, 130, 246, 0.3)" 
          stroke="#3b82f6" 
          strokeWidth="2"
        />
        
        {/* Stat labels */}
        <text x={outerPower.x} y={outerPower.y - 5} textAnchor="middle" fontSize="10" fill="#666">Power</text>
        <text x={outerSpeed.x + 5} y={outerSpeed.y + 5} textAnchor="start" fontSize="10" fill="#666">Speed</text>
        <text x={outerStamina.x - 5} y={outerStamina.y + 5} textAnchor="end" fontSize="10" fill="#666">Stamina</text>
      </svg>
      <div className="stat-values">
        <div>Power: {power}</div>
        <div>Speed: {speed}</div>
        <div>Stamina: {stamina}</div>
      </div>
    </div>
  )
}

const HorseProfileModal = ({ horse, horseProfiles, onClose }) => {
  const profile = horseProfiles[horse]
  
  const getWeatherIcon = (weather) => {
    switch(weather) {
      case 'sunny': return '☀️'
      case 'cloudy': return '☁️'
      case 'raining': return '🌧️'
      default: return '☁️'
    }
  }

  const getWeatherDescription = (weather) => {
    switch(weather) {
      case 'sunny': return 'Hard turf'
      case 'cloudy': return 'Normal conditions'
      case 'raining': return 'Muddy, wet & slippery'
      default: return 'Normal conditions'
    }
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🐎 {horse}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="horse-profile">
          <div className="profile-section">
            <h4>Stats</h4>
            <StatsDiagram 
              power={profile.power}
              speed={profile.speed}
              stamina={profile.stamina}
            />
          </div>
          <div className="profile-section">
            <h4>Weather Aptitude</h4>
            <div className="preferred-weather">
              <strong>Excels in:</strong> {getWeatherIcon(profile.preferredWeather)} {getWeatherDescription(profile.preferredWeather)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoanModal = ({ gameState, onTakeLoan, onDecline }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content loan-modal">
        <div className="modal-header">
          <h3>💰 Emergency Loan Offer</h3>
        </div>
        <div className="loan-info">
          <p>You're in financial trouble! A loan shark offers you an emergency loan.</p>
          <p><strong>Loan Amount: $2000</strong></p>
          <p><strong>Warning:</strong> This will increase your remaining installments by 50%!</p>
          <div className="loan-buttons">
            <button className="take-loan-btn" onClick={onTakeLoan}>Take Loan</button>
            <button className="decline-loan-btn" onClick={onDecline}>Decline (Game Over)</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const RaceInfoModal = ({ raceDay, races, onClose, horseProfiles, onHorseProfileClick }) => {
  const race = races[raceDay]
  const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][(raceDay - 1) % 7]
  const gradeInfo = RACE_GRADES[race.grade]
  
  const getWeatherIcon = (weather) => {
    switch(weather) {
      case 'sunny': return '☀️'
      case 'cloudy': return '☁️'
      case 'raining': return '🌧️'
      default: return '☁️'
    }
  }

  const getWeatherDescription = (weather) => {
    switch(weather) {
      case 'sunny': return 'Turf is hard'
      case 'cloudy': return 'Normal conditions'
      case 'raining': return 'Turf is muddy, wet & slippery'
      default: return 'Normal conditions'
    }
  }
  
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
          <div className="weather-info">
            {getWeatherIcon(race.weather)} {getWeatherDescription(race.weather)}
          </div>
          <p><strong>Participating Horses:</strong></p>
          <div className="horse-list">
            {race.horses.map(horse => {
              const isPreferred = horseProfiles[horse]?.preferredWeather === race.weather
              return (
                <div key={horse} className="horse-item-with-profile">
                  <span>🐎 {horse} {isPreferred && <span className="weather-bonus">✨</span>}</span>
                  <button 
                    className="profile-btn" 
                    onClick={() => onHorseProfileClick(horse)}
                  >
                    📊
                  </button>
                </div>
              )
            })}
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
  const getDayOfWeek = (day) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days[(day - 1) % 7]
  }

  const getAvailableActions = (day) => {
    const actions = []
    const dayOfWeek = getDayOfWeek(day)
    
    if ([3, 7, 12, 18, 25].includes(day)) {
      actions.push('🏇 Race')
    }
    if (dayOfWeek === 'Wed') {
      actions.push('🔮 Fortune Teller')
    }
    if (actions.length === 0) {
      actions.push('💤 Rest')
    }
    
    return actions
  }

  const getCompletedActions = (day) => {
    const dayActions = gameState.dailyActions[day] || {}
    const completed = []
    
    if (dayActions.raced) completed.push('🏇')
    if (dayActions.fortuneTeller) completed.push('🔮')
    
    return completed
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content calendar-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📅 Calendar & Actions</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="vertical-calendar">
          {Array.from({length: 30}, (_, i) => {
            const day = i + 1
            const isToday = day === gameState.currentDay
            const isPast = day < gameState.currentDay
            const hasInstallment = gameState.installments.find(inst => inst.dueDay === day)
            const availableActions = getAvailableActions(day)
            const completedActions = getCompletedActions(day)
            
            return (
              <div key={day} className={`calendar-row ${
                isToday ? 'today' : isPast ? 'past' : 'future'
              }`}>
                <div className="day-info">
                  <div className="day-number">Day {day}</div>
                  <div className="day-of-week">{getDayOfWeek(day)}</div>
                </div>
                <div className="actions-info">
                  <div className="available-actions">
                    {availableActions.map((action, idx) => (
                      <span key={idx} className="action-item">{action}</span>
                    ))}
                  </div>
                  {completedActions.length > 0 && (
                    <div className="completed-actions">
                      {completedActions.map((action, idx) => (
                        <span key={idx} className="completed-action">✅{action}</span>
                      ))}
                    </div>
                  )}
                </div>
                {hasInstallment && (
                  <div className={`installment-info ${
                    hasInstallment.paid ? 'paid' : 'unpaid'
                  }`}>
                    ${hasInstallment.amount} {hasInstallment.paid ? '✅' : '⏰'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const TALISMANS = [
  { name: 'Lucky Coin', icon: '🪙', cost: 200, effect: 'Increases win chance by 10%' },
  { name: 'Crystal Ball', icon: '🔮', cost: 500, effect: 'Shows horse odds before betting' },
  { name: 'Horseshoe', icon: '🍀', cost: 300, effect: 'Doubles winnings on victory' },
  { name: 'Sun Charm', icon: '☀️', cost: 800, effect: 'Forces sunny weather on race days' },
  { name: 'Rain Totem', icon: '🌧️', cost: 800, effect: 'Forces rainy weather on race days' }
]

function GameScreen({ gameState, setGameState, races, horseProfiles }) {
  const [selectedAction, setSelectedAction] = useState(null)
  const [betAmount, setBetAmount] = useState(0)
  const [selectedHorse, setSelectedHorse] = useState('')
  const [raceResult, setRaceResult] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentInstallment, setCurrentInstallment] = useState(null)
  const [showRaceInfo, setShowRaceInfo] = useState(false)
  const [selectedRaceDay, setSelectedRaceDay] = useState(null)
  const [fortuneTellerUsed, setFortuneTellerUsed] = useState(false)
  const [fortunePrediction, setFortunePrediction] = useState(null)
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [showHorseProfile, setShowHorseProfile] = useState(false)
  const [selectedHorseProfile, setSelectedHorseProfile] = useState('')

  const hasRaceToday = races[gameState.currentDay]
  const canAffordTalisman = (talisman) => gameState.money >= talisman.cost
  const ownsTalisman = (talisman) => gameState.talismans.includes(talisman.name)
  const canTakeLoan = !gameState.loanTaken && (gameState.money <= 0 || gameState.currentDay > 10)

  // Check if loan modal should be shown
  if (canTakeLoan && gameState.money <= 0 && !showLoanModal) {
    setShowLoanModal(true)
  }

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

  const getActualWeather = (day) => {
    const originalWeather = races[day]?.weather
    if (gameState.talismans.includes('Sun Charm')) return 'sunny'
    if (gameState.talismans.includes('Rain Totem')) return 'raining'
    return originalWeather
  }

  const getWeatherIcon = (weather) => {
    switch(weather) {
      case 'sunny': return '☀️'
      case 'cloudy': return '☁️'
      case 'raining': return '🌧️'
      default: return '☁️'
    }
  }

  const getWeatherDescription = (weather) => {
    switch(weather) {
      case 'sunny': return 'Turf is hard'
      case 'cloudy': return 'Normal conditions'
      case 'raining': return 'Turf is muddy, wet & slippery'
      default: return 'Normal conditions'
    }
  }

  const isWednesday = () => {
    return getDayOfWeek(gameState.currentDay) === 'Wednesday'
  }

  const isShopDay = () => {
    const dayOfWeek = getDayOfWeek(gameState.currentDay)
    return dayOfWeek === 'Tuesday' || dayOfWeek === 'Friday'
  }

  const getAvailableActions = () => {
    const actions = []
    
    if (hasRaceToday && !raceResult) {
      actions.push({ type: 'race', label: '🏇 Go to Race', action: () => setSelectedAction('race') })
    }
    
    if (isWednesday() && getNextRace() && !fortuneTellerUsed) {
      const cost = 100 * Math.pow(2, gameState.fortuneTellerUses)
      if (gameState.money >= cost) {
        actions.push({ type: 'fortune', label: `🔮 Fortune Teller ($${cost})`, action: consultFortuneTeller })
      }
    }
    
    if (isShopDay()) {
      actions.push({ type: 'shop', label: '🛍️ Talisman Shop', action: () => setSelectedAction('shop') })
    }
    
    if (canTakeLoan && gameState.money > 0) {
      actions.push({ type: 'loan', label: '💰 Emergency Loan', action: () => setShowLoanModal(true) })
    }
    
    if (actions.length === 0) {
      actions.push({ type: 'rest', label: '💤 Rest', action: () => {} })
    }
    
    return actions
  }

  const consultFortuneTeller = () => {
    const nextRaceDay = getNextRace()
    const cost = 100 * Math.pow(2, gameState.fortuneTellerUses)
    
    if (!nextRaceDay || fortuneTellerUsed || gameState.money < cost) return
    
    const nextRace = races[nextRaceDay]
    const randomHorse = nextRace.horses[Math.floor(Math.random() * nextRace.horses.length)]
    const position = nextRace.result.finishingOrder.indexOf(randomHorse) + 1
    
    setGameState(prev => ({
      ...prev,
      money: prev.money - cost,
      fortuneTellerUses: prev.fortuneTellerUses + 1,
      dailyActions: {
        ...prev.dailyActions,
        [prev.currentDay]: { ...prev.dailyActions[prev.currentDay], fortuneTeller: true }
      }
    }))
    
    setFortunePrediction({
      horse: randomHorse,
      position,
      raceDay: nextRaceDay
    })
    setFortuneTellerUsed(true)
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
    setFortuneTellerUsed(false)
    setFortunePrediction(null)
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

  const takeLoan = () => {
    setGameState(prev => {
      const updatedInstallments = prev.installments.map(inst => 
        !inst.paid ? { ...inst, amount: Math.floor(inst.amount * 1.5) } : inst
      )
      
      return {
        ...prev,
        money: prev.money + 2000,
        debt: prev.debt + 2000,
        totalDebt: prev.totalDebt + 2000,
        loanTaken: true,
        installments: updatedInstallments
      }
    })
    setShowLoanModal(false)
  }

  const declineLoan = () => {
    setGameState(prev => ({ ...prev, gameOver: true, won: false }))
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
    
    // Stats influence (average of power, speed, stamina)
    const horseProfile = horseProfiles[horse]
    if (horseProfile) {
      const avgStat = (horseProfile.power + horseProfile.speed + horseProfile.stamina) / 3
      const statBonus = (avgStat - 80) * 0.005 // Each point above 80 gives 0.5% bonus
      chance += statBonus
    }
    
    // Weather aptitude bonus (use actual weather)
    const currentWeather = getActualWeather(gameState.currentDay)
    if (horseProfile && horseProfile.preferredWeather === currentWeather) {
      chance += 0.15 // 15% boost for preferred weather
    }
    
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

    const raceData = races[gameState.currentDay]
    const winner = raceData.result.winner
    const won = winner === selectedHorse

    let winnings = 0
    if (won) {
      const raceGrade = raceData.grade
      winnings = betAmount * RACE_GRADES[raceGrade].multiplier
      if (gameState.talismans.includes('Horseshoe')) {
        winnings *= 2
      }
    }

    setGameState(prev => ({
      ...prev,
      money: prev.money - betAmount + winnings,
      dailyActions: {
        ...prev.dailyActions,
        [prev.currentDay]: { ...prev.dailyActions[prev.currentDay], raced: true }
      }
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
              📅 Log
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

      {showRaceInfo && selectedRaceDay && (
        <RaceInfoModal 
          raceDay={selectedRaceDay}
          races={races}
          horseProfiles={horseProfiles}
          onClose={() => setShowRaceInfo(false)}
          onHorseProfileClick={(horse) => {
            setSelectedHorseProfile(horse)
            setShowHorseProfile(true)
          }}
        />
      )}

      {showHorseProfile && selectedHorseProfile && (
        <HorseProfileModal 
          horse={selectedHorseProfile}
          horseProfiles={horseProfiles}
          onClose={() => setShowHorseProfile(false)}
        />
      )}

      {showLoanModal && (
        <LoanModal 
          gameState={gameState}
          onTakeLoan={takeLoan}
          onDecline={declineLoan}
        />
      )}

      {showPaymentModal && currentInstallment && (
        <PaymentModal 
          installment={currentInstallment}
          gameState={gameState}
          onPay={handlePayment}
          onRestart={handleRestart}
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
        
        {!selectedAction && (() => {
          const availableActions = getAvailableActions()
          
          // Auto-select if only one action available
          if (availableActions.length === 1 && availableActions[0].type !== 'rest') {
            availableActions[0].action()
            return null
          }
          
          return (
            <div className="action-selection">
              {availableActions.map((action, idx) => (
                <button key={idx} className="action-btn" onClick={action.action}>
                  {action.label}
                </button>
              ))}
            </div>
          )
        })()}
        
        {selectedAction === 'race' && hasRaceToday && !raceResult && (
          <div className="race-section">
            <h4>🏇 Race Day!</h4>
            <div className="race-grade-display">
              {RACE_GRADES[races[gameState.currentDay].grade].prestige} ({races[gameState.currentDay].grade})
            </div>
            <div className="weather-display">
              {getWeatherIcon(getActualWeather(gameState.currentDay))} {getWeatherDescription(getActualWeather(gameState.currentDay))}
              {(gameState.talismans.includes('Sun Charm') || gameState.talismans.includes('Rain Totem')) && 
                <span className="weather-forced"> (Forced)</span>
              }
            </div>
            <div className="horses">
              {races[gameState.currentDay].horses.map(horse => {
                const showOdds = gameState.talismans.includes('Crystal Ball')
                const winChance = showOdds ? getHorseWinChance(horse, races[gameState.currentDay].horses) : 0
                const potentialReturn = showOdds && betAmount > 0 ? getPotentialReturn(horse, races[gameState.currentDay].horses) : 0
                const currentWeather = getActualWeather(gameState.currentDay)
                const isPreferred = horseProfiles[horse]?.preferredWeather === currentWeather
                return (
                  <div key={horse} className="horse-selection">
                    <label>
                      <input 
                        type="radio" 
                        value={horse} 
                        checked={selectedHorse === horse}
                        onChange={(e) => setSelectedHorse(e.target.value)}
                      />
                      {horse}
                      {isPreferred && <span className="weather-bonus"> ✨</span>}
                      {showOdds && <span className="odds"> ({(winChance * 100).toFixed(1)}%{potentialReturn > 0 && `, $${potentialReturn}`})</span>}
                    </label>
                    <button 
                      className="profile-btn" 
                      onClick={() => {
                        setSelectedHorseProfile(horse)
                        setShowHorseProfile(true)
                      }}
                    >
                      📊
                    </button>
                  </div>
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

        {selectedAction === 'shop' && isShopDay() && (
          <div className="talisman-shop">
            <h4>🛍️ Talisman Shop</h4>
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
        )}

        {fortunePrediction && (
          <div className="fortune-prediction">
            <p>🔮 The spirits whisper...</p>
            <p><strong>{fortunePrediction.horse}</strong> will finish in position <strong>{fortunePrediction.position}</strong> in the race on Day {fortunePrediction.raceDay}!</p>
          </div>
        )}

        <button onClick={nextDay} className="next-day">Next Day</button>
      </div>
    </div>
  )
}

export default GameScreen