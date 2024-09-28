import React from 'react';
import styles from '../styles/layout/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
    const openNav = () => {
        document.getElementById("sidenav").style.right = "0";
    };

    const closeNav = () => {
        document.getElementById("sidenav").style.right = "-250px";
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
                <div className="container-fluid">
                    <a className={`navbar-brand ${styles.navbarBrand}`} href="#">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYgKahTUWr5UWxj2GJgPg3AO-RoJWspja8w&s" alt="" />
                    </a>

                    <div className={styles.openButtonContainer}>
                        <button className={styles.openButton} onClick={openNav}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>

                    <div className={styles.sidenav} id="sidenav">
                        <button className={`bg-info ${styles.cutIcon}`} onClick={closeNav}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <a href="#" className={styles.sidenavLink}>Home</a>
                        <a href="#" className={styles.sidenavLink}>About</a>
                        <a href="#" className={styles.sidenavLink}>Services</a>
                        <a href="#" className={styles.sidenavLink}>Contact</a>
                    </div>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-lg-0">
                        <li className="nav-item">
                                <a className={styles.navLink} href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className={styles.navLink} href="#">About</a>
                            </li>
                            <li className="nav-item">
                                <a className={styles.navLink} href="#">Services</a>
                            </li>
                            <li className="nav-item">
                                <a className={styles.navLink} href="#">Contact</a>
                            </li>
                            <li className="nav-item">
                                <a className={styles.navLink} href="#">Blog</a>
                            </li>
                        </ul>
                        <div className={`d-none d-lg-flex ${styles.searchBar}`}>
                            <input type="text" className={styles.searchBarInput} placeholder="Type to search..." />
                            <button type="button" className={styles.searchBarButton}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
