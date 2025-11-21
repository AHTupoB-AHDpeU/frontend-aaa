import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import AnimatedContent from './components/AnimatedContent'
import './Home.css';
import SplitText from "./components/SplitText";
import config from './config';

const API_BASE = `${config.API_BASE_URL}/api`;

function Home({ user }) {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/reviews/`);
                //const response = await fetch('http://localhost:8000/api/reviews/');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки отзывов');
                }

                const data = await response.json();
                setReviews(data.slice(0, 15));
            } catch (err) {
                setError(err.message);
                console.error('Ошибка при загрузке отзывов:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (ratingValue) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= ratingValue) {
                stars.push('⭐');
            } else {
                stars.push('');
            }
        }

        return stars.join('');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    useEffect(() => {
        if (reviews.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex =>
                prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [reviews.length]);

    useEffect(() => {
        if (carouselRef.current) {
            const cardWidth = 320;
            carouselRef.current.scrollTo({
                left: currentIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);

    const handleNavigateToServices = () => {
        navigate('/service');
    };

    const handleNavigateToAdmin = () => {
        window.open(`${config.API_BASE_URL}/admin/`, '_blank');
        //window.open('http://localhost:8000/admin/');
    };

    const isAdminOrStaff = user?.is_staff || user?.is_superuser;

    return (
        <div className="home-page">
            <div className="home-container">
                <div className="main-content-wrapper">
                    <AnimatedContent
                        distance={200}
                        direction="horizontal"
                        reverse={false}
                        duration={2.0}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity={true}
                        scale={1}
                        threshold={0.1}
                        delay={0.5}
                    >
                        <div className="left-image-section">
                            <img
                                src="/main-image.png"
                                alt="Главное изображение"
                                className="home-image-full"
                            />
                        </div>
                    </AnimatedContent>

                    <div className="right-text-section">
                        <div className="text-content">
                            <AnimatedContent
                                distance={200}
                                direction="vertical"
                                reverse={true}
                                duration={2.0}
                                ease="power3.out"
                                initialOpacity={0}
                                animateOpacity={true}
                                scale={1}
                                threshold={0.1}
                                delay={2.0}
                            >
                                <h1 className="main-title">НАДЁЖНОСТЬ,</h1>
                            </AnimatedContent>

                            <AnimatedContent
                                distance={200}
                                direction="vertical"
                                reverse={true}
                                duration={3.0}
                                ease="power3.out"
                                initialOpacity={0}
                                animateOpacity={true}
                                scale={1}
                                threshold={0.1}
                                delay={3.0}
                            >
                                <h1 className="main-title1">ПРОВЕРЕННАЯ</h1>
                            </AnimatedContent>

                            <AnimatedContent
                                distance={200}
                                direction="vertical"
                                reverse={true}
                                duration={2.0}
                                ease="power3.out"
                                initialOpacity={0}
                                animateOpacity={true}
                                scale={1}
                                threshold={0.1}
                                delay={4.0}
                            >
                                <h1 className="main-title2">КИЛОМЕТРАМИ</h1>
                            </AnimatedContent>
                        </div>
                    </div>
                </div>

                <div className="bottom-headers">
                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={true}
                        duration={1.5}
                        ease="power2.out"
                        initialOpacity={0}
                        animateOpacity={true}
                        threshold={0.1}
                        delay={0.8}
                    >
                        <div className="left-bottom-header">
                            <h2 className="decorative-header-left">Партнёр, на которого можно положиться</h2>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={true}
                        duration={1.5}
                        ease="power2.out"
                        initialOpacity={0}
                        animateOpacity={true}
                        threshold={0.1}
                        delay={1.0}
                    >
                        <div className="right-bottom-header">
                            <h2 className="decorative-header-right">Мы ценим ваше время так же, как и ваш груз</h2>
                        </div>
                    </AnimatedContent>
                </div>

                <div className="services-cta-section">
                    <button
                        className="services-cta-button"
                        onClick={handleNavigateToServices}
                    >
                        Перейти к услугам
                    </button>
                </div>

                <div className="admin-panel-section">
                    {isAdminOrStaff && (
                        <button
                            className="admin-panel-button"
                            onClick={handleNavigateToAdmin}
                        >
                            Административная панель Django
                        </button>
                    )}
                </div>

                <div className="reviews-carousel-section">
                    <div className="reviews-carousel-title">
                        Отзывы наших клиентов
                    </div>

                    {loading ? (
                        <div className="reviews-loading">Загрузка отзывов...</div>
                    ) : error ? (
                        <div className="reviews-error">Ошибка загрузки отзывов: {error}</div>
                    ) : reviews.length > 0 ? (
                        <div className="reviews-carousel-container">
                            <div
                                className="reviews-carousel"
                                ref={carouselRef}
                            >
                                {reviews.map(review => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-card-header">
                                            <h4 className="review-card-author">
                                                {review.user_first_name || review.user_username || 'Пользователь'}
                                            </h4>
                                            <div className="review-card-rating">
                                                {renderStars(review.rating_value)}
                                            </div>
                                        </div>
                                        <p className="review-card-service">Услуга: {review.service_name}</p>
                                        <p className="review-card-text">{review.description}</p>
                                        <div className="review-card-date">
                                            {formatDate(review.date)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="reviews-empty">Пока нет отзывов</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;