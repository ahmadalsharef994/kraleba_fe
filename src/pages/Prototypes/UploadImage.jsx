import React from "react";

const UploadImage = ({ images, setImages }) => {
//   const [images, setImages] = React.useState([]);

  const handleRemoveImage = (imgObj) => {};

  const handleOpenWidget = () => {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dzmgrrcsd",
        uploadPreset: "n8gnsfgx",
        sources: ["local", "url", "facebook", "dropbox", "instagram","google_drive"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
        //   console.log("Done! Here is the image info: ", result.info);
          setImages([...images, result.info.secure_url]);
        }
      }
    );
    myWidget.open();
  };

  return (
    <div>
      <button
        onClick={handleOpenWidget}
        id="upload-widget"
        className="cloudinary-button"
      >
        Upload Image
      </button>
      <div className="image-container">
        {images.map((imgObj) => (
          <img src={imgObj} alt="no preview" />
        ))}
      </div>
    </div>
  );
};

export default UploadImage;
