import { s3, uiState } from "@renderer/context";
import { default as IcCloseOrig } from "@renderer/image/IcClose";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 340px;
  background: #323232;
  padding: 12px;
  color: #ddd;
`;

const IcClose = styled(IcCloseOrig)`
  margin-left: auto;
  cursor: pointer;
  path {
    fill: #ccc !important;
  }

  &:hover path {
    fill: #fff !important;
  }
`;

// TODO snackbar list를 child로 보여주도록 추가해야함.
const Snackbar: React.FC = () =>
  useObserver(() => {
    const { uploadingItems, uploadList } = s3.useStore();
    const { snackbarShown, setSnackbarShown } = uiState.useStore();

    return snackbarShown ? (
      <Self>
        {uploadingItems.length > 0
          ? `${uploadingItems.length}개 항목 업로드 중...`
          : `${uploadList.length}개 항목 업로드 완료`}

        <IcClose
          onClick={() => {
            setSnackbarShown(false);
          }}
        />
      </Self>
    ) : null;
  });

export default Snackbar;
