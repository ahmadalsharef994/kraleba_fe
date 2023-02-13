import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import ButtonExtend from "../../components/extends/ButtonExtend";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchPrototypesData,
  patchPrototype,
  postPrototype,
  deletePrototype,
} from "../../components/services/prototypeDataService";
import "./Prototypes.css";

import PrototypeModal from "../../components/PrototypeModal";

const Prototypes = () => {
  const [prototypes, setPrototypes] = useState([]);
  const allPrototypes = useRef([]);
  const allBills = useRef([]);
  const allClients = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchPrototypesData();
      setPrototypes(result);
      allPrototypes.current = result;
      localStorage.setItem("prototypes", JSON.stringify(result));
      allClients.current = JSON.parse(localStorage.getItem("clients"));
      allBills.current = JSON.parse(localStorage.getItem("bills"));
    };
    try {
      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handlePatchPrototype = async (prototypeForm, prototypeId) => {
    await patchPrototype(prototypeForm, prototypeId);
    closeModal();
    const temp = await fetchPrototypesData();
    setPrototypes(temp);
  };

  const handlePostPrototype = async (e) => {
    e.preventDefault();

    const prototypeForm = {};
    prototypeForm.fabrics = {};
    prototypeForm.assets = {};
    prototypeForm.marketing = {};
    prototypeForm.forming = {};

    for (let i = 0; i < e.target.children.length; i++) {
      const child = e.target.children[i];

      if (
        child.type === "submit" ||
        child.type === "reset" ||
        child.value === ""
      ) {
        continue;
      }

      if (child.name.includes("fabrics") || child.name.includes("assets")) {
        const names = child.name.split("-");
        prototypeForm[names[0]][names[1]] = child.value;
        continue;
      }

      if (child.name.includes("marketing") || child.name.includes("forming")) {
        const names = child.name.split("-");
        console.log(names);
        prototypeForm[names[0]][names[1]] = child.value;
        continue;
      }
      prototypeForm[child.name] = child.value;
    }
    await postPrototype(prototypeForm);
    const temp = await fetchPrototypesData();
    setPrototypes(temp);
  };

  const handleDeletePrototype = async (prototype) => {
    await deletePrototype(prototype._id);
    const prototypes = await fetchPrototypesData();
    setPrototypes(prototypes);
  };

  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

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

  const [selectedPrototype, setSelectedPrototype] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [addPrototypeForm, setAddPrototypeForm] = useState(false);

  const handleEditPrototype = (prototype) => {
    setSelectedPrototype(prototype);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setAddPrototypeForm(false);
    setShowEditModal(false);
  };

  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    console.log(uploadData);
  };

  return (
    <div className="container">
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

        <ButtonExtend
          type="button"
          className="pdfButton"
          onClick={() => window.print()}
        >
          Print as PDF
        </ButtonExtend>
      </form>

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
                      <ListGroup>
                        <ListGroup.Item>Type: {prototype.type}</ListGroup.Item>
                        <ListGroup.Item>Bill: {prototype.bill}</ListGroup.Item>
                        <ListGroup.Item>
                          Bill Code: {prototype.billCode}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Fabrics:
                          <ul>
                            <li>Supplier: {prototype.fabrics.supplier}</li>
                            <li>
                              Product Name: {prototype.fabrics.productName}
                            </li>
                            <li>
                              Supplier Code: {prototype.fabrics.supplierCode}
                            </li>
                            <li>
                              Date of Invoice: {prototype.fabrics.dateOfInvoice}
                            </li>
                            <li>
                              Invoice Number: {prototype.fabrics.invoiceNumber}
                            </li>
                          </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Assets:
                          <ul>
                            <li>Supplier: {prototype.assets.supplier}</li>
                            <li>
                              Product Name: {prototype.assets.productName}
                            </li>
                            <li>
                              Supplier Code: {prototype.assets.supplierCode}
                            </li>
                            <li>
                              Date of Invoice: {prototype.assets.dateOfInvoice}
                            </li>
                            <li>
                              Invoice Number: {prototype.assets.invoiceNumber}
                            </li>
                          </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>Code: {prototype.code}</ListGroup.Item>
                        <ListGroup.Item>
                          Tailoring: {prototype.tailoring}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Marketing:
                          <ul>
                            <li>Category: {prototype.marketing.category}</li>
                            <li>Theme: {prototype.marketing.theme}</li>
                            <li>Styles: {prototype.marketing.styles}</li>
                            <li>Occasion: {prototype.marketing.occasion}</li>
                            <li>
                              Seasonality: {prototype.marketing.seasonality}
                            </li>
                            <li>Author: {prototype.marketing.author}</li>
                            <li>
                              Collection: {prototype.marketing.collection}
                            </li>
                          </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Forming:
                          <ul>
                            <li>Cuffs: {prototype.forming.cuffs}</li>
                            <li>Slits: {prototype.forming.slits}</li>
                            <li>Pockets: {prototype.forming.pockets}</li>
                            <li>Stitching: {prototype.forming.stitching}</li>
                            <li>Seams Color: {prototype.forming.seamsColor}</li>
                            <li>Buttons: {prototype.forming.buttons}</li>
                            <li>Sleeves: {prototype.forming.sleeves}</li>
                            <li>
                              Interlining: {prototype.forming.interlining}
                            </li>
                          </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Images:</strong>
                          <ul>
                            {prototype.images.map((image, index) => (
                              <li key={index}>{<img src={image} alt="prototype"/>}</li>
                            ))}
                          </ul>
                        </ListGroup.Item>
                      </ListGroup>
              </Card.Body>
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

      <ButtonExtend
        className="addButton"
        onClick={() => setAddPrototypeForm(!addPrototypeForm)}
      >
        ADD PROTOTYPE
      </ButtonExtend>
      {addPrototypeForm && (
        <form className="filter" onSubmit={handlePostPrototype}>
          <select name="type" placeholder="Type">
            <option value="">Type</option>
            <option value="abelard">abelard</option>
            <option value="heloise">heloise</option>
          </select>
          
          <select name="fabrics-billCode" placeholder="Fabrics BillCode" >
            <option value="">Fabrics BillCode</option>
            {allBills && allBills.current.map((bill) => (
              <option value={bill.code}>{bill.code}</option>
            ))}
          </select>
          <select name="fabrics-supplierCode" placeholder="Fabrics Supplier Name">
            <option value="">Fabrics Supplier Name</option>
            {allClients && allClients.current.map((client) => (
              <option value={client.code}>{client.name}</option>
            ))}
          </select>

          <select name="assets-billCode" placeholder="Assets BillCode" >
            <option value="">Assets BillCode</option>
            {allBills && allBills.current.map((bill) => (
              <option value={bill.code}>{bill.code}</option>
            ))}
          </select>
          <select name="assets-supplierCode" placeholder="Assets Supplier Name">
            <option value="">Assets Supplier Name</option>
            {allClients && allClients.current.map((client) => (
              <option value={client.code}>{client.name}</option>
            ))}
          </select>

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


          <input type="text" name="marketing-category" placeholder="marketing Category" />
          <input type="text" name="marketing-theme" placeholder="marketing Theme" />
          <input type="text" name="marketing-styles" placeholder="marketing Styles" />
          <input type="text" name="marketing-occasion" placeholder="marketing Occasion" />
          <input type="text" name="marketing-seasonality" placeholder="marketing Seasonality" />
          <input type="text" name="marketing-author" placeholder="marketing Author" />
          <input type="text" name="marketing-collection" placeholder="marketing Collection" />

          <input type="text" name="forming-cuffs" placeholder="forming Cuffs" />
          <input type="text" name="forming-slits" placeholder="forming Slits" />
          <input type="text" name="forming-pockets" placeholder="forming Pockets" />
          <input type="text" name="forming-stitching" placeholder="forming Stitching" />
          <input type="text" name="forming-seamsColor" placeholder="forming Seams Color" />
          <input type="text" name="forming-buttons" placeholder="forming Buttons" />
          <input type="text" name="forming-sleeves" placeholder="forming Sleeves" />
          <input type="text" name="forming-interlining" placeholder="forming Interlining" />
          {/* images input and upload*/}
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileUpload}
          />
          
      
          
          <textarea name="notes" placeholder="Notes"></textarea>
          <input type="submit" value="Submit" />
          <input type="reset" value="Reset" className="resetButton" />
        </form>
      )}
    </div>
  );
};

export default Prototypes;
