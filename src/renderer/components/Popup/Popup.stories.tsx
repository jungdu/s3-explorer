import { withKnobs } from "@storybook/addon-knobs";
import React from "react";
import ConfirmPopup from "./ConfirmPopup";
import Popup from "./Popup";

export default {
  title: "components|Popup",
  component: Credential,
  decorators: [withKnobs],
};

export const basePopup = () => {
  return (
    <Popup shown={true} title="Title">
      Children
    </Popup>
  );
};

export const confirmPopup = () => {
  return (
    <ConfirmPopup
      shown={true}
      title="Title"
      onConfirm={() => {}}
      onCancel={() => {}}
    >
      Children
    </ConfirmPopup>
  );
};
