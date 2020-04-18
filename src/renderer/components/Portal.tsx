import ReactDOM from "react-dom";

interface Props {
  elId: string;
}

const Portal: React.FC<Props> = ({ children, elId }) => {
  const el = document.getElementById(elId);
  if (!el) {
    throw new Error("no modal element in html template to open the portal");
  }

  return ReactDOM.createPortal(children, el);
};

export default Portal;
