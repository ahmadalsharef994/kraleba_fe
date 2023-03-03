import React, { useRef, useState, useEffect } from "react";
import { Card, FormLabel } from "react-bootstrap";
import ButtonExtend from "../../components/extends/ButtonExtend";
import {
  fetchClientsData,
  patchClient,
  postClient,
  deleteClient,
} from "../../components/services/clientDataService";
import "./Clients.css";
import ClientModal from "../../components/ClientModal";
import { categoriesList } from "../../components/constants";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const allClients = useRef([]);
  const [filter, setFilter] = useState({
    name: "",
    type: "",
    category: "",
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectClientForm, setSelectClientForm] = useState(false);
  const [addClientForm, setAddClientForm] = useState(false);

  const [type, setType] = useState("");

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
      if (child.type === "select-multiple") {
        const options = [];
        for (let j = 0; j < child.options.length; j++) {
          if (child.options[j].selected) {
            options.push(child.options[j].value);
          }
        }
        clientForm[child.name] = options;
        continue;
      }
      clientForm[child.name] = child.value;
    }
    await postClient(clientForm);
    const temp = await fetchClientsData();
    setClients(temp);
  };

  const handleDeleteClient = async (client) => {
    await deleteClient(client._id);
    try {
      setClients(clients.filter((c) => c._id !== client._id));
      alert("Client deleted successfully");
    } catch (error) {
      alert("error: Could not delete client");
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
    let temp = [...allClients.current];
    temp = temp.filter((client) => {
      return (
        client.type.toLowerCase().includes(filter.type.toLowerCase()) &&
        client.category.includes(filter.category.toLowerCase()) &&
        client.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    });
    setClients(temp);
  };
  const resetFilter = (e) => {
    e.preventDefault();
    setFilter({
      type: "",
      category: "",
      name: "",
    });
    setClients(allClients.current);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setAddClientForm(false);
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchClientsData();
      setClients(result.sort((a, b) => a.name.localeCompare(b.name)));
      allClients.current = result;
      localStorage.setItem("clients", JSON.stringify(result));
    };
    try {
      fetchData();
    } catch (err) {
      alert(err);
    }
  }, []);

  return (
    <div className="container">
      <ButtonExtend
        className="addButton"
        onClick={() => {
          setAddClientForm(false);
          setSelectClientForm(!selectClientForm);
        }}
      >
        SELECT
      </ButtonExtend>

      <ButtonExtend
        className="addButton"
        onClick={() => {
          setSelectClientForm(false);

          setAddClientForm(!addClientForm);
        }}
      >
        ADD
      </ButtonExtend>

      <ButtonExtend
        type="button"
        className="pdfButton"
        onClick={() => window.print()}
      >
        Print as PDF
      </ButtonExtend>

      {selectClientForm && (
        <form className="search-filter" onSubmit={handleFilter}>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Buyer">Buyer</option>
            <option value="Supplier">Supplier</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">Select Category</option>

            {categoriesList.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={filter.name}
            placeholder="Search By Name"
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
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
        </form>
      )}

      {addClientForm && (
        <form className="filter" onSubmit={handlePostClient}>
          <FormLabel>Type: </FormLabel>
          <select
            name="type"
            placeholder="Type"
            onChange={(e) => setType(e.target.value)}
            style={{ backgroundColor: "#E2E8FD" }}
          >
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
          </select>
          {type === "supplier" && (
            <>
              <FormLabel>Category: (ctrl for multi select)</FormLabel>

              <select name="category" placeholder="Category" multiple>
                {categoriesList.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
            </>
          )}
          <FormLabel>Client</FormLabel>

          <input
            type="text"
            name="name"
            placeholder="Name *"
            required
            style={{ backgroundColor: "#E2E8FD" }}
          />
          <input
            type="text"
            name="code"
            placeholder="Code *"
            required
            style={{ backgroundColor: "#E2E8FD" }}
          />
          <input type="text" name="address" placeholder="Address" />
          <input type="text" name="zipCode" placeholder="Zip Code" />
          <input
            type="text"
            name="city"
            placeholder="City *"
            required
            style={{ backgroundColor: "#E2E8FD" }}
          />
          {/* <FormLabel>Country: * </FormLabel> */}

          <select
            name="country"
            required
            style={{ backgroundColor: "#E2E8FD" }}
          >
            <option value="">Country *</option>
            <option value="Romania">Romania</option>
            <option value="EU">EU</option>
            <option value="Non-EU">Non-EU</option>
          </select>
          <FormLabel>Details</FormLabel>

          <input type="text" name="cif" placeholder="CIF" />
          <input type="text" name="ocr" placeholder="OCR" />
          <input type="text" name="iban" placeholder="IBAN" />
          <input type="text" name="swift" placeholder="SWIFT" />
          <input type="text" name="bank" placeholder="BANK" />
          <input type="text" name="contact" placeholder="contact" />
          <FormLabel>Contact</FormLabel>

          <input type="text" name="phone1" placeholder="Phone 1" />
          <input type="text" name="phone2" placeholder="Phone 2" />
          <input type="text" name="email" placeholder="E-mail" />
          <input type="text" name="website" placeholder="WWW" />
          <FormLabel>Notes</FormLabel>

          <textarea name="notes" placeholder="Notes"></textarea>
          <input
            type="submit"
            value="Submit"
            style={{ backgroundColor: "black", color: "white" }}
          />

          <input type="reset" value="Reset" className="resetButton" />
        </form>
      )}

      <div className="clients" id="clients">
        <h5
          className="decorated-text2"
          style={{ backgroundColor: "rgba(0, 0, 0, 0)", padding: "10px" }}
        >
          {filter.type + "/" + filter.category + "/" + filter.name}
        </h5>

        {!clients || !clients.length ? (
          <p>No clients found</p>
        ) : (
          clients.map((client, index) => (
            <Card key={index}>
              <Card.Header>
                <div className="decorated-text2">{client.type}</div>
                <div className="decorated-text2">
                  {Array.isArray(client.category)
                    ? client.category.join(", ")
                    : client.category}
                </div>
                <div className="decorated-text2"> {client.subCategory} </div>

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
                  <div className="decorated-text2">{client.name}</div>
                  <div className="decorated-text2"> {client.code} </div>
                  <div>{client.address}</div>
                  <div>{client.zipCode}</div>
                  <div>{client.city}</div>
                  <div>{client.country}</div>

                  <div>{client.cif}</div>
                  <div>{client.ocr}</div>
                  <div>{client.iban}</div>
                  <div>{client.swift}</div>
                  <div>{client.bank}</div>
                  <div></div>
                  <div>{client.contact}</div>
                  <div>{client.phone1}</div>
                  <div>{client.phone2}</div>
                  <div>
                    <a href={"mailto:" + client.email}>{client.email}</a>
                  </div>
                  <div>
                    <a href={client.website}>{client.website}</a>
                  </div>
                  <div>{client.notes}</div>
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
