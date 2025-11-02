import React from "react";
import SplitText from "./components/SplitText";
import './About.css';

function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-header">
                    <SplitText
                        text="О нас"
                        className="about-title"
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                    />
                </div>

                <div className="about-content">
                    <div className="about-text">
                        <h2 className="about-subtitle">
                            Наша деятельность
                        </h2>
                        <p className="about-paragraph">
                            Представляем индивидуального предпринимателя, специализирующегося на грузоперевозках
                            лесоматериалов в Псковской области. Работаем на надежной
                            технике УРАЛ, обеспечивающей перевозку любых объемов лесоматериалов.
                        </p>
                        <p className="about-paragraph">
                            Наша основная задача - обеспечить своевременную и бережную доставку
                            лесоматериалов от места заготовки до пункта назначения. Ценим каждого
                            клиента и стремимся к долгосрочному сотрудничеству.
                        </p>
                        <p className="about-paragraph">
                            Работаем с различными видами лесоматериалов: кругляк, пиломатериалы,
                            дрова, щепа. Имеем опыт работы как с частными лицами, так и с
                            лесозаготовительными компаниями.
                        </p>
                        <p className="about-paragraph">
                            Работаем с 2010 года.
                        </p>
                        <p className="about-paragraph">
                            Представляем индивидуального предпринимателя, специализирующегося на грузоперевозках
                            лесоматериалов в Псковской области. Работаем на надежной
                            технике УРАЛ, обеспечивающей перевозку любых объемов лесоматериалов.
                        </p>
                        <p className="about-paragraph">
                            Представляем индивидуального предпринимателя, специализирующегося на грузоперевозках.
                        </p>


                        <div className="about-features">
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>Надежная техника УРАЛ</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>Своевременная доставка</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>Большой опыт работы</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>Работа по договору</span>
                            </div>
                        </div>
                    </div>

                    <div className="about-image-section">
                        <div className="image-wrapper">
                            <img
                                src="/about-image.jpg"
                                alt="Наша команда"
                                className="about-image"
                            />
                            <div className="image-border"></div>
                        </div>

                        <div className="image-caption">
                            <p>Наша рабочая техника - УРАЛ для перевозки лесоматериалов</p>
                        </div>
                    </div>
                </div>

                <div className="about-why">
                    <h3 className="why-title">
                        Почему обращаются к нам
                    </h3>
                    <div className="reasons-grid">
                        <div className="reason-card">
                            <div className="reason-icon">
                                <span>🚛</span>
                            </div>
                            <h4 className="reason-title">Надежная техника</h4>
                            <p className="reason-text">
                                Работаем на грузовиках УРАЛ, проверенных временем и подходящих для лесных дорог
                            </p>
                        </div>
                        <div className="reason-card">
                            <div className="reason-icon">
                                <span>⏱️</span>
                            </div>
                            <h4 className="reason-title">Соблюдение сроков</h4>
                            <p className="reason-text">
                                Ценим ваше время и гарантируем доставку в оговоренные сроки
                            </p>
                        </div>
                        <div className="reason-card">
                            <div className="reason-icon">
                                <span>💝</span>
                            </div>
                            <h4 className="reason-title">Поддержка</h4>
                            <p className="reason-text">
                                Всегда готовы помочь нашим клиентам и партнерам
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;