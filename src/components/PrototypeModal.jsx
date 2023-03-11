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
        <select name="type" placeholder="Type">
            <option value="">Type</option>
            <option value="abelard">abelard</option>
            <option value="heloise">heloise</option>
          </select>
          <input type="text" name="name" placeholder="Name" />
          <input
            type="text"
            name="collectionName"
            placeholder="Collection Name"
          />
          <input type="text" name="version" placeholder="Version" />
       

          <select name="tailoring" placeholder="Tailoring">
            <option value="">Tailoring</option>
            <option value="extra slim fit">extra slim fit</option>
            <option value="slim fit">slim fit</option>
            <option value="regular 1">regular 1</option>
            <option value="regular 2">regular 2</option>
            <option value="large">large</option>
            <option value="extra large">extra large</option>
            <option value="no category">no category</option>
          </select>

          <input
            type="text"
            name="marketing-category"
            placeholder="marketing Category"
          />
          <input
            type="text"
            name="marketing-theme"
            placeholder="marketing Theme"
          />
          <input
            type="text"
            name="marketing-styles"
            placeholder="marketing Styles"
          />
          <input
            type="text"
            name="marketing-occasion"
            placeholder="marketing Occasion"
          />
          <input
            type="text"
            name="marketing-seasonality"
            placeholder="marketing Seasonality"
          />

          <input
            type="text"
            name="marketing-collection"
            placeholder="marketing Collection"
          />

          <input type="text" name="forming-cuffs" placeholder="forming Cuffs" />
          <input type="text" name="forming-slits" placeholder="forming Slits" />
          <input
            type="text"
            name="forming-pockets"
            placeholder="forming Pockets"
          />
          <input
            type="text"
            name="forming-stitching"
            placeholder="forming Stitching"
          />
          <input
            type="text"
            name="forming-seamsColor"
            placeholder="forming Seams Color"
          />
          <input
            type="text"
            name="forming-buttons"
            placeholder="forming Buttons"
          />
          <input
            type="text"
            name="forming-sleeves"
            placeholder="forming Sleeves"
          />
          <input
            type="text"
            name="forming-interlining"
            placeholder="forming Interlining"
          />

          <textarea name="notes" placeholder="Notes"></textarea>

          {/* <UploadImage
            images={images}
            handleSetImages={handleSetImages}
            name="images"
          /> */}
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
