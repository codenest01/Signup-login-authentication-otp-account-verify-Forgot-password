import React from 'react';
import styles from '../../styles/publicpages/Home.module.css';


function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to My Beautiful Homepage</h1>
        <p className={styles.subtitle}>Creating stunning web experiences with React</p>
      </header>

      <section className={styles.about}>
        <h2 className={styles.sectionTitle}>About Us</h2>
        <p className={styles.sectionContent}>
          We are dedicated to delivering high-quality web solutions that not only meet but exceed your expectations.
          Our team of skilled developers and designers work collaboratively to build user-friendly and visually
          appealing websites.
        </p>
      </section>

      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
        <div className={styles.serviceList}>
          <div className={styles.serviceItem}>
            <h3>Web Development</h3>
            <p>Creating responsive and dynamic websites using the latest technologies.</p>
          </div>
          <div className={styles.serviceItem}>
            <h3>UI/UX Design</h3>
            <p>Designing intuitive and engaging user interfaces for a better user experience.</p>
          </div>
          <div className={styles.serviceItem}>
            <h3>Consulting</h3>
            <p>Offering expert advice to help you make informed decisions about your web strategy.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 My Beautiful Homepage. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
