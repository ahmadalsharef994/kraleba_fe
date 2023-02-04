import React, { useState, useRef, useEffect } from "react";
import { Card, Table, ListGroup } from "react-bootstrap";
import "./Bills.css";
import BillModal from "../../components/BillModal";
import "bootstrap/dist/css/bootstrap.min.css";
import ButtonExtend from "../../components/extends/ButtonExtend";
import {
  fetchBillsData,
  patchBill,
  postBill,
} from "../../components/services/billDataService";

const Bills = () => {
  const allBills = useRef([]);
  const allClients = useRef(localStorage.getItem("clients"));
  const billItems = useRef([]);
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
        bill.name.toLowerCase().includes(searchValue.toLowerCase()) &&
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

    billForm["clent"] = selectedClient.country;

    billForm["clientName"] = selectedClient.name;
    billForm["clientCode"] = selectedClient.code;
    billForm["clientCountry"] = selectedClient.country;

    await postBill(billForm);
    fetchBillsData();
  };

  const deleteBill = async (bill) => {
    await deleteBill(bill._id);
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
        {bills.length === 0 ? (
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
                  onClick={() => deleteBill(bill)}
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
              allClients.current.map((client) => (
                <option
                  value={[client._id, client.name, client.code, client.country]}
                >
                  {client.name}
                </option>
              ))}
          </select>

          <input type="text" name="code" placeholder="Code" required />
          <input type="text" name="number" placeholder="Number" required />
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
          {selectedClient.country !== "Romania" && (
            <input
              type="number"
              name="exchangeRate"
              placeholder="Exchange Rate"
              required
            />
          )}
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
            name="numberOfItems"
          />
          {Array.from({ length: numberOfItems }, (_, i) => (
            <div key={i}>
              <input type="text" name={`name`} placeholder="Name" />
              <input type="text" name={`code`} placeholder="Code" />
              <input
                type="text"
                name={`description`}
                placeholder="Description"
              />
              <input
                type="text"
                name={`unitOfMeasurement`}
                placeholder="Unit of Measurement"
              />
              <input
                type="number"
                name={`quantity`}
                placeholder="Quantity"
              />
              <input
                type="number"
                name={`unitPrice`}
                placeholder="price per unit"
              />
              <input
                type="number"
                name={`totalBeforeVAT`}
                placeholder="Total Before VAT"
              />
              {selectedClient.country !== "EU" && (
                <input type="number" name={`VAT`} placeholder="VAT" />
              )}
              {/* <input type="number" name={`totalAfterVAT-${i}`} placeholder="Total After VAT" /> */}
              <button onClick={() => pushItem(i)}>Add</button>
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
