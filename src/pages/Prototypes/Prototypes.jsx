import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import ButtonExtend from "../../components/extends/ButtonExtend";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchPrototypesData,
  patchPrototype,
  postPrototype,
  deletePrototype,
  fetchItemsData,
} from "../../components/services/prototypeDataService";
import "./Prototypes.css";

import PrototypeModal from "../../components/PrototypeModal";
import UploadImage from "./UploadImage";
import { FormLabel } from "react-bootstrap";
import ReactJsonView from "react-json-view";

const Prototypes = () => {
  const [prototypes, setPrototypes] = useState([]);
  const allPrototypes = useRef([]);
  const allBills = useRef([]);
  const allClients = useRef([]);
  const allItems = useRef([]);

  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const [selectedPrototype, setSelectedPrototype] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [addPrototypeForm, setAddPrototypeForm] = useState(false);
  const [selectPrototypeForm, setSelectPrototypeForm] = useState(false);

  const [images, setImages] = useState([]);
  const handleSetImages = (e, newImages) => {
    setImages(newImages);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchPrototypesData();
      setPrototypes(result);
      allPrototypes.current = result;
      localStorage.setItem("prototypes", JSON.stringify(result));
      allClients.current = JSON.parse(localStorage.getItem("clients"));
      allBills.current = JSON.parse(localStorage.getItem("bills"));
      const items = await fetchItemsData();
      localStorage.setItem("items", JSON.stringify(items));
      allItems.current = items;
    };
    try {
      fetchData();
    } catch (err) {
      alert(err);
    }
  }, []);

  const [itemCount, setItemCount] = useState(1);

  function handleAddItem() {
    setItemCount(itemCount + 1);
  }

  const handlePatchPrototype = async (prototypeForm, prototypeId) => {
    await patchPrototype(prototypeForm, prototypeId);
    closeModal();
    const temp = await fetchPrototypesData();
    setPrototypes(temp);
  };

  const handlePostPrototype = async (e) => {
    e.preventDefault();

    const prototypeForm = {};
    prototypeForm.items = [];
    prototypeForm.marketing = {};
    prototypeForm.forming = {};

    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];

      if (
        child.type === "submit" ||
        child.type === "reset" ||
        child.value === "" ||
        !child.name
      ) {
        continue;
      }

      if (child.name.includes("item")) {
        prototypeForm.items.push(child.value);

        continue;
      }

      if (child.name.includes("marketing") || child.name.includes("forming")) {
        const names = child.name.split("-");
        prototypeForm[names[0]][names[1]] = child.value;
        continue;
      }
      prototypeForm[child.name] = child.value;
    }
    prototypeForm["images"] = images;
    await postPrototype(prototypeForm);
    const temp = await fetchPrototypesData();
    setPrototypes(temp);
    alert("Prototype Added Successfully");
  };

  const handleDeletePrototype = async (prototype) => {
    await deletePrototype(prototype._id);
    const prototypes = await fetchPrototypesData();
    setPrototypes(prototypes);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
    let temp = [...allPrototypes.current];
    temp = temp.filter((prototype) => {
      return (
        prototype.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        prototype.type.toLowerCase().includes(typeValue.toLowerCase())
      );
    });
    setPrototypes(temp);
  };

  const resetFilter = (e) => {
    e.preventDefault();
    setSearchValue("");
    setTypeValue("");
    setPrototypes(allPrototypes.current);
  };

  const handleEditPrototype = (prototype) => {
    setSelectedPrototype(prototype);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setAddPrototypeForm(false);
    setShowEditModal(false);
  };

  return (
    <div className="container">
      <ButtonExtend
        className="addButton"
        onClick={() => {
          setAddPrototypeForm(!addPrototypeForm);
          setSelectPrototypeForm(false);
        }}
      >
        ADD PROTOTYPE
      </ButtonExtend>

      <ButtonExtend
        className="addButton"
        onClick={() => {
          setSelectPrototypeForm(!selectPrototypeForm);
          setAddPrototypeForm(false);
        }}
      >
        SELECT PROTOTYPE
      </ButtonExtend>

      <ButtonExtend
        type="button"
        className="pdfButton"
        onClick={() => window.print()}
      >
        Print as PDF
      </ButtonExtend>

      {selectPrototypeForm && (
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
            <option value="abelard">abelard</option>
            <option value="heloise">heloise</option>
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
        </form>
      )}

      {addPrototypeForm && (
        <form className="filter" onSubmit={handlePostPrototype}>
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
          <FormLabel>Items: </FormLabel>

          <button onClick={handleAddItem}>Add Item</button>
          <span> item.name/item.code/item.unitPrice/item.billCode</span>
          {Array.from({ length: itemCount }).map((_, index) => (
            <select key={index} name={`item-${index}`}>
              <option value="">Select Item</option>
              {allItems &&
                allItems.current.map(
                  (item, index) =>
                    item.billType === "offer" && (
                      <option
                        key={index}
                        value={[
                          item.name,
                          item.code,
                          item.unitPrice,
                          item.quantity,
                          item.fabrics,
                          item.billCode,
                        ]}
                      >
                        {item.name || "no name"}/{item.code || "no code"}/
                        {item.unitPrice || "no unit price"}/
                        {item.billCode || "no bill code"}
                      </option>
                    )
                )}
            </select>
          ))}

          <FormLabel>Prototype: </FormLabel>

          <input type="text" name="code" placeholder="Code" required />

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
            name="marketing-author"
            placeholder="marketing Author"
            style={{ backgroundColor: "#99ccff" }}
            defaultValue="no author"
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
          <FormLabel>Images: </FormLabel>

          <UploadImage
            images={images}
            handleSetImages={handleSetImages}
            name="images"
          />

          <input type="submit" value="Submit" />
          <input type="reset" value="Reset" className="resetButton" />
        </form>
      )}

      <div className="prototypes" id="prototypes">
        {!prototypes || !prototypes.length ? (
          <p>No prototypes found</p>
        ) : (
          prototypes.map((prototype, index) => (
            <Card key={index}>
              <Card.Header>
                <ButtonExtend
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() => handleEditPrototype(prototype)}
                >
                  Edit
                </ButtonExtend>
                <ButtonExtend
                  className="btn btn-danger"
                  size="sm"
                  onClick={() => handleDeletePrototype(prototype)}
                >
                  Delete
                </ButtonExtend>
              </Card.Header>
              <Card.Body>
                <ReactJsonView
                  className="object-content-prototype"
                  src={{
                    name: prototype.name,
                    type: prototype.type,
                    code: prototype.code,
                    version: prototype.version,
                    tailoring: prototype.tailoring,
                    items: prototype.items,
                    marketing: prototype.marketing,
                    forming: prototype.forming,
                    notes: prototype.notes,
                  }}
                  name="prototype details"
                  quotesOnKeys={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                />
              </Card.Body>

              <Card.Footer>
                <strong>Images:</strong>
                <div className="image-container">
                  {prototype.images.map((imgObj, index) => (
                    <img src={imgObj} alt="no preview" />
                  ))}
                </div>
              </Card.Footer>
            </Card>
          ))
        )}
        {showEditModal && (
          <PrototypeModal
            prototype={selectedPrototype}
            closeModal={closeModal}
            patchPrototype={(form) =>
              handlePatchPrototype(form, selectedPrototype._id)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Prototypes;
