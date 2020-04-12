import DeletePopup from "@renderer/components/Popup/DeletePopup";
import ToolTip from "@renderer/components/Tooltip";
import { s3 } from "@renderer/context";
import IcDelete from "@renderer/image/IcDelete";
import { useObserver } from "mobx-react";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { actionButtonStyle } from "./constants";

const Self = styled.button`
  ${actionButtonStyle}
`;

interface Props {
  className?: string;
}

const DeleteButton: React.FC<Props> = ({ className }) => {
  const [popupShown, setPopupShown] = useState<boolean>(false);

  const handleOnClick = useCallback(() => {
    setPopupShown(true);
  }, [popupShown]);

  const hidePopup = useCallback(() => {
    setPopupShown(false);
  }, [popupShown]);

  return useObserver(() => {
    const { selectedObjects } = s3.useStore();
    const disabled = selectedObjects.length === 0;

    return (
      <>
        <Self className={className} onClick={handleOnClick} disabled={disabled}>
          {!disabled && <ToolTip direction="BOTTOM">DELETE</ToolTip>}
          <IcDelete />
        </Self>
        <DeletePopup
          shown={popupShown}
          hidePopup={() => {
            hidePopup();
          }}
        />
      </>
    );
  });
};

export default DeleteButton;
