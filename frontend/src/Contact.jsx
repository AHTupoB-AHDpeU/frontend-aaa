import React from "react";
import SplitText from "./components/SplitText";
import './Contact.css';
import AnimatedContent from './components/AnimatedContent'

function Contact() {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <SplitText
                        text="Контакты"
                        className="contact-title"
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
                <div className="contact-cards">
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
                        <div className="contact-card">
                            <div className="card-icon">
                                <span>📞</span>
                            </div>
                            <h3 className="card-title">Связь с нами</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="contact-label">Телефон:</span>
                                    <span className="contact-value">+7 (921) 216-53-15</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Почта:</span>
                                    <span className="contact-value">antipov2371@yandex.ru</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Telegram:</span>
                                    <span className="contact-value">@antipov23</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">WhatsApp:</span>
                                    <span className="contact-value">+7 (921) 216-53-15</span>
                                </div>
                                <div className="social-links">
                                    <span className="social-link">VK</span>
                                    <span className="social-link">Telegram</span>
                                    <span className="social-link">WhatsApp</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>
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
                        delay={1.0}
                    >
                        <div className="contact-card">
                            <div className="card-icon">
                                <span>🕒</span>
                            </div>
                            <h3 className="card-title">Время работы</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="contact-label">Пн-Пт:</span>
                                    <span className="contact-value">9:00 - 18:00</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Сб:</span>
                                    <span className="contact-value">10:00 - 16:00</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Вс:</span>
                                    <span className="contact-value">Выходной</span>
                                </div>
                                <div className="time-zone">
                                    <span className="zone-label">Часовой пояс:</span>
                                    <span className="zone-value">МСК (UTC+3)</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>
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
                        delay={1.5}
                    >
                        <div className="contact-card">
                            <div className="card-icon">
                                <span>📍</span>
                            </div>
                            <h3 className="card-title">Адрес</h3>
                            <div className="contact-info">
                                <div className="address-item">
                                    <span className="address-label">Юр. адрес:</span>
                                    <span className="address-value">
                                        181007, Псковская область, Плюсский р-он, д Ореховно, ул. Центральная, д. 23
                                    </span>
                                </div>
                                <div className="address-item">
                                    <span className="address-label">Факт. адрес:</span>
                                    <span className="address-value">
                                        181000, Псковская область, Плюсский р-он, рп Плюсса, ул. Партизанская, д. 9, кв. 1
                                    </span>
                                </div>
                                <div className="work-area">
                                    <span className="area-label">Зона работы:</span>
                                    <span className="area-value">Псковская область</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>
                </div>

                <div className="contact-footer">
                    <p className="footer-text">
                        Свяжитесь с нами удобным для вас способом! Мы всегда рады помочь и ответить на ваши вопросы.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contact;