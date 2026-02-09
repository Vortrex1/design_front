import useActions from "../../../../hooks/useActions";

const ConfirmationModalCategoryDelete = ({ id }) => {
  const { deleteCategory } = useActions();

  const onDeleteHandler = () => {
    try {
      deleteCategory(id);
    } catch (error) {
      console.log("Remove category error", error);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="categoryDeleteModal"
        aria-labelledby="categoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Are you sure?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              You are gonna remove this category from database forever!
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDeleteHandler}
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModalCategoryDelete;