import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import ButtonExtend from "../../components/extends/ButtonExtend";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchProductsData,
  patchProduct,
  postProduct,
  deleteProduct,
  fetchItemsData,
} from "../../components/services/productDataService";
import "./Products.css";

import ProductModal from "../../components/ProductModal";
import UploadImage from "../Prototypes/UploadImage";
import { FormLabel } from "react-bootstrap";
import ReactJsonView from "react-json-view";
import ClientForm from "../../components/services/forms/clientForm"

const Products = () => {
  const [products, setProducts] = useState([]);
  const allProducts = useRef([]);
  const allBills = useRef([]);
  const allClients = useRef([]);
  const allItems = useRef([]);

  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [addProductForm, setAddProductForm] = useState(false);
  const [selectProductForm, setSelectProductForm] = useState(false);

  const [images, setImages] = useState([]);
  const handleSetImages = (e, newImages) => {
    setImages(newImages);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchProductsData();
      setProducts(result);
      allProducts.current = result;
      localStorage.setItem("products", JSON.stringify(result));
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

  const handlePatchProduct = async (productForm, productId) => {
    await patchProduct(productForm, productId);
    closeModal();
    const temp = await fetchProductsData();
    setProducts(temp);
  };

  const handlePostProduct = async (e) => {
    e.preventDefault();

    const productForm = {};
    productForm.items = [];
    productForm.marketing = {};
    productForm.forming = {};

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
        productForm.items.push(child.value);

        continue;
      }

      if (child.name.includes("marketing") || child.name.includes("forming")) {
        const names = child.name.split("-");
        productForm[names[0]][names[1]] = child.value;
        continue;
      }
      productForm[child.name] = child.value;
    }
    productForm["images"] = images;
    await postProduct(productForm);
    const temp = await fetchProductsData();
    setProducts(temp);
    alert("Product Added Successfully");
  };

  const handleDeleteProduct = async (product) => {
    await deleteProduct(product._id);
    const products = await fetchProductsData();
    setProducts(products);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // Form submission logic here
    let temp = [...allProducts.current];
    temp = temp.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        product.type.toLowerCase().includes(typeValue.toLowerCase())
      );
    });
    setProducts(temp);
  };

  const resetFilter = (e) => {
    e.preventDefault();
    setSearchValue("");
    setTypeValue("");
    setProducts(allProducts.current);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setAddProductForm(false);
    setShowEditModal(false);
  };

  return (
    <div className="container">
      <ButtonExtend
        className="addButton"
        onClick={() => {
          setAddProductForm(!addProductForm);
          setSelectProductForm(false);
        }}
      >
        ADD PRODUCT
      </ButtonExtend>

      <ButtonExtend
        className="addButton"
        onClick={() => {
          setSelectProductForm(!selectProductForm);
          setAddProductForm(false);
        }}
      >
        SELECT PRODUCT
      </ButtonExtend>

      <ButtonExtend
        type="button"
        className="pdfButton"
        onClick={() => window.print()}
      >
        Print as PDF
      </ButtonExtend>

      {selectProductForm && (
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

      {addProductForm && (
        <form className="filter" onSubmit={handlePostProduct}>
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
                    item.billType === "invoice" && (
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

          <FormLabel>Product: </FormLabel>

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

      <div className="products" id="products">
        {!products || !products.length ? (
          <p>No products found</p>
        ) : (
          products.map((product, index) => (
            <Card key={index}>
              <Card.Header>
                <ButtonExtend
                  className="btn btn-secondary"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </ButtonExtend>
                <ButtonExtend
                  className="btn btn-danger"
                  size="sm"
                  onClick={() => handleDeleteProduct(product)}
                >
                  Delete
                </ButtonExtend>
              </Card.Header>
              <Card.Body>
                <ReactJsonView
                  className="object-content-product"
                  src={{
                    name: product.name,
                    type: product.type,
                    code: product.code,
                    version: product.version,
                    tailoring: product.tailoring,
                    items: product.items,
                    marketing: product.marketing,
                    forming: product.forming,
                    notes: product.notes,
                  }}
                  name="product details"
                  quotesOnKeys={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                />
              </Card.Body>

              <Card.Footer>
                <strong>Images:</strong>
                <div className="image-container">
                  {product.images.map((imgObj, index) => (
                    <img src={imgObj} alt="no preview" />
                  ))}
                </div>
              </Card.Footer>
            </Card>
          ))
        )}
        {showEditModal && (
          <ProductModal
            product={selectedProduct}
            closeModal={closeModal}
            patchProduct={(form) =>
              handlePatchProduct(form, selectedProduct._id)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Products;
