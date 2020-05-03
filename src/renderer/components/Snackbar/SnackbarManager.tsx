import Portal from "@renderer/components/Portal";
import React from "react";

import Snackbar from "./SnackBar";

const SnackbarManager: React.FC = () => {
  return (
    <Portal elId="snackbar">
      <Snackbar />
    </Portal>
  );
};

export default SnackbarManager;
