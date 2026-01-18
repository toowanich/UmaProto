export const NOUNS = [
  'Thunder', 'Lightning', 'Storm', 'Wind', 'Fire', 'Blaze', 'Ember', 'Spark',
  'Shadow', 'Midnight', 'Eclipse', 'Void', 'Gold', 'Silver', 'Bronze', 'Copper',
  'Swift', 'Quick', 'Fast', 'Rapid', 'Star', 'Moon', 'Sun', 'Comet',
  'Arrow', 'Bullet', 'Flash', 'Dash', 'Spirit', 'Ghost', 'Phantom', 'Mystic',
  'Crystal', 'Diamond', 'Ruby', 'Sapphire', 'Tiger', 'Lion', 'Eagle', 'Falcon',
  'Rocket', 'Jet', 'Turbo', 'Nitro', 'Viper', 'Cobra', 'Python', 'Dragon',
  'Phoenix', 'Griffin', 'Pegasus', 'Unicorn', 'Warrior', 'Knight', 'Champion', 'Hero',
  'Ace', 'King', 'Queen', 'Prince', 'Duke', 'Baron', 'Lord', 'Master',
  'Flame', 'Frost', 'Ice', 'Snow', 'Rain', 'Mist', 'Cloud', 'Sky',
  'Ocean', 'River', 'Lake', 'Stream', 'Mountain', 'Peak', 'Summit', 'Ridge',
  'Valley', 'Canyon', 'Desert', 'Forest', 'Jungle', 'Prairie', 'Meadow', 'Field'
]

export const generateHorseNames = (count = 30) => {
  const names = []
  const used = new Set()
  
  while (names.length < count) {
    const noun1 = NOUNS[Math.floor(Math.random() * NOUNS.length)]
    const noun2 = NOUNS[Math.floor(Math.random() * NOUNS.length)]
    const horseName = `${noun1} ${noun2}`
    
    if (!used.has(horseName) && noun1 !== noun2) {
      names.push(horseName)
      used.add(horseName)
    }
  }
  
  return names
}

export const RACE_GRADES = {
  'Ungraded': { multiplier: 2, prestige: 'Local Race' },
  'G3': { multiplier: 3, prestige: 'Grade 3 Stakes' },
  'G2': { multiplier: 4, prestige: 'Grade 2 Stakes' },
  'G1': { multiplier: 6, prestige: 'Grade 1 Stakes' }
}

export const generateRaceGrade = () => {
  const grades = ['Ungraded', 'G3', 'G2', 'G1']
  const weights = [40, 35, 20, 5] // Higher chance for lower grades
  const random = Math.random() * 100
  let cumulative = 0
  
  for (let i = 0; i < grades.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) {
      return grades[i]
    }
  }
  return 'Ungraded'
}

export const selectRandomHorses = (horsePool, count = 4) => {
  const shuffled = [...horsePool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}