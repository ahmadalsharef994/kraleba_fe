import axios from "axios";

const fetchPrototypesData = async() =>{
    const result = await axios
      .get(`${process.env.REACT_APP_API_URL}prototypes/`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        alert(error);
      });

    return result;
  };

const patchPrototype = async(prototypeForm, prototypeId) =>{
  await axios.patch(
    `${process.env.REACT_APP_API_URL}prototypes/${prototypeId}/`,
    prototypeForm
  )
  .then(async(response) => {
    return response.data.data
  })
  .catch((error)=> {
    alert(error)
  });
};

const postPrototype = async(prototypeForm) =>{
  await axios.post(`${process.env.REACT_APP_API_URL}prototypes/`, prototypeForm)
  .then(async(response) => {
    return response.data.data
  })
  .catch((error)=> {
    alert(error)
  });
}

const deletePrototype = async(prototypeId) =>{
  await axios.delete(`${process.env.REACT_APP_API_URL}prototypes/${prototypeId}/`)
  .then(async(response) => {
    return response.data.data
  })
  .catch((error)=> {
    alert(error)
  });
}

export {fetchPrototypesData, patchPrototype, postPrototype, deletePrototype}
