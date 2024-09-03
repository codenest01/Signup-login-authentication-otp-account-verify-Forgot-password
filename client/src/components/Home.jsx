import React from 'react';
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div>
      <div>
        <h1 className={styles.header}>Home page</h1>
        <button className={styles.button}>Button</button>
        <br />
        <div className={`${styles.box} text-center bg-info text-danger`}>Box</div>
      </div>
    </div>
  );
}

export default Home;
