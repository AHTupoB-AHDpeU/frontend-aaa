import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Review.css';
import SplitText from "./components/SplitText";

function ReviewModal({ isOpen, onClose, user, services, ratings, onReviewCreated }) {
    const [selectedService, setSelectedService] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedService || !selectedRating || !reviewText) {
            setError('Все поля обязательны для заполнения');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/reviews/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    service: parseInt(selectedService),
                    rating: parseInt(selectedRating),
                    description: reviewText
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Отзыв создан:', data);
                setSuccess(true);
                if (onReviewCreated) {
                    onReviewCreated();
                }
            } else {
                const errorData = await response.json();
                setError(errorData.detail || errorData.message || 'Ошибка при создании отзыва');
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedService('');
        setSelectedRating('');
        setReviewText('');
        setError('');
        setSuccess(false);
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Оставить отзыв</h2>

            {success && (
                <div style={{
                    color: 'green',
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#f0fff0',
                    border: '1px solid green'
                }}>
                    Отзыв успешно опубликован!
                </div>
            )}

            {error && (
                <div style={{
                    color: 'red',
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#fff0f0',
                    border: '1px solid red'
                }}>
                    {error}
                </div>
            )}

            {!success ? (
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="user-name-input">Имя пользователя</label>
                        <input
                            id="user-name-input"
                            type="text"
                            value={user?.first_name || user?.username || 'Пользователь'}
                            className="auth-input"
                            readOnly
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="service-select">Услуга</label>
                        <select
                            id="service-select"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="auth-input"
                            style={{ fontSize: '16px' }}
                            required
                        >
                            <option value="">Выберите услугу</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="rating-select">Оценка</label>
                        <select
                            id="rating-select"
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="auth-input"
                            style={{ fontSize: '16px' }}
                            required
                        >
                            <option value="">Выберите оценку</option>
                            {ratings.map(rating => (
                                <option key={rating.id} value={rating.id}>
                                    {rating.value} ⭐️{''.repeat(5 - Math.floor(rating.value))}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="review-textarea">Текст отзыва</label>
                        <textarea
                            id="review-textarea"
                            placeholder="Напишите ваш отзыв здесь..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="auth-input"
                            style={{
                                minHeight: '100px',
                                resize: 'vertical',
                                height: 'auto',
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Публикация...' : 'Опубликовать'}
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Спасибо за ваш отзыв!</p>
                </div>
            )}
        </Modal>
    );
}

function Review({ user, openAuthModal }) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [reviewsResponse, servicesResponse, ratingsResponse] = await Promise.all([
                fetch('http://localhost:8000/api/reviews/'),
                fetch('http://localhost:8000/api/services/'),
                fetch('http://localhost:8000/api/ratings/')
            ]);

            if (!reviewsResponse.ok || !servicesResponse.ok || !ratingsResponse.ok) {
                throw new Error('Ошибка загрузки данных');
            }

            const reviewsData = await reviewsResponse.json();
            const servicesData = await servicesResponse.json();
            const ratingsData = await ratingsResponse.json();

            setReviews(reviewsData);
            setServices(servicesData);
            setRatings(ratingsData);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке данных:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Оценки в звездочки
    const renderStars = (ratingValue) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= ratingValue) {
                stars.push('⭐️');
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

    const handleLeaveReview = () => {
        if (!user) {
            openAuthModal(true);
            return;
        }

        setIsReviewModalOpen(true);
    };

    if (loading) {
        return (
            <div className="review-page">
                <div className="review-container">
                    <div className="centered-message loading-message">
                        Загрузка отзывов...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="review-page">
                <div className="review-container">
                    <div className="centered-message error-message">
                        Ошибка загрузки отзывов: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="review-page">
            <div className="review-container">
                <div className="review-header-section">
                    <div className="review-title-wrapper">
                        <SplitText
                            text="Отзывы"
                            className="review-title"
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                        />
                    </div>
                    <button
                        onClick={handleLeaveReview}
                        className="review-header-button"
                    >
                        Оставить отзыв
                    </button>
                </div>

                {reviews.length > 0 ? (
                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-item-header">
                                    <h3 className="review-author">
                                        {review.user_first_name || review.user_username || 'Пользователь'}
                                    </h3>
                                    <div className="review-rating">
                                        {renderStars(review.rating_value)}
                                    </div>
                                </div>
                                <p className="review-service">Услуга: {review.service_name}</p>
                                <p className="review-text">{review.description}</p>
                                <div className="review-date">
                                    {formatDate(review.date)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="centered-message no-reviews-message">
                        Пока нет отзывов. Будьте первым!
                    </div>
                )}

                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    user={user}
                    services={services}
                    ratings={ratings}
                />
            </div>
        </div>
    );
}

export default Review;