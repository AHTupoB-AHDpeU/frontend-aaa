import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Review from "./Review";
import Service from "./Service";
import Modal from './Modal';
import FAQ from "./faq";
import Footer from './Footer';
import Privace from "./Privace";
import ScrollToTop from './components/ScrollToTop';
import config from './config';

//const API_BASE = 'http://localhost:8000/api';
const API_BASE = `${config.API_BASE_URL}/api`;


const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push("Пароль должен содержать минимум 8 символов");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    }
    if (!/(?=.*\d)/.test(password)) {
        errors.push("Пароль должен содержать хотя бы одну цифру");
    }

    return errors;
};

function AuthModal({ isOpen, onClose, onLoginSuccess, showAuthRequiredMessage, onHideAuthMessage }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordErrors([]);

        if (!isLogin) {
            const passwordValidationErrors = validatePassword(password);
            if (passwordValidationErrors.length > 0) {
                setPasswordErrors(passwordValidationErrors);
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                // Вход
                const response = await fetch(`${API_BASE}/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: email,
                        password: password
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onLoginSuccess(data.user, true);
                    onClose();
                } else {
                    if (data.non_field_errors) {
                        setError(data.non_field_errors[0]);
                    } else if (data.detail) {
                        setError(data.detail);
                    } else {
                        setError("Неверные учетные данные");
                    }
                }
            } else {
                // Регистрация
                const response = await fetch(`${API_BASE}/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: email,
                        email: email,
                        password: password,
                        first_name: name
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setError('');
                    setIsLogin(true);
                    setPassword('');
                    setError("Регистрация прошла успешно! Теперь вы можете войти.");
                } else {
                    if (data.username) {
                        setError("Пользователь с таким email уже существует");
                    } else if (data.email) {
                        setError("Некорректный email адрес");
                    } else if (data.password) {
                        setError("Пароль не удовлетворяет требованиям");
                    } else {
                        setError("Произошла ошибка при регистрации");
                    }
                }
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (!isLogin) {
            setPasswordErrors(validatePassword(newPassword));
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
        setPasswordErrors([]);
    };

    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setPasswordErrors([]);
        setPassword('');
        if (onHideAuthMessage) {
            onHideAuthMessage();
        }
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    useEffect(() => {
        if ((email || password || name) && onHideAuthMessage) {
            onHideAuthMessage();
        }
    }, [email, password, name, onHideAuthMessage]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>

            {showAuthRequiredMessage && (
                <div style={{
                    color: 'red',
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#fff0f0',
                    border: '1px solid red',
                    fontSize: '14px'
                }}>
                    Для выполнения этого действия необходимо авторизоваться на сайте.
                </div>
            )}

            {error && (
                <div style={{
                    color: error.includes('успешно') ? 'green' : 'red',
                    marginBottom: '10px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: error.includes('успешно') ? '#f0fff0' : '#fff0f0',
                    border: `1px solid ${error.includes('успешно') ? 'green' : 'red'}`
                }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="input-group">
                        <label htmlFor="auth-name-input">Ваше имя</label>
                        <input
                            id="auth-name-input"
                            type="text"
                            placeholder="Введите ваше имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="auth-input"
                            required={!isLogin}
                        />
                    </div>
                )}
                <div className="input-group">
                    <label htmlFor="auth-email-input">Электронная почта</label>
                    <input
                        id="auth-email-input"
                        type="email"
                        placeholder="Укажите ваш email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        title="Введите корректный email адрес"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="auth-password-input">
                        Пароль
                        {!isLogin && " (минимум 8 символов, заглавная буква и цифра)"}
                    </label>
                    <input
                        id="auth-password-input"
                        type="password"
                        placeholder={isLogin ? "Введите пароль" : "Придумайте надежный пароль"}
                        value={password}
                        onChange={handlePasswordChange}
                        className="auth-input"
                        required
                        minLength={isLogin ? undefined : 8}
                    />
                    {passwordErrors.length > 0 && (
                        <div style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '5px'
                        }}>
                            {passwordErrors.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="auth-button"
                    disabled={loading || (!isLogin && passwordErrors.length > 0)}
                >
                    {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                </button>
            </form>

            <div className="auth-switch-bottom">
                <p>
                    {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                    <span
                        className="auth-switch-link"
                        onClick={handleSwitchMode}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                    >
                        {isLogin ? 'Регистрация здесь' : 'Авторизация здесь'}
                    </span>
                </p>
            </div>
        </Modal>
    );
}

function ProfileModal({ isOpen, onClose, user, onLogout, showSuccessMessage }) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE}/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            onLogout();
            setLoading(false);
            onClose();
        }
    };

    if (!isOpen || !user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Профиль</h2>

            {showSuccessMessage && (
                <div style={{
                    color: 'green',
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f0fff0',
                    border: '1px solid green'
                }}>
                    Успешный вход! Ваши данные представлены ниже.
                </div>
            )}

            <div className="input-group">
                <label htmlFor="profile-name">Имя</label>
                <input
                    id="profile-name"
                    type="text"
                    value={user.first_name || 'Не указано'}
                    className="auth-input"
                    readOnly
                />
            </div>

            <div className="input-group">
                <label htmlFor="profile-email">Электронная почта</label>
                <input
                    id="profile-email"
                    type="email"
                    value={user.email}
                    className="auth-input"
                    readOnly
                />
            </div>

            <button
                type="button"
                className="auth-button"
                onClick={handleLogout}
                disabled={loading}
            >
                {loading ? 'Выход...' : 'Выйти'}
            </button>
        </Modal>
    );
}

function PageTitle() {
    const location = useLocation();

    useEffect(() => {
        const titles = {
            '/': 'Грузоперевозки лесоматериалов - ИП Антипов А.В.',
            '/about': 'О нас',
            '/contact': 'Контакты',
            '/review': 'Отзывы',
            '/service': 'Услуги',
            '/faq': 'FAQ',
            '/privacy': 'Политика конфиденциальности',
        };

        const title = titles[location.pathname];
        document.title = title;
    }, [location.pathname]);

    return null;
}

function AppContent() {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSuccessLoginMessage, setShowSuccessLoginMessage] = useState(false);
    const [showAuthRequiredMessage, setShowAuthRequiredMessage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLoginSuccess = (userData, showSuccess = false) => {
        setUser(userData);
        if (showSuccess) {
            setShowSuccessLoginMessage(true);
            setIsProfileModalOpen(true);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setShowSuccessLoginMessage(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const handleOrderServiceClick = () => {
        if (user) {
            navigate('/service');
        } else {
            openAuthModal(true);
        }
    };

    const handleProfileClick = () => {
        if (user) {
            setIsProfileModalOpen(true);
        } else {
            openAuthModal(true);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const openAuthModal = (showMessage = false) => {
        setIsModalOpen(true);
        setShowAuthRequiredMessage(showMessage);
    };

    const handleCloseAuthModal = () => {
        setIsModalOpen(false);
        setShowAuthRequiredMessage(false);
    };

    return (
        <>
            <PageTitle />
            <style>
                {`
                .desktop-menu {
                    display: flex;
                    gap: 10px;
                    font-family: 'Oswald', sans-serif;
                }
                
                .mobile-menu-button {
                    display: none;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 30px;
                    height: 21px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                }
                
                .mobile-menu-button span {
                    display: block;
                    height: 3px;
                    width: 100%;
                    background-color: #1f2937;
                    border-radius: 3px;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu-button.active span:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }
                
                .mobile-menu-button.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-button.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }

                .mobile-menu-button:focus,
                .mobile-menu-button:active,
                .mobile-menu-button:focus-visible {
                    outline: none !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                .mobile-menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
                
                .mobile-menu-content {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 280px;
                    height: 100vh;
                    background-color: #ffffff;
                    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
                    transition: right 0.3s ease;
                    z-index: 1000;
                    padding: 20px 20px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow-y: auto;
                }
                
                .mobile-menu-content.open {
                    right: 0;
                }
                
                .mobile-nav-button {
                    border-radius: 30px;
                    padding: 16px 20px;
                    font-size: 30px;
                    background: none;
                    border: none;
                    outline: none;
                    color: #1f2937;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.3s ease;
                    font-family: 'Oswald', sans-serif;
                }

                .mobile-nav-button:focus,
                .mobile-nav-button:active,
                .mobile-nav-button:focus-visible {
                    outline: none !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: none !important;
                }
                
                .mobile-nav-button:hover {
                    background-color: #f3f4f6;
                    color: #8A2BE2;
                }
                
                .mobile-order-button {
                    border-radius: 30px;
                    padding: 16px 20px;
                    font-size: 30px;
                    background: #FFD700;
                    border: none;
                    outline: none;
                    color: #1f2937;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.3s ease;
                    font-family: 'Oswald', sans-serif;
                    margin-top: 20px;
                    width: 100%;
                    box-sizing: border-box;
                }

                .mobile-order-button:focus,
                .mobile-order-button:active,
                .mobile-order-button:focus-visible {
                    outline: none !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                .mobile-order-button:hover {
                    box-shadow: 0 0 0 3px #8A2BE2;
                }
                
                @media (max-width: 994px) {
                    .desktop-menu {
                        display: none;
                    }
                    
                    .mobile-menu-button {
                        display: flex;
                    }
                }
                
                @media (min-width: 995px) {
                    .mobile-menu-button {
                        display: none;
                    }
                }
                `}
            </style>

            <div style={{ maxWidth: "1600px", width: "100%", padding: "0 20px", boxSizing: "border-box", margin: "auto" }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    position: 'relative'
                }}>
                    <div style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#000',
                        fontFamily: 'Oswald, sans-serif',
                    }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#1f2937', fontFamily: 'Oswald, sans-serif' }}>
                            "ИП Антипов Александр Васильевич"
                        </Link>
                    </div>

                    <div className="desktop-menu">
                        <Link to="/">
                            <button className="nav-button">Главная</button>
                        </Link>
                        <Link to="/about">
                            <button className="nav-button">О нас</button>
                        </Link>
                        <Link to="/contact">
                            <button className="nav-button">Контакты</button>
                        </Link>
                        <Link to="/review">
                            <button className="nav-button">Отзывы</button>
                        </Link>
                        <Link to="/service">
                            <button className="nav-button">Услуги</button>
                        </Link>
                        <button
                            onClick={handleOrderServiceClick}
                            style={{
                                borderRadius: "30px",
                                padding: '8px 50px',
                                fontSize: '30px',
                                background: "#FFD700",
                                marginLeft: '30px',
                                outline: 'none',
                                border: 'none',
                                color: '#1f2937',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.boxShadow = '0 0 0 3px #8A2BE2';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Заказать услугу
                        </button>
                    </div>

                    <button
                        className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Меню"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
            )}
            <div className={`mobile-menu-content ${isMobileMenuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMobileMenu}>
                    <button className="mobile-nav-button">Главная</button>
                </Link>
                <Link to="/about" onClick={closeMobileMenu}>
                    <button className="mobile-nav-button">О нас</button>
                </Link>
                <Link to="/contact" onClick={closeMobileMenu}>
                    <button className="mobile-nav-button">Контакты</button>
                </Link>
                <Link to="/review" onClick={closeMobileMenu}>
                    <button className="mobile-nav-button">Отзывы</button>
                </Link>
                <Link to="/service" onClick={closeMobileMenu}>
                    <button className="mobile-nav-button">Услуги</button>
                </Link>

                {user ? (
                    <button
                        className="mobile-order-button"
                        onClick={() => {
                            closeMobileMenu();
                            setIsProfileModalOpen(true);
                        }}
                    >
                        Профиль
                    </button>
                ) : (
                    <button
                        className="mobile-order-button"
                        onClick={() => {
                            closeMobileMenu();
                            setIsModalOpen(true);
                        }}
                    >
                        Войти
                    </button>
                )}

                {user ? (
                    <Link to="/service" onClick={closeMobileMenu}>
                        <button className="mobile-order-button">
                            Заказать услугу
                        </button>
                    </Link>
                ) : (
                    <button
                        className="mobile-order-button"
                        onClick={() => {
                            closeMobileMenu();
                            openAuthModal(true);
                        }}
                    >
                        Заказать услугу
                    </button>
                )}
            </div>

            <div style={{ width: "100%", minHeight: "calc(80vh)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ maxWidth: "1600px", width: "100%", padding: "0 20px 40px", boxSizing: "border-box" }}>
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/review" element={<Review user={user} openAuthModal={openAuthModal} />} />
                        <Route path="/service" element={<Service user={user} openAuthModal={openAuthModal} />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/privacy" element={<Privace />} />
                    </Routes>
                </div>
            </div>

            {/* Модальные окна */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => {
                    setIsProfileModalOpen(false);
                    setShowSuccessLoginMessage(false);
                }}
                user={user}
                onLogout={handleLogout}
                showSuccessMessage={showSuccessLoginMessage}
            />
            <AuthModal
                isOpen={isModalOpen}
                onClose={handleCloseAuthModal}
                onLoginSuccess={handleLoginSuccess}
                showAuthRequiredMessage={showAuthRequiredMessage}
                onHideAuthMessage={() => setShowAuthRequiredMessage(false)}
            />

            <Footer onOpenProfileModal={handleProfileClick} />
        </>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AppContent />
        </Router>
    );
}

export default App;
