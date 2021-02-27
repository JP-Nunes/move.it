import styles from '../styles/components/Profile.module.css';

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      <img src="https://avatars.githubusercontent.com/u/51239826?s=460&u=aa1e806fc6a256c7e607c3b9b889c8e656e8da87&v=4" alt="user avatar"/>
      <div>
        <strong>João Pedro Nunes</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level 1</p>
      </div>
    </div>
  )
}