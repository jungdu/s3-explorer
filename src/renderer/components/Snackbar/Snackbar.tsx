import { getNameWithoutPath } from "@common/utils/format";
import { s3, uiState } from "@renderer/context";
import { default as IcCloseOrig } from "@renderer/image/IcClose";
import loading from "@renderer/image/loading.svg";
import success from "@renderer/image/success.svg";
import { TransportState } from "@renderer/types/network";
import { toJS } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 340px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
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

const UploadItem = styled.li`
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  flex-grow: 1;
`;
const UploadItemName = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const UploadList = styled.ul`
  background: white;
  padding: 0 10px;
  border: 1px solid #8f8f8f;
  max-height: 190px;
  overflow-y: auto;
`;

const UploadStateIcon = styled.span<{ iconSrc: string }>`
  width: 24px;
  height: 24px;
  background: url(${props => props.iconSrc});
  background-size: 100% 100%;
`;

const Snackbar: React.FC = () =>
  useObserver(() => {
    const { uploadingItems, uploadList } = s3.useStore();
    const { snackbarShown, setSnackbarShown } = uiState.useStore();

    console.log("uploadList :", toJS(uploadList));

    return snackbarShown ? (
      <Self>
        <Header>
          {uploadingItems.length > 0
            ? `${uploadingItems.length}개 항목 업로드 중...`
            : `${uploadList.length}개 항목 업로드 완료`}

          <IcClose
            onClick={() => {
              setSnackbarShown(false);
            }}
          />
        </Header>
        <UploadList>
          {uploadList.map((item, i) => (
            <UploadItem key={i}>
              <UploadItemName>
                {getNameWithoutPath(item.fileName)}
              </UploadItemName>
              <UploadStateIcon
                iconSrc={
                  item.state === TransportState.LOADING ? loading : success
                }
              />
            </UploadItem>
          ))}
        </UploadList>
      </Self>
    ) : null;
  });

export default Snackbar;
