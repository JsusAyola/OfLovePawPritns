import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adopcion-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './adopcion-form.component.html',
  styleUrls: ['./adopcion-form.component.css']
})
export class AdopcionFormComponent implements OnInit {
  // Campos del formulario
  edad: string = '';
  ocupacion: string = '';
  experiencia: string = '';
  otraMascota: string = '';
  cantidadMascotas: number = 0;
  tipoMascota: string = '';
  motivo: string = '';
  tiempoDisponible: string = '';
  presupuesto: string = '';
  ninosEnCasa: string = '';
  tiempoSola: string = '';
  veterinario: string = '';
  visitasSeguimiento: string = '';

  solicitud_id: string = '';
  mascota_id: string = '';
  cuidador_id: string = '';
  adoptador_id: string = '';
  formExists: boolean = false;
  showFullTerms: boolean = false;
  aceptaTerminos: boolean = false;
  isLoading: boolean = false;
  camposAutocompletados: boolean = false;
  reusePreference: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.solicitud_id = params.get('solicitudId') || 'new';
      this.mascota_id = params.get('mascotaId') || '';

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.adoptador_id = user.id;

      if (this.mascota_id) {
        this.obtenerDetallesMascota().then(() => {
          this.cargarPreferenciaReutilizacion();
        });
      } else {
        this.cargarPreferenciaReutilizacion();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async obtenerDetallesMascota(): Promise<void> {
    try {
      const response: any = await this.http.get(
        `http://localhost:5000/api/pets/${this.mascota_id}`,
        { headers: this.createHeaders() }
      ).toPromise();
      this.cuidador_id = response.cuidador_id?._id || response.cuidador_id;
    } catch (error) {
      console.error("Error al obtener detalles de la mascota:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener los detalles de la mascota. Intenta de nuevo.',
      });
      this.router.navigate(['/dogs']);
    }
  }

  private cargarPreferenciaReutilizacion(): void {
    if (!this.adoptador_id) return;

    this.http.get<any>(
      `http://localhost:5000/api/solicitudes/last-form/${this.adoptador_id}`,
      { headers: this.createHeaders() }
    ).subscribe({
      next: (response) => {
        this.formExists = response.exists;
        this.reusePreference = response.form?.reuseForm || false;
        
        if (this.reusePreference && response.form) {
          this.autocompletarFormulario(response.form);
          this.camposAutocompletados = true;
        }
      },
      error: (error) => {
        console.error('Error al cargar preferencia:', error);
      }
    });
  }

  usarDatosAnteriores(): void {
    this.http.get<any>(
      `http://localhost:5000/api/solicitudes/last-form/${this.adoptador_id}`,
      { headers: this.createHeaders() }
    ).subscribe({
      next: (response) => {
        if (response.exists && response.form) {
          this.autocompletarFormulario(response.form);
          this.camposAutocompletados = true;
          Swal.fire({
            icon: 'success',
            title: 'Datos cargados',
            text: 'Se han cargado tus datos de la última solicitud',
            timer: 2000
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar formulario anterior:', error);
      }
    });
  }

  private autocompletarFormulario(form: any): void {
    this.edad = form.edad;
    this.ocupacion = form.ocupacion;
    this.experiencia = form.experiencia;
    this.otraMascota = form.otraMascota;
    this.cantidadMascotas = form.cantidadMascotas || 0;
    this.tipoMascota = form.tipoMascota;
    this.ninosEnCasa = form.ninosEnCasa;
    this.tiempoSola = form.tiempoSola;
    this.veterinario = form.veterinario;
    this.visitasSeguimiento = form.visitasSeguimiento;
    this.motivo = form.motivo;
    this.tiempoDisponible = form.tiempoDisponible;
    this.presupuesto = form.presupuesto;
  }

  limpiarFormulario(): void {
    this.edad = '';
    this.ocupacion = '';
    this.experiencia = '';
    this.otraMascota = '';
    this.cantidadMascotas = 0;
    this.tipoMascota = '';
    this.ninosEnCasa = '';
    this.tiempoSola = '';
    this.veterinario = '';
    this.visitasSeguimiento = '';
    this.motivo = '';
    this.tiempoDisponible = '';
    this.presupuesto = '';
    this.camposAutocompletados = false;
  }

  private getFormData(): any {
    return {
      edad: this.edad,
      ocupacion: this.ocupacion,
      experiencia: this.experiencia,
      otraMascota: this.otraMascota,
      cantidadMascotas: this.cantidadMascotas,
      tipoMascota: this.tipoMascota,
      ninosEnCasa: this.ninosEnCasa,
      tiempoSola: this.tiempoSola,
      veterinario: this.veterinario,
      visitasSeguimiento: this.visitasSeguimiento,
      motivo: this.motivo,
      tiempoDisponible: this.tiempoDisponible,
      presupuesto: this.presupuesto
    };
  }

  async onSubmit(adopcionForm: NgForm): Promise<void> {
    if (!adopcionForm.valid || !this.aceptaTerminos) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios y acepta los términos.',
      });
      return;
    }

    this.isLoading = true;

    try {
      const existeSolicitud = await this.http.get<any>(
        `http://localhost:5000/api/solicitudes/check-adoption/${this.adoptador_id}/${this.mascota_id}`,
        { headers: this.createHeaders() }
      ).toPromise();

      if (existeSolicitud.exists) {
        Swal.fire({
          icon: 'warning',
          title: '¡Ups!',
          text: 'Ya tienes una solicitud pendiente para esta mascota.',
          footer: '<a href="/mis-solicitudes">Ver mis solicitudes</a>'
        });
        this.isLoading = false;
        return;
      }

      const { value: reuseForm } = await Swal.fire({
        title: '¿Reutilizar formulario?',
        text: '¿Deseas guardar estos datos para futuras adopciones?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, reutilizar',
        cancelButtonText: 'No, llenar nuevo cada vez',
        reverseButtons: true,
        backdrop: true
      });

      const adopcionData = {
        ...this.getFormData(),
        mascota_id: this.mascota_id,
        cuidador_id: this.cuidador_id,
        adoptador_id: this.adoptador_id,
        reuseForm: reuseForm === true
      };

      this.http.post(
        'http://localhost:5000/api/solicitudes/create',
        adopcionData,
        { headers: this.createHeaders() }
      ).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: '¡Solicitud enviada!',
            text: `Tu solicitud ha sido registrada ${res.reuseForm ? 'y podrás reutilizar estos datos en futuras adopciones.' : ''}`,
            showConfirmButton: true,
            timer: 3000
          }).then(() => {
            this.router.navigate(['/mis-solicitudes']);
          });
        },
        error: (error) => {
          console.error("Error en la solicitud:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar la solicitud. Inténtalo nuevamente.',
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error("Error al verificar solicitud existente:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al procesar tu solicitud.',
      });
      this.isLoading = false;
    }
  }

  cancelar(): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea salir del formulario de adopción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, permanecer',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/dogs']);
      }
    });
  }

  toggleTerms(): void {
    this.showFullTerms = !this.showFullTerms;
  }
}