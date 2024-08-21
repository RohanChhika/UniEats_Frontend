import React from "react";
import aboutUsImage from '../Images/aboutus.png';
import burgerback from '../Images/burgerback.png';
import '../../App.css';

const Welcome = ({ showHeaderFooter = true }) => {
    return (
        <main className="home-screen"> 
            {showHeaderFooter && (
                <nav className="navbar">
                    <section className="navbar-logo">UNIEATS</section> 
                    {/* <ul className="navbar-links">
                        <li><LoginButton className="login-button" /></li>
                    </ul> */}
                </nav>
            )}

            <header className="hero-section" style={{ backgroundImage: `url(${burgerback})` }}>
                <section className="hero-content"> 
                    <h1>Welcome to UNIEATS</h1>
                    <p>Savor Every Moment, Every Meal</p>
                    {/* <button className="cta-button">Get Started</button> */}
                    {/* <LoginButton className="cta-button" /> */}
                    <aside className="hero-links"> 
                        <a href="#about" className="cta-button">About Us</a>
                        <a href="#features" className="cta-button">Our Service</a>
                    </aside>
                </section>
            </header>

            <section id="about" className="about-us-section">
                <figure className="image-container"> 
                    <img src={aboutUsImage} alt="About Us" />
                </figure>
                <article className="about-us-article">
                    <h1>About Us</h1>
                    <p>
                    Welcome to our Dining Services App, your ultimate companion for a personalized and seamless campus dining experience. 
                    </p>
                    <p>
                    Our mission is to enhance the way students, faculty, and staff interact with campus dining facilities and meal plans. With our app, you’ll have real-time access to dining menus across all campus facilities, empowering you to make informed choices about your meals. Manage your dietary preferences and restrictions with ease, track and manage your meal plan credits, and make reservations at your favorite dining spots, all from the palm of your hand. Plus, our integrated feedback system ensures that your voice is heard and helps us continually improve the quality of our dining services. Join us in transforming campus dining into a more enjoyable and efficient experience!
                    </p>
                </article>
            </section>

            <section id="features" className="features-section">
                <h2>Our Services</h2>
                <article className="features-container"> 
                    <section className="feature"> 
                        <h3>Restaurant Listings</h3>
                        <p>Explore a curated list of campus restaurants, each offering diverse menus that cater to various dietary preferences and requirements. Whether you’re looking for a quick bite or a full meal, you’ll find the perfect spot on our platform.</p>
                    </section>
                    <section className="feature">
                        <h3>Online Reservations</h3>
                        <p>Secure your spot at your favorite campus restaurant by making reservations directly through our app. Plan your dining experience around your schedule without the worry of long waits.
                        </p>
                    </section>
                    <section className="feature">
                        <h3>Meal Pre-ordering and Pickup</h3>
                        <p>Order your meals in advance and pick them up at your convenience. This service ensures that your food is ready when you are, saving you time during your busy day.</p>
                    </section>
                    <section className="feature">
                        <h3>Restaurant Reviews and Ratings</h3>
                        <p>Share your dining experiences by leaving reviews and ratings for campus restaurants. Your feedback helps improve services and guide others in making their dining choices.</p>
                    </section>
                </article>
            </section>

            {showHeaderFooter && (
                <footer className="footer">
                    <p>© 2024 UNIEATS. All rights reserved.</p>
                    <aside className="footer-links"> 
                        <a href="#about">About Us</a>
                        <a href="#features">Our Services</a>
                    </aside>
                </footer>
            )}            
        </main>
    );
};

export default Welcome;
