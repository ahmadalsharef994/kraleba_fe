import React, { useState, useRef, useEffect } from "react";
import { Card, Table, ListGroup } from "react-bootstrap";
import "./Bills.css";
import BillModal from "../../components/BillModal";
import ButtonExtend from "../../components/extends/ButtonExtend";
import {
  fetchBillsData,
  patchBill,
  postBill,
  deleteBill,
} from "../../components/services/billDataService";

const Bills = () => {
  const allBills = useRef([]);
  const allClients = useRef(localStorage.getItem("clients"));
  // const billItems = useRef([]);
  const [bills, setBills] = useState([]);
  const [selectedClient, setSelectedClient] = useState({});

  const selectClient = (e) => {
    const temp = e.target.value.split(",");
    setSelectedClient({
      id: temp[0],
      name: temp[1],
      code: temp[2],
      country: temp[3],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchBillsData();
      setBills(result);
      allBills.current = result;
      localStorage.setItem("bills", JSON.stringify(result));
      allClients.current = JSON.parse(localStorage.getItem("clients"));
    };
    fetchData();
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
    let temp = [...allBills.current];
    temp = temp.filter((bill) => {
      return (
        bill.clientName.toLowerCase().includes(searchValue.toLowerCase()) &&
        bill.type.toLowerCase().includes(typeValue.toLowerCase())
      );
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

  const handlePatchBill = async (billForm, billId) => {
    await patchBill(billForm, billId);
    closeModal();
    const temp = await fetchBillsData();
    setBills(temp);
  };

  const handlePostBill = async (e) => {
    e.preventDefault();
    const billForm = {};
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];

      if (child.name === "vatRate") billForm.vatRate = child.value;
      if (child.name === "customDuty") billForm.customDuty = child.value;

      if (
        child.type === "submit" ||
        child.type === "reset" ||
        child.value === ""
      ) {
        continue;
      }
      billForm[child.name] = child.value;

    }
    const items = [];
    for (let i = 0; i < numberOfItems; i++) {
      items.push({
        // name: e.target[`name-${i}`].value,
        code: e.target[`code-${i}`].value,
        description: e.target[`description-${i}`].value,
        unitOfMeasurement: e.target[`unitOfMeasurement-${i}`].value,
        quantity: e.target[`quantity-${i}`].value,
        unitPrice: e.target[`unitPrice-${i}`].value,
      });
    }
    billForm.items = items;
    billForm["client"] = selectedClient.id;
    billForm["clientName"] = selectedClient.name;
    billForm["clientCode"] = selectedClient.code;
    billForm["clientCountry"] = selectedClient.country;

    // console.log(billForm);

    await postBill(billForm);
    const bills = await fetchBillsData();
    setBills(bills);
  };

  const handleDeleteBill = async (bill) => {
    await deleteBill(bill._id);

    try {
      setBills(bills.filter((b) => b._id !== bill._id));
      alert("bill deleted successfully");
    } catch (error) {
      alert("error: Could not delete bill");
    }
  };

  return (
    <div>
      <form className="filter" onSubmit={handleFilter}>
        <input
          type="text"
          value={searchValue}
          placeholder="Search By Client Name"
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

        <ButtonExtend
          type="button"
          className="pdfButton"
          onClick={() => window.print()}
        >
          Print as PDF
        </ButtonExtend>
      </form>

      <div className="bills" id="bills">
        {!bills || !bills.length ? (
          <p>No bills found</p>
        ) : (
          bills.map((bill, index) => (
            <Card key={index}>
              <Card.Header style={{ display: "flex" }}>
                <ListGroup>
                  <ListGroup.Item>
                    client name: {bill.clientName}
                  </ListGroup.Item>
                  <ListGroup.Item>bill code: {bill.code}</ListGroup.Item>
                  <ListGroup.Item>
                    bill date: {convertDate(bill.date)}
                  </ListGroup.Item>
                  <ListGroup.Item>bill type: {bill.type}</ListGroup.Item>
                  <ListGroup.Item>currency: {bill.currency}</ListGroup.Item>
                  <ListGroup.Item>
                    exchangeRate: {bill.exchangeRate}
                  </ListGroup.Item>
                  <ListGroup.Item>customDuty: {bill.customDuty}</ListGroup.Item>
                </ListGroup>

                <ListGroup>
                  <ListGroup.Item>
                    total (lei): {bill.totalBeforeVAT.lei}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    total (euro):{bill.totalBeforeVAT.euro}
                  </ListGroup.Item>
                  <ListGroup.Item>VAT percentage:{bill.vatRate}</ListGroup.Item>
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

                <ButtonExtend
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() => handleEditBill(bill)}
                >
                  Edit
                </ButtonExtend>

                <ButtonExtend
                  className="btn btn-danger"
                  size="sm"
                  onClick={() => handleDeleteBill(bill)}
                >
                  Delete
                </ButtonExtend>
              </Card.Header>
              <Card.Body>
                {/* React Table having the items */}
                <Table>
                  <thead>
                    <tr>
                      <th>index</th>
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
                          {/* <td>{item.name}</td> */}
                          <td>{item.code}</td>
                          <td>{item.description}</td>
                          <td>{item.unitOfMeasurement}</td>
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
            patchBill={(form) => handlePatchBill(form, selectedBill._id)}
          />
        )}
      </div>

      <ButtonExtend
        className="addButton"
        onClick={() => setAddBillForm(!addBillForm)}
      >
        ADD BILL
      </ButtonExtend>
      {addBillForm && (
        <form className="filter" onSubmit={handlePostBill}>
          <select name="clientDetails" required onChange={selectClient}>
            {allClients &&
              allClients.current.map((client, index) => (
                <option
                  value={[client._id, client.name, client.code, client.country]}
                  key={index}
                >
                  {client.name}
                </option>
              ))}
          </select>

          <input type="text" name="code" placeholder="Code" required />
          <input type="date" name="date" placeholder="Date" required />
          <select name="type" required>
            <option value="">Type</option>
            <option value="invoice">Invoice</option>
            <option value="offer">Offer</option>
          </select>
          <select name="currency" required>
            <option value="">Currency</option>
            {selectedClient.country === "Romania" && (
              <option value="lei">Lei</option>
            )}
            {selectedClient.country !== "Romania" && (
              <option value="euro">Euro</option>
            )}
          </select>
          <input
            type="number"
            name="exchangeRate"
            placeholder="Exchange Rate"
            required
          />
          {selectedClient.country !== "EU" && (
            <input
              type="number"
              name="vatRate"
              placeholder="VAT Rate"
              required
            />
          )}
          {selectedClient.country === "Non-EU" && (
            <input
              type="number"
              name="customDuty"
              placeholder="Custom Duty"
              required
            />
          )}

          <input
            type="number"
            placeholder="number of items"
            onChange={(e) => setNumberOfItems(e.target.value)}
            name="numberOfItems"
          />
          {Array.from({ length: numberOfItems }, (_, i) => (
            <div key={i}>
              {/* <input type="text" name={`name-${i}`} placeholder="Name" /> */}
              <input type="text" name={`code-${i}`} placeholder="Code" />
              <input
                type="text"
                name={`description-${i}`}
                placeholder="Description"
              />
              <input
                type="text"
                name={`unitOfMeasurement-${i}`}
                placeholder="Unit of Measurement"
              />
              <input
                type="number"
                name={`quantity-${i}`}
                placeholder="Quantity"
              />
              <input
                type="number"
                name={`unitPrice-${i}`}
                placeholder="price per unit"
              />
            </div>
          ))}

          <input type="submit" />
          <input type="reset" className="resetButton" />
        </form>
      )}
    </div>
  );
};

export default Bills;
