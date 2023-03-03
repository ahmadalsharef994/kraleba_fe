import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./styles.css";

function BillModal({ bill, closeModal, patchBill }) {
  const handleSave = async (e) => {
    e.preventDefault();
    const billForm = {};
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];
      if (
        child.type !== "submit" &&
        child.type !== "reset" &&
        child.value !== ""
      ) {
        billForm[child.name] = child.value;
      }
    }
    await patchBill(billForm);
    closeModal();
  };
  const billDate = new Date(bill.date).toISOString().slice(0, 10);

  return (
    <Modal show={!!bill}>
      <Modal.Header>
        <Modal.Title>Edit Bill Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="filter" onSubmit={handleSave}>
          <input type="text" name="code" placeholder="Code" defaultValue={bill.code}/>
          {/* <input type="text" name="number" placeholder="Number" /> */}
          <input type="date" name="date" placeholder="Date" defaultValue={billDate}/>
          <select name="type" defaultValue={bill.type}>
            <option value="">Type</option>
            <option value="invoice">Invoice</option>
            <option value="offer">Offer</option>
          </select>
          <select name="currency" defaultValue={bill.currency}>
            <option value="">Currency</option>
            <option value="lei">Lei</option>
            <option value="euro">Euro</option>
          </select>
          <input
            type="number"
            name="exchangeRate"
            placeholder="Exchange Rate"
            defaultValue={bill.exchangeRate}
          />
          <input type="number" name="vatRate" placeholder="VAT Rate" defaultValue={bill.vatRate}/>

          <input
            type="number"
            name="customDutyVAT"
            placeholder="Custom Duty VAT"
            required
          />

          <select type="checkbox" multiple name="category" defaultValue={bill.category}>
            <option value="fabric">Fabric</option>
            <option value="auxiliary">auxiliary</option>
            <option value="services">services</option>
            <option value="others">others</option>
          </select>
          <input type="text" name="subcategory" placeholder="subcategoris" />

          <input type="submit" />
          <input type="reset" className="resetButton" />
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default BillModal;
