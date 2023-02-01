import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import './styles.css'
import { useState } from "react";

function BillModal({ bill, closeModal, patchBill }) {

  const [numberOfItems, setNumberOfItems] = useState(bill.numberOfItems);

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
        {/* <form className="clientModal" onSubmit={handleSave}>
          <select name="type" placeholder="Type" defaultValue={bill.type}>
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
          <input type="submit" value="Submit" />
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        </form> */}

        <form className="filter" onSubmit={handleSave}>

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
            {/* <div>
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
                  <input type="number" name="unitPrice" placeholder="price per unit" />
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
            </div> */}

          <input type="submit" />
          <input type="reset" className="resetButton" />
        </form>
      </Modal.Body>

    </Modal>
  );
}

export default BillModal;
