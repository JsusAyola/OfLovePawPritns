import { Component } from '@angular/core';

@Component({
    selector: 'app-como-adoptar',
    imports: [],
    templateUrl: './como-adoptar.component.html',
    styleUrl: './como-adoptar.component.css'
})
export class ComoAdoptarComponent {
  instructions = {
    STEP1: "Acceder a Pets Adoption",
    STEP2: "Registrarse en el sistema",
    STEP3: "Hacer click en la sección de adopciones",
    STEP4: "Seleccionar la mascota que desea adoptar",
    STEP5: "Hacer click en el botón 'Solicitar adopción'",
    STEP6: "Rellenar el formulario de pre-adopción y hacer click en enviar",
  };
}