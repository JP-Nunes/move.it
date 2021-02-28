import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'

import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  levelUp: () => void;
  openLevelUpModal: () => void;
  closeLevelUpModal: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(requestPermissionForNotification, []);
  useEffect(createCookies, [level, currentExperience, challengesCompleted])

  function requestPermissionForNotification() {
    Notification.requestPermission();
  }

  function createCookies() {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }

  function levelUp() {
    setLevel(level + 1);
    openLevelUpModal();
  }

  function openLevelUpModal() {
    setIsLevelUpModalOpen(true)
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex];
    setActiveChallenge(challenge);
    playNotifications(challenge);
  }

  function playNotifications(challenge) {
    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio 🎉', {
        body: `Valendo ${challenge.amount}xp`
      })
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if (!activeChallenge) return
    const { amount: gainedExperience } = activeChallenge;
    let totalExperience = currentExperience + gainedExperience;
    levelUpIfExperienceIsEnough(totalExperience);
    raiseExperienceBarIfExpIsNotEnoughToLevelUp(totalExperience);
  }

  function levelUpIfExperienceIsEnough(experience) {
    if (experience >= experienceToNextLevel) {
      levelUp()
      const experienceLeftover = experience - experienceToNextLevel;
      setCurrentExperience(experienceLeftover);
      setActiveChallenge(null);
      setChallengesCompleted(challengesCompleted + 1);
    }
  }

  function raiseExperienceBarIfExpIsNotEnoughToLevelUp(experience) {
    if (experience < experienceToNextLevel) {
      setCurrentExperience(experience);
      setActiveChallenge(null);
      setChallengesCompleted(challengesCompleted + 1);
    }
  }

  return (
    <ChallengesContext.Provider 
      value={{ 
        level, 
        currentExperience,
        challengesCompleted,
        activeChallenge,
        experienceToNextLevel,
        levelUp,
        openLevelUpModal,
        closeLevelUpModal,
        startNewChallenge,
        resetChallenge,
        completeChallenge
      }} 
    >
      {children}

      { isLevelUpModalOpen && <LevelUpModal /> }
    </ChallengesContext.Provider>
  )
}