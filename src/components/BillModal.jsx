import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './styles.css'

function BillModal({ bill, closeModal, patchBill }) {

  const handleSave = async (e) => {
    e.preventDefault();
    const billForm = {};
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];
      if (child.type !== "submit" && child.type !== "reset" && child.value !== "") {
        billForm[child.name] = child.value;
      }
    }
    await patchBill(billForm);
    closeModal();
  };

  return (
    <Modal show={!!bill}>
      <Modal.Header>
        <Modal.Title>Edit Bill Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
 

        <form className="filter" onSubmit={handleSave}>

          <input type="text" name="code" placeholder="Code" />
          {/* <input type="text" name="number" placeholder="Number" /> */}
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
              name="customDutyVAT"
              placeholder="Custom Duty VAT"
              required
            />

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
