import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import './styles.css'
import ButtonExtend from "./extends/ButtonExtend";

function ClientModal({ client, closeModal, patchClient, deleteClient }) {

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

  const handleDelete = async (e) => {
    await deleteClient();
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

          <select name="category" placeholder="Category" defaultValue={client.category}>
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
          <input type="text" name="subCategory" placeholder="Sub-Category" defaultValue={client.subCategory}/>
          <input type="text" name="name" placeholder="Name" defaultValue={client.name} readOnly style={{backgroundColor: "lightgrey"}}/>
          <input type="text" name="code" placeholder="Code" defaultValue={client.code} readOnly style={{backgroundColor: "lightgrey"}}/>
          <input type="text" name="address" placeholder="Address" defaultValue={client.address}/>
          <input type="text" name="zipCode" placeholder="Zip Code" defaultValue={client.zipCode}/>
          <input type="text" name="city" placeholder="City" readOnly defaultValue={client.city} style={{backgroundColor: "lightgrey"}}/>
          <select name="country" readOnly defaultValue={client.country} style={{backgroundColor: "lightgrey"}}>
            <option value="">Country</option>
            <option value="Romania">Romania</option>
            <option value="EU">EU</option>
            <option value="Non-EU">Non-EU</option>
          </select>
          <input type="text" name="cif" placeholder="CIF" defaultValue={client.cif}/>
          <input type="text" name="ocr" placeholder="OCR"  defaultValue={client.ocr}/>
          <input type="text" name="iban" placeholder="IBAN" defaultValue={client.iban}/>
          <input type="text" name="swift" placeholder="SWIFT" defaultValue={client.swift}/>
          <input type="text" name="bank" placeholder="BANK" defaultValue={client.bank}/>
          <input type="text" name="phone1" placeholder="Phone 1" defaultValue={client.phone1}/>
          <input type="text" name="phone2" placeholder="Phone 2" defaultValue={client.phone2}/>
          <input type="text" name="email" placeholder="E-mail" defaultValue={client.email}/>
          <input type="text" name="email" placeholder="E-mail" defaultValue={client.email}/>
          <input type="text" name="www" placeholder="WWW" defaultValue={client.website}/>
          <textarea name="notes" placeholder="Notes" defaultValue={client.notes}/>
          <input type="submit" value="Submit" />
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>

        <ButtonExtend
                  className="btn btn-danger"
                  size="sm"
                  onClick={() => handleDelete()}
                >
                  Delete
                </ButtonExtend>
        </form>
      </Modal.Body>

    </Modal>
  );
}

export default ClientModal;
