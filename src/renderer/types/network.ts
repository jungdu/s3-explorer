export enum TransportState {
  LOADING = "LOADING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}

export type Transport<T> = T & {
  id: string;
  state: TransportState;
};
