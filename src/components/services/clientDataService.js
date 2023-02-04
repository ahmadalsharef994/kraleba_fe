import axios from "axios";

const fetchClientsData = async () => {
    const result = await axios
      .get(`${process.env.REACT_APP_API_URL}clients/`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  };

const patchClient = async (clientForm, clientId) => {
    await axios
      .patch(
        `${process.env.REACT_APP_API_URL}clients/${clientId}/`,
        clientForm
      )
      .then(async(response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
};

const postClient = async (clientForm) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}clients/`, clientForm)
      .then(async(response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
};

const deleteClient = async (clientId) => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}clients/${clientId}/`)
      .then(async(response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
};

export { fetchClientsData, patchClient, postClient, deleteClient };
