import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import './styles.css'

function PrototypeModal({ prototype, closeModal, patchClient }) {

  const handleSave = async (e) => {
    e.preventDefault();
    const clientForm = {};
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];
      if (child.type !== "submit" && child.type !== "reset" && child.value !== "") {
        clientForm[child.name] = child.value;
      }
    }
    await patchClient(clientForm);
    closeModal();
  };

  return (
    <Modal show={!!prototype}>
      <Modal.Header>
        <Modal.Title>Edit Client Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="clientModal" onSubmit={handleSave}>
          <select name="type" placeholder="Type" defaultValue={prototype.type}>
            <option value="">Type</option>
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
          </select>

          <select name="category" placeholder="Category" defaultValue={prototype.category}>
            <option value="">Category</option>
            <option value="fabrics">fabrics</option>
            <option value="assets">assets</option>
            <option value="auxiliary">auxiliary</option>
            <option value="manufacturing">manufacturing</option>
            <option value="delivery">delivery</option>
            <option value="banking">banking</option>
            <option value="duties">duties</option>
            <option value="others">others</option>
          </select>
          <input type="text" name="name" placeholder="Name" defaultValue={prototype.name} readOnly/>
          <input type="text" name="code" placeholder="Code" defaultValue={prototype.code} readOnly/>
          <input type="text" name="address" placeholder="Address" defaultValue={prototype.address}/>
          <input type="text" name="zipCode" placeholder="Zip Code" defaultValue={prototype.zipCode}/>
          <input type="text" name="city" placeholder="City" readOnly defaultValue={prototype.city}/>
          <select name="country" readOnly defaultValue={prototype.country}>
            <option value="">Country</option>
            <option value="Romania">Romania</option>
            <option value="EU">EU</option>
            <option value="Non-EU">Non-EU</option>
          </select>
          <input type="text" name="cif" placeholder="CIF" defaultValue={prototype.cif}/>
          <input type="text" name="ocr" placeholder="OCR"  defaultValue={prototype.ocr}/>
          <input type="text" name="iban" placeholder="IBAN" defaultValue={prototype.iban}/>
          <input type="text" name="swift" placeholder="SWIFT" defaultValue={prototype.swift}/>
          <input type="text" name="bank" placeholder="BANK" defaultValue={prototype.bank}/>
          <input type="text" name="phone1" placeholder="Phone 1" defaultValue={prototype.phone1}/>
          <input type="text" name="phone2" placeholder="Phone 2" defaultValue={prototype.phone2}/>
          <input type="text" name="email" placeholder="E-mail" defaultValue={prototype.email}/>
          <input type="text" name="email" placeholder="E-mail" defaultValue={prototype.email}/>
          <input type="text" name="www" placeholder="WWW" defaultValue={prototype.website}/>
          <textarea name="notes" placeholder="Notes" defaultValue={prototype.notes}/>
          <input type="submit" value="Submit" />
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        </form>
      </Modal.Body>

    </Modal>
  );
}

export default PrototypeModal;
