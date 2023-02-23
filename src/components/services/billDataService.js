import axios from "axios";

const fetchBillsData = async () => {
    const result = await axios
      .get(`${process.env.REACT_APP_API_URL}bills/`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        alert(error);
      });

    return result;
  };

const patchBill = async (billForm, billId) => {
    await axios
      .patch(
        `${process.env.REACT_APP_API_URL}bills/${billId}/`,
        billForm
      )
      .then(async(response) => {
        return response.data.data;
      })
      .catch((error) => {
        alert(error);
      });
};

const postBill = async (billForm) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}bills/`, billForm)
      .then(async(response) => {
        return response.data.data;
      })
      .catch((error) => {
        alert(error);
      });
};

const deleteBill = async (billId) => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}bills/${billId}/`)
      .then(async(response) => {
        return response.data.data;
      })
      .catch((error) => {
        alert(error);
      });
};

export { fetchBillsData, patchBill, postBill, deleteBill };
