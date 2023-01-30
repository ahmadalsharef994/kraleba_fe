import React, { useState, useRef, useEffect } from "react";
import { Card, ListGroup, Button, Table } from "react-bootstrap";
import "./Bills.css";
import axios from "axios";

const Bills = () => {
  const allBills = useRef([]);

  const [bills, setBills] = useState([]);
  const [addBill, setAddBill] = useState(false);

  const convertDate = (billDate) => {
    /* Date format you have */
    const date = new Date(billDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    /* Date converted to MM-DD-YYYY format */
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios
        .get(`${process.env.REACT_APP_API_URL}bills/`)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });

      if (result) {
        setBills(result);
        allBills.current = result;
      }
    };
    fetchData();
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const handleEditBill = (bill) => {
    // setSelectedClient(client);
    // setEditModal(true);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
  };
  const handleFilterReset = (e) => {
    e.preventDefault();
    setSearchValue("");
    setTypeValue("");
    // setCategoryValue("");
    // setbills(bill.current);
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
          <option value="Offer">Offer</option>
          <option value="Invoice">Invoice</option>
          <option value="Items">Items</option>
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

      <div className="bills" id="bills">
        {bills.length === 0 ? (
          <p>No bills found</p>
        ) : (
          bills.map((bill, index) => (
            <Card key={index}>
              <Card.Header style={{ display: "flex" }}>
                <h5 className="decorated-text">{bill.clientName}</h5>
                <h5 className="decorated-text"> {bill.code} </h5>

                <h5 className="decorated-text2">{convertDate(bill.date)}</h5>
                <h5 className="decorated-text2"> {bill.number} </h5>
                <h5 className="decorated-text2"> {bill.type} </h5>
                <h5 className="decorated-text2"> {bill.currency} </h5>
                <h5 className="decorated-text2"> {bill.exchangeRate} </h5>
                <h5 className="decorated-text2"> {bill.vatRate.toLocaleString("en", {style: "percent"})} </h5>

                <Button
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() => handleEditBill(bill)}
                >
                  Edit
                </Button>
              </Card.Header>
              <Card.Body>
                {/* React Table having the items */}
                <Table>
                  <thead>
                    <tr>
                      <th>sequence</th>
                      <th>Item</th>
                      <th>Unit</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Item 1</td>
                      <td>Unit 1</td>
                      <td>Quantity 1</td>
                      <td>Unit Price 1</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))
        )}
        {/* {editModal && <ClientModal bill={selected closeModal={closeModal} patchClient={patchClient}/>} */}
      </div>
    </div>
  );
};

export default Bills;
