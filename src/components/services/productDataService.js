import axios from "axios";

const fetchProductsData = async () => {
  const result = await axios
    .get(`${process.env.REACT_APP_API_URL}products/`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      alert(error);
    });

  return result;
};

const patchProduct = async (productForm, productId) => {
  await axios
    .patch(
      `${process.env.REACT_APP_API_URL}products/${productId}/`,
      productForm
    )
    .then(async (response) => {
      return response.data.data;
    })
    .catch((error) => {
      alert(error);
    });
};

const postProduct = async (productForm) => {
  await axios
    .post(`${process.env.REACT_APP_API_URL}products/`, productForm)
    .then(async (response) => {
      return response.data.data;
    })
    .catch((error) => {
      alert(error);
    });
};

const deleteProduct = async (productId) => {
  await axios
    .delete(`${process.env.REACT_APP_API_URL}products/${productId}/`)
    .then(async (response) => {
      return response.data.data;
    })
    .catch((error) => {
      alert(error);
    });
};

const fetchItemsData = async () => {
  const result = await axios
    .get(`${process.env.REACT_APP_API_URL}prototypes/items`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      alert(error);
    });
  return result;
};

export {
  fetchProductsData,
  patchProduct,
  postProduct,
  deleteProduct,
  fetchItemsData,
};
