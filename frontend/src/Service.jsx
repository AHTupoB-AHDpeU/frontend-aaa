import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Service.css';
import SplitText from "./components/SplitText";
import config from './config';

const API_BASE = `${config.API_BASE_URL}/api`;

function OrderModal({ isOpen, onClose, selectedServices, services, user }) {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const totalCost = selectedServices.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service ? service.price : 0);
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/orders/create/`, {
            // response = await fetch('http://localhost:8000/api/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    services: selectedServices,
                    address: address,
                    total_cost: totalCost
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Заказ создан:', data);
                setSuccess(true);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || errorData.message || 'Ошибка при создании заказа');
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAddress('');
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
            <h2>Оформление заказа</h2>

            {success && (
                <div style={{
                    color: 'green',
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#f0fff0',
                    border: '1px solid green'
                }}>
                    Заказ успешно сформирован! С вами свяжутся в ближайшее время.
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
                        <label htmlFor="user-name-input">Имя</label>
                        <input
                            id="user-name-input"
                            type="text"
                            value={user?.first_name && user?.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user?.first_name || user?.username || 'Пользователь'}
                            className="auth-input"
                            readOnly
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="user-email-input">Электронная почта</label>
                        <input
                            id="user-email-input"
                            type="email"
                            value={user?.email || 'Не указано'}
                            className="auth-input"
                            readOnly
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </div>

                    <div className="input-group">
                        <label>Выбранные услуги</label>
                        <div className="selected-services-list">
                            {services
                                .filter(service => selectedServices.includes(service.id))
                                .map(service => (
                                    <div key={service.id} className="selected-service-item">
                                        <span className="service-name-text">{service.name}</span>
                                        <span className="service-price-text">{service.price} ₽</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="address-input">Адрес доставки</label>
                        <input
                            id="address-input"
                            type="text"
                            placeholder="Введите адрес доставки"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="auth-input"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="cost-output">Общая стоимость</label>
                        <input
                            id="cost-output"
                            type="text"
                            value={`${totalCost} ₽`}
                            readOnly
                            className="auth-input"
                            style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Оформление...' : 'Заказать'}
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Заказ будет обработан в ближайшее время.</p>
                </div>
            )}
        </Modal>
    );
}

function Service({ user, openAuthModal }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/services/`);
                //const response = await fetch('http://localhost:8000/api/services/');

                if (!response.ok) {
                    throw new Error('Ошибка загрузки услуг');
                }

                const data = await response.json();
                setServices(data);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка при загрузке услуг:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleServiceSelection = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    const handleOrder = () => {
        if (selectedServices.length === 0) {
            alert('Выберите хотя бы одну услугу для заказа');
            return;
        }

        if (!user) {
            openAuthModal(true);
            return;
        }

        setIsOrderModalOpen(true);
    };

    if (loading) {
        return (
            <div className="service-page">
                <div className="service-container">
                    <div className="centered-message loading-message">
                        Загрузка услуг...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="service-page">
                <div className="service-container">
                    <div className="centered-message error-message">
                        Ошибка загрузки услуг: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="service-page">
            <div className="service-container">
                <div className="service-header-section">
                    <div className="review-title-wrapper">
                        <SplitText
                            text="Каталог услуг"
                            className="service-title"
                            delay={50}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                        />
                    </div>
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Поиск услуг..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button className="search-button">
                            🔍︎
                        </button>
                    </div>
                </div>

                {services.length > 0 ? (
                    <>
                        <div className="services-grid">
                            {filteredServices.map(service => (
                                <div
                                    key={service.id}
                                    className={`service-card ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                                    onClick={() => toggleServiceSelection(service.id)}
                                >
                                    <div className="service-image">
                                        <img
                                            src={service.picture ? `http://localhost:8000${service.picture}` : '/services/service1.jpg'}
                                            alt={service.name}
                                            onError={(e) => {
                                                e.target.src = '/services/service1.jpg'; // Запасное изображение
                                            }}
                                        />
                                    </div>
                                    <div className="service-info">
                                        <h3 className="service-name">{service.name}</h3>
                                        <p className="service-description">{service.description}</p>
                                        <div className="service-price">{service.price} ₽</div>
                                    </div>
                                    <div className="service-check">
                                        {selectedServices.includes(service.id) ? '✓' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredServices.length === 0 && (
                            <div className="centered-message no-services-message">
                                Услуги по вашему запросу не найдены
                            </div>
                        )}

                        <div className="order-section">
                            <button
                                onClick={handleOrder}
                                className="order-button"
                                disabled={selectedServices.length === 0}
                            >
                                Оформить заказ ({selectedServices.length} услуг)
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="centered-message no-services-message">
                        Услуги временно недоступны
                    </div>
                )}

                <OrderModal
                    isOpen={isOrderModalOpen}
                    onClose={() => setIsOrderModalOpen(false)}
                    selectedServices={selectedServices}
                    services={services}
                    user={user}
                />
            </div>
        </div>
    );
}

export default Service;