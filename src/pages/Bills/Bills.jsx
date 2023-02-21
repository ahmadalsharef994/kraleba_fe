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
  const [bills, setBills] = useState([]);
  const [selectedClient, setSelectedClient] = useState({});
  const [selectBillForm, setSelectBillForm] = useState(false);

  const [expandBill, setExpandBill] = useState(new Array(false));

  const selectClient = (e) => {
    const [id, name, code, country] = e.target.value.split(",");
    setSelectedClient({ id, name, code, country });
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

  const [filter, setFilter] = useState({
    clientName: "",
    type: "",
    category: "",
    subCategory: "",
    startDate: "",
    endDate: "",
  });

  const handleFilter = (e) => {
    e.preventDefault();
    let temp = [...allBills.current];
    temp = temp.filter((bill) => {
      return (
        bill.clientName
          .toLowerCase()
          .includes(filter.clientName.toLowerCase()) &&
        bill.type.toLowerCase().includes(filter.type.toLowerCase()) &&
        JSON.stringify(bill.items).toLowerCase().includes(filter.category) &&
        JSON.stringify(bill.items).toLowerCase().includes(filter.subCategory) &&
        bill.date >= filter.startDate &&
        bill.date <= filter.endDate
      );
    });
    setBills(temp);
  };
  const resetFilter = (e) => {
    e.preventDefault();
    setFilter({
      clientName: "",
      type: "",
      category: "",
      subCategory: "",
      startDate: "",
      endDate: "",
    });
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
      if (child.name === "customDutyVAT") billForm.customDutyVAT = child.value;

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
        name: e.target[`name-${i}`].value,
        code: e.target[`code-${i}`].value,
        description: e.target[`description-${i}`].value,
        unitOfMeasurement: e.target[`unitOfMeasurement-${i}`].value,
        quantity: e.target[`quantity-${i}`].value,
        unitPrice: e.target[`unitPrice-${i}`].value,
        // composition material structure design weaving color finishing
        composition: e.target[`composition-${i}`].value,
        material: e.target[`material-${i}`].value,
        structure: e.target[`structure-${i}`].value,
        design: e.target[`design-${i}`].value,
        weaving: e.target[`weaving-${i}`].value,
        color: e.target[`color-${i}`].value,
        finishing: e.target[`finishing-${i}`].value,
      });
    }
    billForm.items = items;
    billForm["client"] = selectedClient.id;
    billForm["clientName"] = selectedClient.name;
    billForm["clientCode"] = selectedClient.code;
    billForm["clientCountry"] = selectedClient.country;

    await postBill(billForm);
    const bills = await fetchBillsData();
    setBills(bills);
  };

  // const handleDeleteBill = async (bill) => {
  //   await deleteBill(bill._id);

  //   try {
  //     setBills(bills.filter((b) => b._id !== bill._id));
  //     alert("bill deleted successfully");
  //   } catch (error) {
  //     alert("error: Could not delete bill");
  //   }
  // };

  return (
    <div>
      <ButtonExtend
        className="addButton"
        onClick={() => {
          setAddBillForm(false);
          setSelectBillForm(!selectBillForm);
        }}
      >
        SELECT BILL
      </ButtonExtend>

      <ButtonExtend
        className="addButton"
        onClick={() => {
          setSelectBillForm(false);
          setAddBillForm(!addBillForm);
        }}
      >
        ADD BILL
      </ButtonExtend>
      <ButtonExtend
        type="button"
        className="pdfButton"
        onClick={() => window.print()}
      >
        Print as PDF
      </ButtonExtend>

      {selectBillForm && (
        <form className="filter" onSubmit={handleFilter}>
          <input
            type="text"
            value={filter.clientName}
            placeholder="Search By Client Name"
            onChange={(e) =>
              setFilter({ ...filter, clientName: e.target.value })
            }
          />
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            placeholder="Type"
          >
            <option value="">Select Type</option>
            <option value="Offer">Offer</option>
            <option value="Invoice">Invoice</option>
            <option value="Items">Items</option>
          </select>

          <input
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            placeholder="Category"
          />

          <input
            value={filter.subCategory}
            onChange={(e) =>
              setFilter({ ...filter, subCategory: e.target.value })
            }
            placeholder="Sub Category"
          />

          <input
            type="date"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
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
      {addBillForm && (
        <form className="filter" onSubmit={handlePostBill}>
          <select name="clientDetails" required onChange={selectClient}>
            <option value="">Select Client</option>

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
              name="customDutyVAT"
              placeholder="Custom Duty VAT"
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
            <div key={i} className="item-input">
              <input type="text" name={`code-${i}`} placeholder="Code" />
              <input type="text" name={`name-${i}`} placeholder="Name" />
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
              {/* composition material structure design weaving color finishing */}
              <input
                type="text"
                name={`composition-${i}`}
                placeholder="Composition"
              />
              <input
                type="text"
                name={`material-${i}`}
                placeholder="Material"
              />
              <input
                type="text"
                name={`structure-${i}`}
                placeholder="Structure"
              />
              <input type="text" name={`design-${i}`} placeholder="Design" />
              <input type="text" name={`weaving-${i}`} placeholder="Weaving" />
              <input type="text" name={`color-${i}`} placeholder="Color" />
              <input
                type="text"
                name={`finishing-${i}`}
                placeholder="Finishing"
              />
            </div>
          ))}

        
          <input type="text" name="notes" placeholder="Notes" />
          <input type="text" name="categoris" placeholder="categoris" />
          <input type="text" name="subcategoris" placeholder="subcategoris" />
          <input type="submit" />
          <input type="reset" className="resetButton" />
        </form>
      )}

      <h5
        className="decorated-text2"
        style={{ backgroundColor: "rgba(0, 0, 0, 0)", padding: "10px" }}
      >
        {Object.values(filter).join("/")}
      </h5>

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
                  <ListGroup.Item>
                    bill type: <b>{bill.type}</b>
                  </ListGroup.Item>
                  <ListGroup.Item>currency: {bill.currency}</ListGroup.Item>
                </ListGroup>

                <ListGroup>
                  <ListGroup.Item>
                    exchangeRate: {bill.exchangeRate}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    customDutyVAT: {bill.customDutyVAT}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    total (lei): {bill.totalBeforeVAT.lei}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    total (euro):{bill.totalBeforeVAT.euro}
                  </ListGroup.Item>
                </ListGroup>

                <ListGroup>
                  {/* <ListGroup.Item>totalCustomDuty (lei): {bill.totalCustomDuty.lei}</ListGroup.Item>
                  <ListGroup.Item>totalCustomDuty (euro): {bill.totalCustomDuty.euro}</ListGroup.Item> */}

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
                {bill.type === "offer" && (
                  <ButtonExtend
                    className="btn btn-secondary"
                    size="sm"
                    onClick={() => handleEditBill(bill)}
                  >
                    Edit
                  </ButtonExtend>
                )}

                {/* <ButtonExtend
                  className="btn btn-danger"
                  size="sm"
                  onClick={() => handleDeleteBill(bill)}
                >
                  Delete
                </ButtonExtend> */}

                <ButtonExtend
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() =>
                    setExpandBill({
                      ...expandBill,
                      [index]: !expandBill[index],
                    })
                  }
                >
                  {/* {expandBill[index] ? "Hide" : "Show"} items */}
                  ...
                </ButtonExtend>
              </Card.Header>
              {expandBill[index] && (
                <Card.Body>
                  <Table>
                  <thead>
  <tr>
    <th rowspan="2">index</th>
    <th rowspan="2">name</th>
    <th rowspan="2">code</th>
    <th rowspan="2">description</th>
    <th colspan="4">buc/um</th>
    <th colspan="2">total fara TVA</th>
    <th colspan="2">TVA</th>
    <th colspan="2">total incl. TVA</th>
  </tr>
  <tr>
    <th>Unit</th>
    <th>quantity</th>
    <th>buc (lei)</th>
    <th>buc (euro)</th>
    <th>lei</th>
    <th>euro</th>
    <th>lei</th>
    <th>euro</th>
    <th>lei</th>
    <th>euro</th>
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
              )}
                              <Card.Footer>
                  <ListGroup>
                    <ListGroup.Item>
                      total (lei): {bill.totalBeforeVAT.lei}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      total (euro):{bill.totalBeforeVAT.euro}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Footer>
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
    </div>
  );
};

export default Bills;
