import ReactDOM from "react-dom";

const PopupPortal: React.FC = ({ children }) => {
  const el = document.getElementById("popup");
  if (!el) {
    throw new Error("no modal element in html template to open the portal");
  }

  return ReactDOM.createPortal(children, el);
};

export default PopupPortal;
