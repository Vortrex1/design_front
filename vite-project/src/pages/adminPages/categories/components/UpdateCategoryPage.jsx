import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Field, FormikProvider, useFormik, ErrorMessage } from "formik";
import { TreeSelect } from "primereact/treeselect";
import { useSelector } from "react-redux";
import useActions from "../../../../hooks/useActions";
import REMOTE_HOST_NAME from "../../../../env";
import * as Yup from "yup";
import { toast } from "react-toastify";

const API_URL = REMOTE_HOST_NAME + 'images/categoryImages/';

const ContainerStyle = {
  marginTop: "30px",
};

// Validation schema for category update
const CategoryUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Category name must have at least 4 characters")
    .required("Name is required"),
});

const UpdateCategoryPage = () => {
  const { categoryId } = useParams();
  const { updateCategory, getCategory, getCategories, uploadCategoryImage } = useActions();
  const { categoryList, currentCategory } = useSelector((store) => store.category);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(currentCategory?.parentId || "");
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false); // Loading state for category update
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false); // Loading state for photo update

  // Option for "Main category"
  const allOption = {
    key: "main",
    label: "Main category",
  };

  // Update selected category when currentCategory changes
  useEffect(() => {
    if (currentCategory?.parentId) {
      setSelectedCategoryKey(currentCategory.parentId);
    }
  }, [currentCategory]);

  // Load category list and current category on mount
  useEffect(() => {
    if (!categoryList.length) getCategories();
    if (categoryId) getCategory(categoryId);
  }, [categoryId]);

  // Handle file selection for photo update
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle category update (main data)
  const handleUpdateCategory = async (values) => {
    setIsUpdatingCategory(true);
    try {
      const updateData = {
        id: categoryId,
        photo: currentCategory.photo,
        name: values.name,
        parentId: values.parentId,
      };
      await updateCategory(updateData);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Error updating category");
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  // Handle photo update
  const handleUpdatePhoto = async () => {
    if (!selectedFile) return;

    setIsUpdatingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("ImagesFile", selectedFile);

      await uploadCategoryImage(categoryId, formData);
      toast.success("Photo updated successfully");
    } catch (error) {
      toast.error("Error updating photo");
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  // Initial values for Formik
  const initialValues = {
    name: currentCategory?.name || "",
    parentId: currentCategory?.parentId,
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleUpdateCategory,
    validationSchema: CategoryUpdateSchema,
    enableReinitialize: true,
    validateOnChange: true,
  });

  const {
    isValid,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
  } = formik;

  // Handle parent category change
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.value;
    setSelectedCategoryKey(selectedCategoryId);

    let newCategoryId = selectedCategoryId;
    if (selectedCategoryId === "main") {
      newCategoryId = null;
    }
    setFieldValue("parentId", newCategoryId);
  };

  // Map categories to tree structure
  const mapCategoriesToCategoryTree = (categoryList) => {
    return categoryList.map((item) => {
      const tree = {
        id: item.id,
        key: item.id,
        label: item.name,
        children: item.subCategories
          ? mapCategoriesToCategoryTree(item.subCategories)
          : [],
      };
      return tree;
    });
  };

  const categoriesTree = mapCategoriesToCategoryTree(categoryList);
  const categoriesTreeWithAll = [allOption, ...categoriesTree];

  return (
    <>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <div className="container" style={ContainerStyle}>
            <div className="row">
              <div className="col">
                <h1>Update category</h1>
              </div>
            </div>

            <div className="row justify-content-md-center">
              <div className="col col-md-8">
                {/* Category Name Field */}
                <div className="form-group mt-4">
                  <label htmlFor="name">Name</label>
                  <div className="form-control">
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Category name"
                      onChange={handleChange}
                      value={values.name}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                {/* Parent Category Field */}
                <div className="form-group d-flex flex-column mt-4">
                  <label htmlFor="parentId">Parent category</label>
                  <TreeSelect
                    value={selectedCategoryKey}
                    options={categoriesTreeWithAll}
                    onChange={handleCategoryChange}
                    selectionMode="single"
                    placeholder="Select category"
                    className="mt-2"
                  />
                </div>

                {/* Photo Upload Section */}
                <div>
                  <label>Photo</label>
                  <div className="form-group mt-4">
                    <label
                      htmlFor="newPhoto"
                      className="inline-block w-20 overflow-hidden bg-gray-100"
                    >
                      {!selectedFile && !currentCategory?.photo ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="60"
                          height="60"
                          fill="currentColor"
                          className="bi bi-card-image"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                          <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                        </svg>
                      ) : selectedFile ? (
                        <img className="w-50" src={URL.createObjectURL(selectedFile)} alt="New Photo" />
                      ) : (
                        <img className="w-50" src={API_URL + currentCategory?.photo} alt="Current Photo" />
                      )}
                    </label>
                  </div>
                  <input
                    type="file"
                    id="newPhoto"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Update Buttons */}
                <div className="form-group mt-4 d-flex gap-3 justify-content-center">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isUpdatingCategory}
                  >
                    {isUpdatingCategory ? "Updating..." : "Update Category"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleUpdatePhoto}
                    disabled={!selectedFile || isUpdatingPhoto}
                  >
                    {isUpdatingPhoto ? "Uploading..." : "Update Photo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default UpdateCategoryPage;