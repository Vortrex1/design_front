// src/pages/myProfile/MyProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import noImgUser from '../../assets/images/noImgUser.png';
import REMOTE_HOST_NAME from '../../env/index';
import useActions from '../../hooks/useActions';

const IMAGE_API_URL = REMOTE_HOST_NAME + 'images/userImages/';

const MyProfilePage = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const user1 = useSelector(state => state.users.user);
  const [user, setUser] = useState(user1);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { getUser, updateUser, uploadImage } = useActions();

  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("user", user);
    console.log("user1", user1);
  }, [currentUser?.id]);


  useEffect(() => {
    if (currentUser) {
      getUser(currentUser.id);
    }
  }, [currentUser?.id]);


  useEffect(() => {
    if (user1) {
      debugger
      setUser(user1);
    }
  }, [user1]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  // // const response = await axios.get(`${API_URL}get-by-id/${currentUser.id}`);
  // console.log('response', response);
  // console.log("currentUser", currentUser);
  // console.log("user1", user1);


  // setUser(response.data);
  //   } catch (error) {
  //     toast.error('Помилка завантаження даних');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // fetchUserData();
  // }, [currentUser.id, user.photo]);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const updateData = {
        email: user.email,
        name: user.name,
        surname: user.surname,
        patronymic: user.patronymic,
      };
      updateUser(user.id, updateData);
      toast.success('Профіль оновлено успішно');
    } catch (error) {
      toast.error('Помилка оновлення профілю');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Оновлення аватарки
  const handleUpdateAvatar = async () => {
    if (!selectedFile) return;
    setIsUpdatingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('ImageFile', selectedFile);
      uploadImage(currentUser.id, formData);
      toast.success('Аватар оновлено успішно');
    } catch (error) {
      toast.error('Помилка оновлення аватарки');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };



  return (
    <div className="container mt-5">
      <div className="row">
        {/* Ліва колонка - аватар */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img
                src={user?.photo ? IMAGE_API_URL + user?.photo : noImgUser}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <input
                type="file"
                className="form-control mb-3"
                onChange={handleFileChange}
              />
              <div className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleUpdateAvatar}
                  disabled={!selectedFile || isUpdatingAvatar}
                >
                  {isUpdatingAvatar ? 'Завантажуємо...' : 'Оновити аватар'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Права колонка - дані профілю */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Мій профіль</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={user?.email || ''}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ім'я</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={user?.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Прізвище</label>
                  <input
                    type="text"
                    name="surname"
                    className="form-control"
                    value={user?.surname || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">По-батькові</label>
                  <input
                    type="text"
                    name="patronymic"
                    className="form-control"
                    value={user?.patronymic || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Зберігаємо...' : 'Оновити профіль'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;