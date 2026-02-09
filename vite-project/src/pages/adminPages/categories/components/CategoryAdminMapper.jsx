import { Tree } from "primereact/tree";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmationModalCategoryDelete from "./ConfirmationModalCategoryDelete";
import "./index.css";
import "../../AdminPages.css";
import REMOTE_HOST_NAME from "../../../../env";
import photoNotFound from '../../../../assets/images/photoNotFound.jpg';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const API_URL = REMOTE_HOST_NAME + 'images/categoryImages/';

const CategoryAdminMapper = () => {
  const { categoryList } = useSelector((store) => store.category);
  const [categoryId, setCategoryId] = useState("");

  // Мапинг категорій у дерево
  const mapCategoriesToCategoryTree = (categoryList) => {
    return categoryList.map((item) => {
      const tree = {
        id: item.id,
        key: item.id,
        label: item.name,
        icon: item.photo || null, // Встановлюємо null, якщо фото немає
        children: item.subCategories
          ? mapCategoriesToCategoryTree(item.subCategories)
          : [],
      };
      return tree;
    });
  };

  const categoryNodeTemplate = (item) => {
    return (
      <>
        <div className="d-inline-block">
          {/* Обробка зображення */}
          {item.icon ? (
            <img
              src={API_URL + item.icon}
              className="admin-category-img mx-3"
              alt="image"
              onError={(e) => {
                e.target.src = photoNotFound; // Підставна картинка, якщо помилка
                e.target.onerror = null; // Зупиняємо рекурсивну помилку
              }}
            />
          ) : (
            <img
              src={photoNotFound}
              className="admin-category-img mx-3"
              alt="image"
            />
          )}
          <span className="p-treenode-label">{item.label}</span>
        </div>

        <div className="iconStyle">
          <Link
            title="Редагувати категорію"
            to={`/admin/category/update/${item.key}`}
            className="admin-luxury-action-btn"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Link>

          <button
            title="Видалити категорію"
            className="admin-luxury-action-btn danger"
            data-bs-toggle="modal"
            data-bs-target="#categoryDeleteModal"
            onClick={() => setCategoryId(item.id || "")}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <ConfirmationModalCategoryDelete id={categoryId} />
      <div className="admin-luxury-tree-container">
        <Tree
          value={mapCategoriesToCategoryTree(categoryList)}
          nodeTemplate={categoryNodeTemplate}
          className="w-full md:w-50rem p-tree"
        />
      </div>
    </>
  );
};

export default CategoryAdminMapper;