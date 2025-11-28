import './Manager.css';
import SplitText from "./components/SplitText";
import config from './config';
import { useState, useEffect, useRef } from 'react';
import AnimatedContent from './components/AnimatedContent'

const API_BASE = `${config.API_BASE_URL}/api`;
function Manager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});

    const CustomSelect = ({ value, onChange, options, disabled }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (selectRef.current && !selectRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handleSelect = (optionValue) => {
            onChange(optionValue);
            setIsOpen(false);
        };

        const selectedOption = options.find(opt => opt.value === value);

        return (
            <div className="custom-select" ref={selectRef}>
                <div
                    className={`select-header ${isOpen ? 'open' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    style={{
                        backgroundColor: getStatusColor(value),
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                >
                    <span className="select-value">{selectedOption?.label}</span>
                    <span className="select-arrow">▼</span>
                </div>
                {isOpen && (
                    <div className="select-options">
                        {options.map(option => (
                            <div
                                key={option.value}
                                className={`select-option ${option.value === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                                style={{
                                    backgroundColor: option.value === value ? getStatusColor(option.value) : 'white'
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/manager/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки заказов');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/orders/${orderId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Ошибка обновления статуса');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, status_display: getStatusDisplayName(newStatus) }
                        : order
                )
            );
        } catch (err) {
            console.error('Ошибка при обновлении статуса:', err);
            alert('Не удалось обновить статус заказа');
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': '#f59e0b',
            'confirmed': '#3b82f6',
            'in_progress': '#8b5cf6',
            'completed': '#10b981',
            'cancelled': '#ef4444'
        };
        return colors[status] || '#e0e0e0';
    };

    const getStatusDisplayName = (status) => {
        const statusMap = {
            'pending': 'Ожидает обработки',
            'confirmed': 'Подтвержден',
            'in_progress': 'В работе',
            'completed': 'Завершен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    };

    const statusOptions = [
        { value: 'pending', label: 'Ожидает обработки' },
        { value: 'confirmed', label: 'Подтвержден' },
        { value: 'in_progress', label: 'В работе' },
        { value: 'completed', label: 'Завершен' },
        { value: 'cancelled', label: 'Отменен' }
    ];

    if (loading) return <div className="loading">Загрузка заказов...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="manager-page">
            <div className="manager-container">
                <div className="manager-header-section">
                    <div className="manager-title-wrapper">
                        <SplitText
                            text="Заказы"
                            className="manager-title"
                            delay={50}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="left"
                        />
                    </div>
                </div>

                <AnimatedContent
                    distance={200}
                    direction="vertical"
                    reverse={false}
                    duration={2.0}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity={true}
                    scale={1}
                    threshold={0.1}
                    delay={0.5}
                >
                    <div className="orders-grid">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h3 className="order-id">Заказ #{order.id}</h3>
                                    <div className="status-section">
                                        <CustomSelect
                                            value={order.status}
                                            onChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                                            options={statusOptions}
                                            disabled={updatingStatus[order.id]}
                                        />
                                        {updatingStatus[order.id] && (
                                            <div className="status-updating">Обновление...</div>
                                        )}
                                    </div>
                                </div>

                                <div className="order-content">
                                    <div className="order-field">
                                        <label>Клиент:</label>
                                        <div className="client-info">
                                            <span className="client-name">{order.user_full_name}</span>
                                            <span className="client-email">{order.user_email}</span>
                                        </div>
                                    </div>

                                    <div className="order-field">
                                        <label>Адрес доставки:</label>
                                        <p className="address-text">{order.address}</p>
                                    </div>

                                    <div className="order-field">
                                        <label>Услуги:</label>
                                        <div className="services-list">
                                            {order.services_details.map(service => (
                                                <div key={service.id} className="service-item">
                                                    <span className="service-name">{service.name}</span>
                                                    <span className="service-price">{service.price} руб.</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="order-footer">
                                    <div className="total-section">
                                        <span className="total-label">Общая стоимость:</span>
                                        <span className="total-amount">{order.total_cost} руб.</span>
                                    </div>
                                    <div className="order-date">
                                        {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedContent>

                {orders.length === 0 && !loading && (
                    <div className="empty-state">
                        <p>Заказов пока нет</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Manager;