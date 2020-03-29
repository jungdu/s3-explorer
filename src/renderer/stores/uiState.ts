import { action, observable } from "mobx";

export class UiState {
  @observable sidebarShown: boolean = true;

  @action
  toogleSidebarShown = () => {
    this.sidebarShown = !this.sidebarShown;
  };
}
