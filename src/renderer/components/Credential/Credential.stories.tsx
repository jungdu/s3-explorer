import React from "react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

import Credential from "./Credential";

export default {
  title: "components|Credential",
  component: Credential,
  decorators: [withKnobs]
};

export const credential = () => {
  return <Credential onSetCredential={action("onSetCredential")}></Credential>;
};
