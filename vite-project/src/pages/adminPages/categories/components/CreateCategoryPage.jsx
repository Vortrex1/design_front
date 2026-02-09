import { useEffect, useState } from "react";
import { Form, Field, FormikProvider, useFormik, ErrorMessage } from "formik";
import { TreeSelect } from "primereact/treeselect";
import useActions from "../../../../hooks/useActions";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-toastify";

const ContainerStyle = {
    marginTop: "30px",
};

// Validation schema for category creation
export const CategoryCreateSchema = Yup.object().shape({
    name: Yup.string()
        .min(4, "Category name must have at least 4 characters")
        .required("Name is required"),
});

const CreateCategoryPage = () => {
    const { createCategory, getCategories } = useActions();
    const { categoryList } = useSelector((store) => store.category);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState("");

    // Option for "Main category"
    const allOption = {
        key: "main",
        label: "Main category",
    };

    // Handle form submission
    const onSubmitHandler = async (values) => {
        try {
            await createCategory(values);
            toast.success("Category created successfully");
        } catch (error) {
            toast.error("Error creating category");
        }
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

    // Initial values for Formik
    const initialValues = {
        name: "",
        parentId: undefined,
    };

    // Initialize Formik
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: onSubmitHandler,
        validationSchema: CategoryCreateSchema,
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

    // Load category list on mount
    useEffect(() => {
        getCategories();
    }, []);

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

    return (
        <>
            <FormikProvider value={formik}>
                <Form onSubmit={handleSubmit}>
                    <div className="container" style={ContainerStyle}>
                        <div className="row">
                            <div className="col">
                                <h1>Create category</h1>
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
                            </div>

                            {/* Create Button */}
                            <div className="form-group mt-4 d-flex justify-content-center">
                                <button className="btn btn-primary" type="submit">
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            </FormikProvider>
        </>
    );
};

export default CreateCategoryPage;