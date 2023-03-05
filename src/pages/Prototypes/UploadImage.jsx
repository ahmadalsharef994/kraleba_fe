import React from "react";

const UploadImage = ({ images, handleSetImages }) => {
  const [newImages, setNewImages] = React.useState([]);

  const handleRemoveImage = (event, index) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);
    handleSetImages(event, updatedImages);
    console.log("newImages", newImages);
    console.log("updatedImages", updatedImages);
  };

  const handleOpenWidget = (event) => {
    event.preventDefault();
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dzmgrrcsd",
        uploadPreset: "n8gnsfgx",
        sources: [
          "local",
          "url",
          "facebook",
          "dropbox",
          "instagram",
          "google_drive",
        ],
        multiple: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          //   console.log("Done! Here is the image info: ", result.info);
          handleSetImages(event, [...images, result.info.secure_url]);
          setNewImages([...images, result.info.secure_url]);
        }
      }
    );
    myWidget.open();
  };

  return (
    <div>
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
          color: "whitesmoke",
        }}
      >
        Click on Upload Image to upload new images.
        <br />
        Click on the image to remove.
      </p>
      <button
        onClick={handleOpenWidget}
        id="upload-widget"
        className="cloudinary-button"
      >
        Upload Image
      </button>

      <div className="image-container">
        {newImages.map((imgObj, index) => (
          <img
            src={imgObj}
            alt="no preview"
            onClick={() => handleRemoveImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadImage;
