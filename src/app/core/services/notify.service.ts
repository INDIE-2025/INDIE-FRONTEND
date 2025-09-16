import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  toast(
    message: string,
    icon: SweetAlertIcon = 'info',
    title?: string,
    ms = 4000
  ) {
    return Swal.fire({
      toast: true,
      position: 'top',
      icon,
      title: title ?? message,
      text: title ? message : undefined,
      showConfirmButton: false,
      timer: ms,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (t) => {
        t.addEventListener('mouseenter', Swal.stopTimer);
        t.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  success(message: string, title?: string, ms?: number) {
    return this.toast(message, 'success', title, ms);
  }

  error(message: string, title?: string, ms?: number) {
    return this.toast(message, 'error', title, ms);
  }

  warning(message: string, title?: string, ms?: number) {
    return this.toast(message, 'warning', title, ms);
  }

  info(message: string, title?: string, ms?: number) {
    return this.toast(message, 'info', title, ms);
  }
}

