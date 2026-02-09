import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useActions from '../../hooks/useActions';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import REMOTE_HOST_NAME from "../../env/index";

import photoNotFound from '../../assets/images/photoNotFound.jpg';
import './homePage.css';


const API_URL = REMOTE_HOST_NAME + 'images/categoryImages/';

const HomePage = () => {
  const { getCategories } = useActions();
  const { categoryList } = useSelector(state => state.category);

  useEffect(() => {
    getCategories();
  }, []);
  // console.log("HomePage", categoryList);
  const mainCategories = categoryList?.filter(cat => !cat.parentId) || [];

  return (
    <div className="overflow-hidden">
      <section
        className="vh-100 d-flex align-items-center position-relative"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container className="text-center text-white">
          <h1 className="display-1 fw-bold mb-4">Свіжообсмажена кава</h1>
          <p className="fs-3 mb-5">Преміум сорти з найкращих куточків світу</p>
          <Link to="/product">
            <Button
              variant="outline-light"
              size="lg"
              className="rounded-pill px-5 py-3 fs-4"
            >
              Обрати каву
            </Button>
          </Link>

        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <Container className="py-5">
          <Row className="g-5">
            {mainCategories.map(category => (
              <React.Fragment key={category.id}>
                <Col lg={4} md={12}>
                  <div className="bg-white p-4 h-100 shadow-sm rounded d-flex flex-column">
                    {/* Фото головної категорії */}
                    <div className="mb-4">
                      <img
                        src={category.photo ? API_URL + category.photo : photoNotFound}
                        alt={category.name}
                        className="img-fluid rounded w-100 object-fit-cover"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Назва + кнопка */}
                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        <h2 className="fw-bold display-5">{category.name}</h2>
                        <p className="text-muted fs-5">
                          Найзарядженіша колекція {category.name.toLowerCase()}
                        </p>
                      </div>
                      <Link to={`/product/${category.id}`}>
                        <Button variant="warning" className="fw-bold px-4 py-2 mt-3 w-100">
                          ➜ Переглянути {category.name.toLowerCase()}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Col>

                <Col lg={8} md={12}>
                  <Row className="g-4">
                    {category.subCategories?.map(sub => (
                      <Col key={sub.id} lg={4} md={6}>
                        <Link
                          to={`/product/${sub.id}`}
                          className="text-decoration-none text-dark"
                        >
                          <Card className="h-100 border-0 shadow-sm">
                            <div style={{ height: '160px', overflow: 'hidden' }}>
                              <img
                                src={sub.photo ? API_URL + sub.photo : photoNotFound}
                                alt={sub.name}
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                            <Card.Body className="text-center">
                              <Card.Title className="fw-bold fs-5 mb-0">{sub.name}</Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </React.Fragment>
            ))}
          </Row>
        </Container>
      </section>

      {/* Video Section */}
      <section className="video-section py-5">
        <div className="video-bg-animation" />

        <Container className="py-5 position-relative">
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <div className="text-white">
                <div className="mb-4">
                  <span className="video-badge badge text-uppercase px-3 py-2 rounded-pill">
                    ✨ Liquid Gold
                  </span>
                </div>
                <h2 className="video-title display-3 fw-bold mb-4">
                  Мистецтво еспресо
                </h2>
                <p className="video-description fs-5 mb-4">
                  Кожна краплина — це шедевр. Чистий кавовий гіпноз у повільній зйомці.
                  Від зерна до чашки — це магія еспресо.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {['#espresso', '#slowmo', '#coffeeart', '#baristalife'].map(tag => (
                    <span key={tag} className="video-tag badge px-3 py-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Col>

            <Col lg={7}>
              <div className="position-relative">
                <div className="video-decorative-blur-left" />
                <div className="video-decorative-blur-right" />

                <div className="video-frame-container position-relative mx-auto">
                  <div className="video-glowing-border" />

                  <div className="video-wrapper" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src="https://www.youtube.com/embed/j_tFfOY-mLE?si=QAHRVbEB-YvdZ5V4"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>

                  <div className="video-corner-accent top-left" />
                  <div className="video-corner-accent top-right" />
                  <div className="video-corner-accent bottom-left" />
                  <div className="video-corner-accent bottom-right" />
                </div>

                <div className="text-center mt-4">
                  <p className="video-play-hint mb-2">
                    <i className="bi bi-play-circle me-2"></i>
                    Натисніть для перегляду
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container className="py-5">
          <Row className="g-5 text-center">
            <Col md={4}>
              <div
                className="d-inline-block p-4 bg-primary rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <i className="bi bi-globe fs-1 text-white"></i>
              </div>
              <h3 className="h2 fw-bold mb-3">Найкращі сорти</h3>
              <p className="text-muted fs-5">З плантацій Бразилії, Колумбії та Ефіопії</p>
            </Col>
            <Col md={4}>
              <div
                className="d-inline-block p-4 bg-primary rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <i className="bi bi-rocket fs-1 text-white"></i>
              </div>
              <h3 className="h2 fw-bold mb-3">Швидка доставка</h3>
              <p className="text-muted fs-5">Доставка в день замовлення по Києву</p>
            </Col>
            <Col md={4}>
              <div
                className="d-inline-block p-4 bg-primary rounded-circle mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                <i className="bi bi-gift fs-1 text-white"></i>
              </div>
              <h3 className="h2 fw-bold mb-3">Подарункова упаковка</h3>
              <p className="text-muted fs-5">Безкоштовна упаковка для ваших близких</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;