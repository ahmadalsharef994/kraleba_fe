import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Table, ListGroup } from "react-bootstrap";
import "./Bills.css";
import axios from "axios";
import BillModal from "../../components/BillModal";
import 'bootstrap/dist/css/bootstrap.min.css';

const Bills = () => {
  const allBills = useRef([]);
  const allClients = useRef([]);
  const billItems = useRef([]);
  const [bills, setBills] = useState([]);

  const fetchBillsData = async () => {
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
      localStorage.setItem("bills", JSON.stringify(result));

    }

    const clientsData = localStorage.getItem("clients");
    if (clientsData) {
      allClients.current = JSON.parse(clientsData);
    }
  };

  useEffect(() => {
    fetchBillsData();
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
    let temp = [...allBills.current];
    temp = temp.filter((bill) => {
      return (
        bill.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        bill.type.toLowerCase().includes(typeValue.toLowerCase()));
    });
    setBills(temp);
  };
  const resetFilter = (e) => {
    e.preventDefault();
    setSearchValue("");
    setTypeValue("");
    setBills(allBills.current);
  };

  const [selectedBill, setSelectedBill] = useState(null);
  const [showEditModal, showSetEditModal] = useState(false);

  const [addBillForm, setAddBillForm] = useState(false);
  const [numberOfItems, setNumberOfItems] = useState(0);


  const convertDate = (billDate) => {
    const date = new Date(billDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    /* Date converted to MM-DD-YYYY format */
  };



  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    showSetEditModal(true);
  };

  const closeModal = () => {
    setAddBillForm(false);
    showSetEditModal(false);
  };

  const patchBill = async (billForm) => {
    await axios
      .patch(
        `${process.env.REACT_APP_API_URL}bills/${selectedBill._id}/`,
        billForm
      )
      .then(async(response) => {
        await fetchBillsData(); // <-- refetch bills after successful patch
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    closeModal();
  };

  const postBill = async (e) => {
    e.preventDefault();
    const billForm = {};
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];
      if (
        child.type === "submit" ||
        child.type === "reset" ||
        child.value === ""
      ) {
        continue;
      }

      if (child.name === "clientName") {
        billForm.client = child.value;
      } else if (child.name === "date") {
        billForm[child.name] = new Date(child.value);
      } else billForm[child.name] = child.value;
    }
    const { totalBeforeVAT, totalVAT, totalAfterVAT } = billForm;
    // whether billForm.currency is lei or euro
    billForm.totalBeforeVAT = { [billForm.currency]: totalBeforeVAT };
    billForm.totalVAT = { [billForm.currency]: totalVAT };
    billForm.totalAfterVAT = { [billForm.currency]: totalAfterVAT };

    await axios
      .post(`${process.env.REACT_APP_API_URL}bills/`, billForm)
      .then(async(response) => {
        await fetchBillsData(); // <-- refetch bills after successful post
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const deleteBill = async (bill) => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}bills/${bill._id}/`)
      .then(async(response) => {
        await fetchBillsData(); // <-- refetch bills after successful delete
        return response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pushItem = async (itemForm) => {
    for (let i = 0; i < itemForm.length; i++) {
      const item = {};
      for (let j = 0; j < itemForm[i].children.length; j++) {
        const child = itemForm[i].children[j];
        if (child.type !== "submit" && child.value !== "") {
          item[child.name] = child.value;
        }
      }
      billItems.current.push(item);
    }
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
            onClick={resetFilter}
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
              <Card.Header style={{display: "flex"}}>
                <ListGroup>
                  <ListGroup.Item>
                    client name: {bill.clientName}
                  </ListGroup.Item>
                  <ListGroup.Item>bill code: {bill.code}</ListGroup.Item>
                  <ListGroup.Item>bill number: {bill.number}</ListGroup.Item>
                  <ListGroup.Item>
                    bill date: {convertDate(bill.date)}
                  </ListGroup.Item>
                  <ListGroup.Item>bill type: {bill.type}</ListGroup.Item>
                  <ListGroup.Item>currency: {bill.currency}</ListGroup.Item>
                  <ListGroup.Item>
                    exchangeRate: {bill.exchangeRate}
                  </ListGroup.Item>
                </ListGroup>

                <ListGroup>
                  <ListGroup.Item>
                    total (lei): {bill.totalBeforeVAT.lei}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    total (euro):{bill.totalBeforeVAT.euro}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    VAT rate:{" "}
                    {bill.vatRate.toLocaleString("en", { style: "percent" })}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    VAT (lei): {bill.totalVAT.lei}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    VAT (euro): {bill.totalVAT.euro}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    total + VAT (lei):{bill.totalAfterVAT.lei}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    total + VAT (euro): {bill.totalAfterVAT.euro}
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() => handleEditBill(bill)}
                >
                  Edit
                </Button>

                <Button
                  className="btn btn-danger"
                  size="sm"
                  onClick={() => deleteBill(bill)}
                >
                  Delete
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
                      <th>Unit</th>
                      <th>quantity</th>
                      <th> Price per unit (lei)</th>
                      <th> Price per unit (euro)</th>
                      <th> total (lei)</th>
                      <th> total (euro)</th>
                      <th>VAT (lei)</th>
                      <th>VAT (euro)</th>
                      <th>total + VAT (lei)</th>
                      <th>total + VAT (euro)</th>
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
            </Card>
          ))
        )}
        {showEditModal && (
          <BillModal
            bill={selectedBill}
            closeModal={closeModal}
            patchBill={patchBill}
          />
        )}
      </div>

      <button onClick={() => setAddBillForm(!addBillForm)}>ADD BILL</button>
      {addBillForm && (
        <form className="filter" onSubmit={postBill}>
          <select name="client">
            {allClients &&
              allClients.current.map((client) => (
                <option value={client._id}>{client.name}</option>
              ))}
          </select>

          <input type="text" name="code" placeholder="Code" />
          <input type="text" name="number" placeholder="Number" />
          <input type="date" name="date" placeholder="Date" />
          <select name="type">
            <option value="">Type</option>
            <option value="invoice">Invoice</option>
            <option value="offer">Offer</option>
          </select>
          <select name="currency">
            <option value="">Currency</option>
            <option value="lei">Lei</option>
            <option value="euro">Euro</option>
          </select>
          <input
            type="number"
            name="exchangeRate"
            placeholder="Exchange Rate"
          />
          <input type="number" name="vatRate" placeholder="VAT Rate" />
          <input
            type="number"
            name="totalBeforeVAT"
            placeholder="Total Before VAT"
          />
          <input type="number" name="totalVAT" placeholder="Total VAT" />
          <input
            type="number"
            name="totalAfterVAT"
            placeholder="Total After VAT"
          />
          <input
            type="number"
            placeholder="number of items"
            onChange={(e) => setNumberOfItems(e.target.value)}
          />
          <div>
            {Array.from({ length: numberOfItems }, (_, i) => (
              <form onSubmit={pushItem}>
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="code" placeholder="Code" />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                />
                <input
                  type="text"
                  name="unitOfMeasurement"
                  placeholder="Unit of Measurement"
                />
                <input type="number" name="quantity" placeholder="Quantity" />
                <input
                  type="number"
                  name="unitPrice"
                  placeholder="price per unit"
                />
                <input
                  type="number"
                  name="totalBeforeVAT"
                  placeholder="Total Before VAT"
                />
                <input type="number" name="VAT" placeholder="VAT" />
                <input
                  type="number"
                  name="totalAfterVAT"
                  placeholder="Total After VAT"
                />
                <input type="submit" placeholder="add" value="add" />
              </form>
            ))}
          </div>

          <input type="submit" />
          <input type="reset" className="resetButton" />
        </form>
      )}
    </div>
  );
};

export default Bills;
