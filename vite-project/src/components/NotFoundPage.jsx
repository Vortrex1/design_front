import React from 'react'
import { useNavigate } from 'react-router-dom'
import errorGif from '../assets/gifs/error.gif'
import './NotFoundPage.css'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <div className="gif-container">
          <img src={errorGif} alt="Page not found" className="error-gif" />
        </div>
        <h1 className="error-title">Сторінку не знайдено</h1>
        <p className="error-message">
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена
        </p>
        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn-back">
            Повернутися назад
          </button>
          <button onClick={() => navigate('/')} className="btn-home">
            На головну
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
