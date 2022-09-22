import {Injectable} from '@angular/core';
import {ActiveToast, ToastrService} from "ngx-toastr";

export enum toasterTypes {
  success, info, warning, error
}

@Injectable({
  providedIn: 'root'
})
export class ToasterHelper {
  private currentToaster: ActiveToast<any> | undefined;

  constructor(private toaster: ToastrService) {}

  createToaster(type: toasterTypes, message: string, title: string = '') {
    if (this.currentToaster) {
      this.toaster.remove(this.currentToaster.toastId);
    }
    switch (type) {
      case toasterTypes.success:
        this.currentToaster = this.toaster.success(message, title);
        break;
      case toasterTypes.info:
        this.currentToaster = this.toaster.info(message, title);
        break
      case toasterTypes.warning:
        this.currentToaster = this.toaster.warning(message, title);
        break;
      case toasterTypes.error:
        this.currentToaster = this.toaster.error(message, title);
        break;
    }
  }
}
