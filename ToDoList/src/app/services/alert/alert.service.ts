import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private baseToast() {
    return {
      toast: true,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1e293b',
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster',
      },
    };
  }

  success(title: string, message: string = '', timer: number = 2500): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseToast(),
      icon: 'success',
      title,
      text: message || undefined,
      iconColor: '#22c55e',
      timer,
    });
  }

  error(title: string, message: string = '', timer?: number): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseToast(),
      icon: 'error',
      title,
      text: message || undefined,
      timer: timer ?? undefined,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444',
      iconColor: '#ef4444',
    });
  }

  warning(title: string, message: string = '', timer: number = 2500): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.baseToast(),
      icon: 'warning',
      title,
      text: message || undefined,
      iconColor: '#f97316',
      timer,
    });
  }

  async confirm(
    title: string,
    message: string = '',
    confirmLabel: string = 'Sí, continuar',
    cancelLabel: string = 'Cancelar'
  ): Promise<boolean> {
    const result = await Swal.fire({
      ...this.baseToast(),
      toast: false,
      position: 'center' as const,
      icon: 'question',
      title,
      text: message || undefined,
      showCancelButton: true,
      showConfirmButton: true,
      timer: undefined,
      timerProgressBar: false,
      confirmButtonText: confirmLabel,
      cancelButtonText: cancelLabel,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
      reverseButtons: true,
      iconColor: '#6366f1',
    });
    return result.isConfirmed;
  }

  async confirmDelete(itemName: string = 'este elemento'): Promise<boolean> {
    const result = await Swal.fire({
      ...this.baseToast(),
      toast: false,
      position: 'center' as const,
      icon: 'warning',
      title: '¿Eliminar?',
      html: `Esto eliminará <strong>${itemName}</strong> y no se puede deshacer.`,
      showCancelButton: true,
      showConfirmButton: true,
      timer: undefined,
      timerProgressBar: false,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      reverseButtons: true,
      iconColor: '#ef4444',
    });
    return result.isConfirmed;
  }
}