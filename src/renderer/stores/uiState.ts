import { action, observable } from "mobx";

export class UiState {
  @observable sidebarShown: boolean = true;
  @observable snackbarShown: boolean = false;

  @action.bound
  toogleSidebarShown() {
    this.sidebarShown = !this.sidebarShown;
  }

  @action.bound
  setSnackbarShown(shown: boolean) {
    this.snackbarShown = shown;
  }
}
