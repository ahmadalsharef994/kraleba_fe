import React, { useRef } from "react";
import "./Clients.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import ClientModal from "../components/ClientModal";

const Clients = () => {
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios
        .get(`${process.env.REACT_APP_API_URL}clients/`)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });

      if (result) {
        setClients(result);
        allClients.current = result;
      }
    };
    fetchData();
  }, []);

  const [addClient, setAddClient] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [clients, setClients] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const allClients = useRef([]);

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
    const temp = clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        client.type.toLowerCase().includes(typeValue.toLowerCase()) &&
        client.category.toLowerCase().includes(categoryValue.toLowerCase())
      );
    });
    setClients(temp);
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    setSearchValue("");
    setTypeValue("");
    setCategoryValue("");
    setClients(allClients.current);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setEditModal(true);
  };
  const postClient = async (e) => {
    e.preventDefault();
    
    const clientForm = {};
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];
      if (child.type !== "submit" && child.type !== "reset" && child.value !== "") {
        clientForm[child.name] = child.value;
      }
    }

     await axios
    .post(`${process.env.REACT_APP_API_URL}clients/`, clientForm).then((response) => {
      return response.data.data;
    }
    ).catch((error) => {
      console.log(error);
    });
  
  };

  const closeModal = () => {
    setAddClient(false);
    setEditModal(false);
  };

  const patchClient = async (clientForm) => {
    console.log(clientForm)

    await axios.patch(`${process.env.REACT_APP_API_URL}clients/${selectedClient._id}/`, clientForm).then((response) => {
      return response.data.data;
    }
    ).catch((error) => {
      console.log(error);
    });
    closeModal();
  };

  return (
    <div>
      <form className="filter" onSubmit={handleFilter}>
        <input
          type="text"
          value={searchValue}
          placeholder="Search By Name"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          value={typeValue}
          onChange={(e) => setTypeValue(e.target.value)}
          placeholder="Type"
        >
          <option value="">Select Type</option>
          <option value="Buyer">Buyer</option>
          <option value="Supplier">Supplier</option>
        </select>

        <select
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="fabrics">Fabrics</option>
          <option assets="assets">Assets</option>
          <option value="auxiliary">Auxiliary</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="delivery">Delivery</option>
          <option value="banking">Banking</option>
          <option value="duties">Duties</option>
          <option value="others">Others</option>
        </select>
        <div>
          <button className="submitButton" type="submit" onClick={handleFilter}>
            Filter
          </button>
          <button
            className="resetButton"
            type="reset"
            onClick={handleFilterReset}
          >
            Remove Filter
          </button>
        </div>

        <button
          type="button"
          className="pdfButton"
          onClick={() => window.print()}
        >
          Print as PDF
        </button>
      </form>

      <div className="clients" id="clients">
        {clients.length === 0 ? (
          <p>No clients found</p>
        ) : (
          clients.map((client, index) => (
            <Card key={index}>
              <Card.Header>
                <h5 className="decorated-text">{client.name}</h5>
                <h5 className="decorated-text"> {client.code} </h5>

                <h5 className="decorated-text2">{client.type}</h5>
                <h5 className="decorated-text2"> {client.category} </h5>

                <Button
                  className="btn btn-secondary"
                  size="sm"
                  onClick={()=>handleEditClient(client)}
                >
                  Edit
                </Button>

              </Card.Header>
              <Card.Body>
                <ListGroup>
                  <ListGroup.Item>CIF: {client.cif}</ListGroup.Item>
                  <ListGroup.Item>OCR: {client.ocr}</ListGroup.Item>
                  <ListGroup.Item>IBAN: {client.iban}</ListGroup.Item>
                  <ListGroup.Item>SWIFT: {client.swift}</ListGroup.Item>
                  <ListGroup.Item>Bank: {client.bank}</ListGroup.Item>
                  <ListGroup.Item>Address: {client.address}</ListGroup.Item>
                  <ListGroup.Item>City: {client.city}</ListGroup.Item>
                  <ListGroup.Item>Zip: {client.zipCode}</ListGroup.Item>
                  <ListGroup.Item>Country: {client.country}</ListGroup.Item>
                  <ListGroup.Item>Phone 1: {client.phone1}</ListGroup.Item>
                  <ListGroup.Item>Phone 2: {client.phone2}</ListGroup.Item>
                  <ListGroup.Item>
                    Email: <a href={"mailto:" + client.email}>{client.email}</a>
                  </ListGroup.Item>
                  <ListGroup.Item>Notes: {client.notes}</ListGroup.Item>
                  <ListGroup.Item>Website: {client.website}</ListGroup.Item>
                </ListGroup>
              </Card.Body>

            </Card>
          ))
        )}
              {editModal && <ClientModal client={selectedClient} closeModal={closeModal} patchClient={patchClient}/>}

      </div>

      <button onClick={() => setAddClient(!addClient)}>ADD CLIENT</button>
      {addClient && (
        <form className="filter" onSubmit={postClient}>
          <select name="type" placeholder="Type">
            <option value="">Type</option>
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
          </select>

          <select name="category" placeholder="Category">
            <option value="">Category</option>
            <option value="fabrics">Fabrics</option>
            <option assets="assets">Assets</option>
            <option value="auxiliary">Auxiliary</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="delivery">Delivery</option>
            <option value="banking">Banking</option>
            <option value="duties">Duties</option>
            <option value="others">Others</option>
          </select>
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="code" placeholder="Code" />
          <input type="text" name="address" placeholder="Address" />
          <input type="text" name="zipCode" placeholder="Zip Code" />
          <input type="text" name="city" placeholder="City" />
          <select name="country">
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
          <input type="email" name="email" placeholder="E-mail" />
          <input type="text" name="www" placeholder="WWW" />
          <textarea name="notes" placeholder="Notes"></textarea>
          <input type="submit" value="Submit" name="submit"/>
          <input type="reset" value="Reset" name="reset" className="resetButton" />
        </form>
      )}
    </div>
  );
};

export default Clients;
