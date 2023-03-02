const convertDate = (billDate) => {
    const date = new Date(billDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    /* Date converted to MM-DD-YYYY format */
  };

const preProcessElement = (element) => {
    if (element === null) {
      return "";
    }
    if (element === undefined) {
      return "";
    }
    // if element is array
    if (Array.isArray(element)) {
      return element.join(", ");
    }
    if (typeof element === "number") {
      return element;
    }
    // if element is date
    if (!isNaN(Date.parse(element))) {
      return convertDate(element);
    }
    if (typeof element === "string") {
      return element;
    }
    if (typeof element === "object") {
      return JSON.stringify(element);
    }

    return element;
  };


  export default preProcessElement;