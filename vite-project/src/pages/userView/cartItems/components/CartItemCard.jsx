import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Card,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import REMOTE_HOST_NAME from "../../../../env";
import useActions from "../../../../hooks/useActions";
import DeleteCartItemModal from "../cartItemsModals/DeleteCartItemModal";
import InfoAboutProduct from "./InfoAboutProduct";

const API_URL_IMAGES_Product = REMOTE_HOST_NAME + 'images/productImages/';


const CartItemCard = ({ cartItem }) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
    const { currentCategory } = useSelector((store) => store.category);


  const openDeleteModal = useCallback((id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const { updateCartItem , getCategory} = useActions();

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      const result = await updateCartItem(item.id, newQuantity);

      if (!result.success) {
        toast.error(`Error: ${result.message}`);
      }
    }
  };
    console.log("cartItem", cartItem);

  useEffect(() => {
    getCategory(cartItem.product?.categoryId);
    console.log("cartItem", cartItem);
  }, [cartItem]);


  return (
    <div>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          marginBottom: 2,
          boxShadow: 3,
        }}
      >
          <img
          src={API_URL_IMAGES_Product + cartItem.product?.photos[0]}
          alt="product"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
        {/* <ProductImage images={cartItem.product.images} /> */}

        {/* Інформація про товар */}
        <InfoAboutProduct
          producId={cartItem.product?.id}
          productName={cartItem.product?.name}
          categoryName={currentCategory?.name}
        />

        {/* Кількість товару */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => handleQuantityChange(cartItem, -1)}
            size="small"
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={cartItem.quantity}
            size="small"
            sx={{ width: 50, textAlign: "center", mx: 1 }}
            inputProps={{ readOnly: true }}
          />
          <IconButton
            onClick={() => handleQuantityChange(cartItem, 1)}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Ціна товару */}
        <Typography
          variant="h6"
          sx={{ color: "red", marginLeft: 2, minWidth: 80 }}
        >
          {(cartItem.product?.price * cartItem.quantity).toFixed(2)} ₴
        </Typography>

        {/* Видалення товару */}
        <IconButton onClick={() => openDeleteModal(cartItem.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </Card>
      {/* <h5>renderCount: {renderCount}</h5> */}

      <DeleteCartItemModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        cartItemId={selectedProductId}
      />
    </div>
  );
};

export default memo(CartItemCard);

