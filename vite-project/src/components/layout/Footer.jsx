import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { SiVisa, SiMastercard, SiApplepay } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase fw-bold text-success">BIMBA CORPORATION</h5>
            <p className="text-white-50">
              Найкращі товари для вашого розвитку та комфорту. Працюємо з 2025 року з любов’ю до клієнтів.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start mt-3">
              <a href="#" className="text-light fs-5"><FaFacebookF /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaTelegramPlane /></a>
              <a href="#" className="text-light fs-5"><FaWhatsapp /></a>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold text-success">Інформація</h6>
            <ul className="list-unstyled text-white-50">
              <li><a href="#" className="text-decoration-none text-white-50">Про нас</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">Блог</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">Закон</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">FAQ</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">Акції</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold text-success">Категорії</h6>
            <ul className="list-unstyled text-white-50">
              <li><a href="#" className="text-decoration-none text-white-50">Насіння</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">Все для вирощування</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">Бонги та аксесуари</a></li>
              <li><a href="#" className="text-decoration-none text-white-50">CBD Товари</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold text-success">Контакти</h6>
            <p className="text-white-50 mb-1">м. Здолбунів, вул. Лесі Українки 3</p>
            <p className="text-white-50 mb-1">+38 (097) 422 7 345</p>
            <p className="text-white-50 mb-3">info@bimba.ua</p>
            <div className="d-flex gap-3">
              <SiVisa size={30} className="text-primary" />
              <SiMastercard size={30} className="text-danger" />
              <SiApplepay size={30} className="text-light" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-white-50 border-top border-secondary pt-3 mt-3">
        © 2025 BIMBA CORPORATION — Усі права захищені.
      </div>
    </footer>
  );
};

export default Footer;
