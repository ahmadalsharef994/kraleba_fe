import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
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
    const temp = bills.filter((bill) => {
      return (
        bill.clientName.toLowerCase().includes(searchValue.toLowerCase()) &&
        bill.type.toLowerCase().includes(typeValue.toLowerCase())
      );
    }
    );
    setBills(temp);
  };
  const handleFilterReset = (e) => {
    e.preventDefault();
    setSearchValue("");
    setTypeValue("");
    // setCategoryValue("");
    setBills(allBills.current);
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
                <h5 className="decorated-text2">
                  {" "}
                  {bill.vatRate.toLocaleString("en", { style: "percent" })}{" "}
                </h5>

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
                      <th>index</th>
                      <th>name</th>
                      <th>code</th>
                      <th>description</th>
                      <th>unit of measurement</th>
                      <th>quantity</th>

                      <th> Price per unit / lei</th>
                      <th> Price per unit / euro</th>

                      <th> totalBeforeVAT/lei</th>
                      <th> totalBeforeVAT/euro</th>
                      <th>VAT/lei</th>
                      <th>VAT/euro</th>
                      <th>totalAfterVAT/lei</th>
                      <th>totalAfterVAT/euro</th>

                    </tr>
                  </thead>
                  <tbody>
                    {bill.items &&
                      bill.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index}</td>
                          <td>{item.name}</td>
                          <td>{item.code}</td>
                          <td>{item.description}</td>
                          <td>{item.um}</td>
                          <td>{item.quantity}</td>
                          <td>{item.lei}</td>
                          <td>{item.euro}</td>
                          <td>{item.totalBeforeVAT.lei}</td>
                          <td>{item.totalBeforeVAT.euro}</td>
                          <td>{item.VAT.lei}</td>
                          <td>{item.VAT.euro}</td>
                          <td>{item.totalAfterVAT.lei}</td>
                          <td>{item.totalAfterVAT.euro}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>

              <Card.Footer>
                <h4 className="decorated-text1">Total</h4>
                {true && <h5 className="decorated-text2"> totalBeforeVAT (lei): {bill.totalBeforeVAT.lei} </h5>}
                {bill.totalBeforeVAT.euro && <h5 className="decorated-text2"> totalBeforeVAT (euro): {bill.totalBeforeVAT.euro} </h5>}
                {bill.totalVAT.lei && <h5 className="decorated-text2"> totalVAT (lei): {bill.totalVAT.lei} </h5>}
                {bill.totalVAT.euro && <h5 className="decorated-text2"> totalVAT (euro): {bill.totalVAT.euro} </h5>}
                {bill.totalAfterVAT.lei && <h5 className="decorated-text2"> total after vat (lei): {bill.totalAfterVAT.lei} </h5>}
                {bill.totalAfterVAT.euro && <h5 className="decorated-text2"> total after vat (euro): {bill.totalAfterVAT.euro} </h5>}
              </Card.Footer>
            </Card>
          ))
        )}
        {/* {editModal && <ClientModal bill={selected closeModal={closeModal} patchClient={patchClient}/>} */}
      </div>
    </div>
  );
};

export default Bills;
