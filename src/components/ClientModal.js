import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import './styles.css'

function ClientModal({ client, closeModal, patchClient }) {

  const handleSave = async (e) => {
    e.preventDefault();
    const clientForm = {};
    console.log(e.target.children)
    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];
      if (child.type !== "submit" && child.type !== "reset" && child.value !== "") {
        clientForm[child.name] = child.value;
      }
    }
    console.log(clientForm);
    await patchClient(clientForm);
    closeModal();
  };

  return (
    <Modal show={!!client}>
      <Modal.Header>
        <Modal.Title>Edit Client Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="clientModal" onSubmit={handleSave}>
          <select name="type" placeholder="Type" defaultValue={client.type}>
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
        </form>
      </Modal.Body>
      {/* <Modal.Footer>

      </Modal.Footer> */}
    </Modal>
  );
}

export default ClientModal;
