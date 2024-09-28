// components/Footer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import styles from '../styles/layout/Footer.module.css'; // Create or update this CSS file

const Footer = () => {
    return (
        <footer className={`bg-dark text-white ${styles.footer}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>Products</h5>
                        <ul className={styles.footerList}>
                            <li><a href="#" className={styles.footerLink}>Product 1</a></li>
                            <li><a href="#" className={styles.footerLink}>Product 2</a></li>
                            <li><a href="#" className={styles.footerLink}>Product 3</a></li>
                            <li><a href="#" className={styles.footerLink}>Product 4</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Useful Links</h5>
                        <ul className={styles.footerList}>
                            <li><a href="#" className={styles.footerLink}>Link 1</a></li>
                            <li><a href="#" className={styles.footerLink}>Link 2</a></li>
                            <li><a href="#" className={styles.footerLink}>Link 3</a></li>
                            <li><a href="#" className={styles.footerLink}>Link 4</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Addresses</h5>
                        <ul className={styles.footerList}>
                            <li><a href="#" className={styles.footerLink}>Address 1</a></li>
                            <li><a href="#" className={styles.footerLink}>Address 2</a></li>
                            <li><a href="#" className={styles.footerLink}>Address 3</a></li>
                            <li><a href="#" className={styles.footerLink}>Address 4</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <div className="d-flex justify-content-center mb-3">
                        <a href="#" className={`text-white ${styles.socialIcon}`}>
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className={`text-white ${styles.socialIcon}`}>
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="#" className={`text-white ${styles.socialIcon}`}>
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="#" className={`text-white ${styles.socialIcon}`}>
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                    <p>&copy; 2024 E-Commerce Site. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
