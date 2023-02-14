import React, { useRef, useState, useEffect  } from "react";
import { Card } from "react-bootstrap";
import ButtonExtend from "../../components/extends/ButtonExtend";
import {
  fetchClientsData,
  patchClient,
  postClient,
  deleteClient,
} from "../../components/services/clientDataService";
import "./Clients.css";

import ClientModal from "../../components/ClientModal";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const allClients = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchClientsData();
      setClients(result);
      allClients.current = result;
      localStorage.setItem("clients", JSON.stringify(result));
    };
    try {
      fetchData();
    }
    catch (err) {
      console.log(err);
    }

  }, []);

  const handlePatchClient = async (clientForm, clientId) => {
    await patchClient(clientForm, clientId);
    closeModal();
    const temp = await fetchClientsData();
    setClients(temp);
  };

  const handlePostClient = async (e) => {
    e.preventDefault();

    const clientForm = {};

    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];

      if (
        child.type === "submit" ||
        child.type === "reset" ||
        child.value === ""
      ) {
        continue;
      }
      clientForm[child.name] = child.value;
    }
    await postClient(clientForm);
    const temp = await fetchClientsData();
    setClients(temp);
  };

  const handleDeleteClient = async(client) => {
    await deleteClient(client._id);
    // const clients = await fetchClientsData();
    // setClients(clients);

    try {
      setClients(clients.filter((c) => c._id !== client._id));
      alert("Client deleted successfully");
    } catch (error) {
      alert("error: Could not delete client");
    }
    
  };


  const [filter, setFilter] = useState({
    searchValue: "",
    typeValue: "",
    categoryValue: "",
  })

  const handleFilter = (e) => {
    e.preventDefault();

    // Form submission logic here
    let temp = [...allClients.current];
    temp = temp.filter((client) => {
      return (
        client.name.toLowerCase().includes(filter.searchValue.toLowerCase()) &&
        client.type.toLowerCase().includes(filter.typeValue.toLowerCase()) &&
        client.category.toLowerCase().includes(filter.categoryValue.toLowerCase())
      );
    });
    setClients(temp);
  };

  const resetFilter = (e) => {
    e.preventDefault();
    setFilter({
      searchValue: "",
      typeValue: "",
      categoryValue: "",
    })
    setClients(allClients.current);
  };

  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectClientForm, setSelectClientForm] = useState(false);

  const [addClientForm, setAddClientForm] = useState(false);

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setAddClientForm(false);
    setShowEditModal(false);
  };


  return (
    <div className="container">
      <ButtonExtend
        className="addButton"
        onClick={() => setSelectClientForm(!selectClientForm)}
      >
        SELECT CLIENT
      </ButtonExtend>

      <ButtonExtend
        className="addButton"
        onClick={() => setAddClientForm(!addClientForm)}
      >
        ADD CLIENT
      </ButtonExtend>

      <ButtonExtend
          type="button"
          className="pdfButton"
          onClick={() => window.print()}
        >
          Print as PDF
        </ButtonExtend>

      {selectClientForm && (<form className="filter" onSubmit={handleFilter} >
        <input
          type="text"
          value={filter.searchValue}
          placeholder="Search By Name"
          onChange={(e) => setFilter({ ...filter, searchValue: e.target.value })}
          />
        <select
          value={filter.typeValue}
          onChange={(e) => setFilter({ ...filter, typeValue: e.target.value })}
          placeholder="Type"
        >
          <option value="">Select Type</option>
          <option value="Buyer">Buyer</option>
          <option value="Supplier">Supplier</option>
        </select>
        <select
          value={filter.categoryValue}
          onChange={(e) => setFilter({ ...filter, categoryValue: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="fabrics">fabrics</option>
          <option assets="assets">assets</option>
          <option value="auxiliary">auxiliary</option>
          <option value="manufacturing">manufacturing</option>
          <option value="delivery">delivery</option>
          <option value="banking">banking</option>
          <option value="duties">duties</option>
          <option value="others">others</option>
        </select>
        <div>
          <ButtonExtend
            className="filterButton"
            type="submit"
            onClick={handleFilter}
          >
            Filter
          </ButtonExtend>
          <ButtonExtend
            className="resetButton"
            type="reset"
            onClick={resetFilter}
          >
            Remove Filter
          </ButtonExtend>
        </div>


      </form>)}

      {addClientForm && (
        <form className="filter" onSubmit={handlePostClient}>
          <select name="type" placeholder="Type">
            <option value="">Type</option>
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
          </select>

          <select name="category" placeholder="Category">
            <option value="">Category</option>
            <option value="fabrics">fabrics</option>
            <option value="assets">assets</option>
            <option value="auxiliary">auxiliary</option>
            <option value="manufacturing">manufacturing</option>
            <option value="delivery">delivery</option>
            <option value="banking">banking</option>
            <option value="duties">duties</option>
            <option value="others">others</option>
          </select>

          <input type="text" name="subCategory" placeholder="Sub-Category" />

          <input type="text" name="name" placeholder="Name *" required />
          <input type="text" name="code" placeholder="Code *" required />
          <input type="text" name="address" placeholder="Address" />
          <input type="text" name="zipCode" placeholder="Zip Code" />
          <input type="text" name="city" placeholder="City *" required />
          <select name="country *" required>
            <option value="">Country</option>
            <option value="Romania">Romania</option>
            <option value="EU">EU</option>
            <option value="Non-EU">Non-EU</option>
          </select>
          <input type="text" name="cif" placeholder="CIF" />
          <input type="text" name="ocr" placeholder="OCR" />
          <input type="text" name="iban" placeholder="IBAN" />
          <input type="text" name="swift" placeholder="SWIFT" />
          <input type="text" name="bank" placeholder="BANK" />
          <input type="text" name="phone1" placeholder="Phone 1" />
          <input type="text" name="phone2" placeholder="Phone 2" />
          <input type="text" name="email" placeholder="E-mail" />
          <input type="text" name="website" placeholder="WWW" />
          <textarea name="notes" placeholder="Notes"></textarea>
          <input type="submit" value="Submit" />
          <input type="reset" value="Reset" className="resetButton" />
        </form>
      )}


      <div className="clients" id="clients">
      <h5 className="decorated-text2" style={{backgroundColor: 'rgba(0, 0, 0, 0)', padding: '10px'}}>{Object.values(filter).join('/')}</h5>

        {!clients || !clients.length ? (
          <p>No clients found</p>
        ) : (
          clients.map((client, index) => (
            <Card key={index}>
              <Card.Header>
                <h5 className="decorated-text2">{client.name}</h5>
                <h5 className="decorated-text2"> {client.code} </h5>
                <h5 className="decorated-text2">{client.type}</h5>
                <h5 className="decorated-text2"> {client.category} </h5>
                <h5 className="decorated-text2"> {client.subCategory} </h5>

                <ButtonExtend
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() => handleEditClient(client)}
                >
                  Edit
                </ButtonExtend>

              </Card.Header>
              <Card.Body>
                <div className="client-group">
                  <div>CIF: {client.cif}</div>
                  <div>OCR: {client.ocr}</div>
                  <div>IBAN: {client.iban}</div>
                  <div>SWIFT: {client.swift}</div>
                  <div>Bank: {client.bank}</div>
                  <div>Address: {client.address}</div>
                  <div>City: {client.city}</div>
                  <div>Zip: {client.zipCode}</div>
                  <div>Country: {client.country}</div>
                  <div>Phone 1: {client.phone1}</div>
                  <div>Phone 2: {client.phone2}</div>
                  <div>
                    Email: <a href={"mailto:" + client.email}>{client.email}</a>
                  </div>
                  <div>Notes: {client.notes}</div>
                  <div>Website: {client.website}</div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
        {showEditModal && (
          <ClientModal
            client={selectedClient}
            closeModal={closeModal}
            patchClient={(form) => handlePatchClient(form, selectedClient._id)}
            deleteClient={() => handleDeleteClient(selectedClient)}
          />
        )}
      </div>



    </div>
  );
};

export default Clients;


// useCallback for filter and resetfilter