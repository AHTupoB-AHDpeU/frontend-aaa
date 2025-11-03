import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer({ onOpenProfileModal }) {
    const legalInfo = {
        inn: "601600299126",
        name: "ИП Антипов Александр Васильевич",
        ogrnip: "318602700015558",
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section logo-section">
                    <img
                        width="80"
                        height="80"
                        src='vite.png'
                        alt="Логотип компании - грузоперевозки лесоматериалов"
                    />
                    <span className="site-name">
                        ИП Антипов Александр Васильевич<br />
                        Грузоперевозки лесоматериалов
                    </span>
                </div>

                <div className="footer-section nav-section">
                    <Link
                        to="#"
                        onClick={(e) => { e.preventDefault(); onOpenProfileModal(); }}
                        className="footer-nav-link"
                    >
                        Профиль
                    </Link>
                    <Link to="/about">О нас</Link>
                    <Link to="/contact">Контакты</Link>
                    <Link to="/review">Отзывы</Link>
                    <Link to="/service">Услуги</Link>
                    <Link to="/faq">FAQ</Link>
                </div>

                <div className="footer-section legal-section">
                    <p className="legal-info">
                        {legalInfo.name}<br />
                        ИНН: {legalInfo.inn}<br />
                        ОГРНИП: {legalInfo.ogrnip}<br />
                    </p>
                    <p className="footer-links">
                        <Link to="/privacy">Политика конфиденциальности</Link>
                    </p>
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} ИП Антипов Александр Васильевич - Грузоперевозки лесоматериалов.<br />
                        Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;