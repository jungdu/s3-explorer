import React from "react";
import { withKnobs } from "@storybook/addon-knobs";

import Application from "./Application";
import { s3 } from "@renderer/context";

export default {
  title: "Application|main",
  component: Application,
  decorators: [withKnobs]
};

export const application = () => {
  return (
    <s3.Provider>
      <Application />
    </s3.Provider>
  );
};
