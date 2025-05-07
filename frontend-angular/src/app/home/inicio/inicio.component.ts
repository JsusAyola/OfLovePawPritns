import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-inicio',
    imports: [],
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
    encapsulation: ViewEncapsulation.None // Asegura que el CSS no tenga interferencias de otros estilos globales
})
export class InicioComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Verifica si estás en un entorno de navegador
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
