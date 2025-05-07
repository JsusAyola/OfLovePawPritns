import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

interface Raza {
  nombre: string;
  imagen: string;
  descripcionBreve: string;
}

@Component({
  selector: 'app-pet-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pet-add.component.html',
  styleUrls: ['./pet-add.component.css']
})


export class PetAddComponent {
  todayDate: string;
  isVaccinationButtonDisabled: boolean = true;  // Por defecto, el botón está deshabilitado
  pet = {
    name: '',
    birthDate: '',
    type: '' as 'Perro' | 'Gato' | '',  
    breed: '',
    sex: '',
    size: '',
    weight: '',
    vaccines: [] as string[],
    isVaccinated: '' as string,
    sterilized: '',
    activityLevel: '',
    behaviorPeople: '',
    behaviorAnimals: '',
    image: '',
    approvalStatus: 'pendiente',
    cuidador_id: '',
    medicalConditions: '', // Nuevo campo
    allergies: '', // Nuevo campo
    location: '', // Nuevo campo
    verificationImage: '', // Nuevo campo
    ownershipConfirmation: false // Nuevo campo
  };
  image: File | null = null;
  verificationImage: File | null = null;
  private apiUrl = 'http://localhost:5000/api/pets/add';

  onVerificationImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.verificationImage = event.target.files[0]; // Asigna el archivo seleccionado
    } else {
      this.verificationImage = null; // Si no se selecciona nada, asigna null
    }
  }

  availableVaccines = [
    'Rabia', 'Parvovirus', 'Distemper', 'Hepatitis', 'Leptospirosis', 'Moquillo',
    'Panleucopenia', 'Calicivirus', 'Rinotraqueitis', 'Clamidiosis', 'Leucemia Felina', 'Peritonitis Infecciosa'
  ];

    // Función para actualizar el estado del botón de seleccionar vacunas
    updateVaccinationButtonState() {
      // Verifica si está vacunado o no para habilitar/deshabilitar el botón
      this.isVaccinationButtonDisabled = (this.pet.isVaccinated === 'No');
      this.vacunasSeleccionadasTexto = ''; 
    }
  
    // Función que se llama cuando el usuario cambia la respuesta de vacunación
    onVaccinationChange(response: string) {
      this.pet.isVaccinated = response;  // Actualiza la respuesta de vacunación
      this.updateVaccinationButtonState();  // Actualiza el estado del botón
    }

  mostrarSelectorVacunas: boolean = false; // Controla si el modal de vacunas está abierto
 
  // Vacunas para perros
  vacunasPerro: string[] = [
    'Rabia',
    'Moquillo',
    'Parvovirus',
    'Hepatitis Infecciosa Canina',
    'Leptospirosis',
    'Parainfluenza',
    'Bordetella',
    'Coronavirus Canino'
  ];

  // Vacunas para gatos
  vacunasGato: string[] = [
    'Rabia',
    'Panleucopenia',
    'Rinotraqueítis Viral Felina',
    'Calicivirus Felino',
    'Leucemia Felina',
    'Clamidiosis Felina',
    'Peritonitis Infecciosa Felina',
    'Bordetella Felina'
  ];
  vacunasSeleccionadasTexto: string = ''; // Texto para mostrar las vacunas seleccionadas

  mostrarSelectorRaza = false;
  razasFiltradas: Raza[] = [];
  razas: Record<'Perro' | 'Gato', Raza[]> = {
    Perro: [
      {
        nombre: 'Labrador Retriever',
        imagen: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTeCip28hMPQyQcsh808NZPXxrM0nXqx1oigPD8X6bNM6vjEO6Hviy8czJAAStz9qscXj-EdZaKjKm_75O_Z91FIw',
        descripcionBreve: 'Amigable, enérgico, ideal para familias.'
      },
      {
        nombre: 'Pastor Alemán',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH8JH02RLW5Ae0VMP8w5dk1IX8oHfrBFON--9TmAy980UGyY1E5ID9snvAUQZrs4UNOgY_qCNFVjipzXFWF4UtXQ',
        descripcionBreve: 'Inteligente, leal, valiente, necesita entrenamiento y socialización temprana.'
      },
      {
        nombre: 'Golden Retriever',
        imagen: 'https://cdn.wamiz.fr/cdn-cgi/image/format=auto,quality=80,width=532,height=532,fit=cover/animal/breed/pictures/66fc1c26507b0627898817.jpg',
        descripcionBreve: 'Amigable, inteligente, cariñoso, ideal para ejercicio y estimulación mental.'
      },
      {
        nombre: 'Bulldog',
        imagen: 'https://mivet.com/wp-content/uploads/fly-images/1420/shutterstock_335066660-740x500-c.jpg',
        descripcionBreve: 'Dócil, leal, amigable, requiere cuidado de piel y control de peso.'
      },
      {
        nombre: 'Beagle',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShpVgOTjh2Bqb_fR8O6_30xppY1bQ-GwGPLoFnW6BxFyHgVAgbhg4HUWYifry7gNVB-AoFzXHaYNO-JjRIuk8u1w',
        descripcionBreve: 'Curioso, amigable, energético, necesita ejercicio frecuente y entrenamiento.'
      },
      {
        nombre: 'Rottweiler',
        imagen: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ6fDOULgFEekIieXO5Na8DlN2bxv7B1STElpgunCsPvMsqGQB2WQV5wYgMvx1I5HouioEfCPtlaNVQumBXPxkkLQ',
        descripcionBreve: 'Protector, leal, valiente, requiere entrenamiento firme y socialización temprana.'
      },
      {
        nombre: 'Dóberman',
        imagen: 'https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/XQ5OB4SRZ5B5LD7S7QIRCLHTVY.jpg',
        descripcionBreve: 'Inteligente, enérgico, leal, necesita ejercicio intenso y entrenamiento continuo.'
      },
      {
        nombre: 'Husky Siberiano',
        imagen: 'https://animalxop.com/cdn/shop/articles/R_3.jpg?v=1701896718',
        descripcionBreve: 'Amigable, independiente, juguetón, requiere ejercicio diario y cuidado del pelaje.'
      },
      {
        nombre: 'Pug',
        imagen: 'https://c.files.bbci.co.uk/684E/production/_124820762_pug4.jpg',
        descripcionBreve: 'Cariñoso, sociable, juguetón, necesita control de peso y limpieza de pliegues faciales.'
      },
      {
        nombre: 'Chihuahua',
        imagen: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRk9Fhs8PsLmVxSARjP14B8BlDP-mWAQ3WPcUB53wAwr8SI7eOKw56UPATcKiU2HEJadqcScudpKg_yRAu8wZstZQ',
        descripcionBreve: 'Alerta, leal, valiente, necesita protección contra el frío y socialización temprana.'
      },
      {
        nombre: 'Boxer',
        imagen: 'https://images.ctfassets.net/denf86kkcx7r/cfiQGTrKSKyg6sOFNXWjz/3935effb717f6d1bb255c80813ee74cc/boxer_seguro_perro_santevet-56?h=320&w=520&fit=thumb',
        descripcionBreve: 'Energético, leal, protector, requiere ejercicio regular y socialización.'
      },
      {
        nombre: 'Shih Tzu',
        imagen: 'https://losamigosdefirulais.com/wp-content/uploads/2024/03/shih-tzu.webp',
        descripcionBreve: 'Cariñoso, juguetón, tranquilo, requiere cepillado frecuente y cuidado ocular.'
      }
    ],    
    Gato: [
        {
          nombre: 'Siamés',
          imagen: 'https://cdn.pixabay.com/photo/2017/03/08/08/52/cat-2126225_1280.jpg',
          descripcionBreve: 'Sociable, vocal, curioso, necesita cepillado regular y socialización.'
        },
        {
          nombre: 'Persa',
          imagen: 'https://cdn.pixabay.com/photo/2022/02/17/04/54/animal-7017939_1280.jpg',
          descripcionBreve: 'Tranquilo, cariñoso, perezoso, requiere cepillado diario y cuidado ocular.'
        },
        {
          nombre: 'Maine Coon',
          imagen: 'https://media.zenfs.com/en/pethelpful_915/153f25e180547b113197a5176df8c33a',
          descripcionBreve: 'Amistoso, juguetón, sociable, necesita cepillado frecuente debido a su pelo largo.'
        },
        {
          nombre: 'Bengalí',
          imagen: 'https://i0.wp.com/mascooriente.co/wp-content/uploads/2021/08/bengali-2.jpeg?fit=520%2C355&ssl=1',
          descripcionBreve: 'Activo, inteligente, juguetón, necesita estimulación mental y física constante.'
        },
        {
          nombre: 'Sphynx',
          imagen: 'https://www.infobae.com/resizer/v2/6B2JO35TJJEPNPR4NBDNIR2DLU.png?auth=9c70fcae985e409023a3356faff819f1fba15d44d8eb72053564f6b7a0d04a66&smart=true&width=350&height=622&quality=85',
          descripcionBreve: 'Cariñoso, extrovertido, juguetón, requiere baños frecuentes para evitar acumulación de grasa.'
        },
        {
          nombre: 'British Shorthair',
          imagen: 'https://cdn.prod.website-files.com/63634f4a7b868a399577cf37/66d5e1757aa4871d8e315421_british%20shorthair.jpg',
          descripcionBreve: 'Tranquilo, leal, independiente, necesita cepillado semanal para mantener su pelaje.'
        },
        {
          nombre: 'Ragdoll',
          imagen: 'https://www.zooplus.es/magazine/wp-content/uploads/2017/10/Ragdoll-1.jpg',
          descripcionBreve: 'Dócil, cariñoso, relajado, requiere cepillado regular para evitar enredos.'
        },
        {
          nombre: 'Scottish Fold',
          imagen: 'https://www.tiendanimal.es/articulos/wp-content/uploads/2022/01/Scottish-Fold-raza-1200x900.jpg',
          descripcionBreve: 'Dulce, tranquilo, sociable, requiere revisiones médicas frecuentes por problemas óseos.'
        },
        {
          nombre: 'Abyssinian',
          imagen: 'https://www.catster.com/wp-content/uploads/2023/11/chocolate-abyssinian-outdoor_Nan-Liu_Shutterstock.jpg',
          descripcionBreve: 'Activo, curioso, juguetón, requiere mucho ejercicio y estimulación mental.'
        },
        {
          nombre: 'Oriental',
          imagen: 'https://www.thesprucepets.com/thmb/V1bLyOs_1eZuTJJTFpt6tTF_eL0=/3456x0/filters:no_upscale():strip_icc()/Orientalshorthairinbasket-842388b36e714d11a34a329ab399dbeb.jpg',
          descripcionBreve: 'Inteligente, sociable, vocal, necesita mucha atención y compañía.'
        },
        {
          nombre: 'Birmano',
          imagen: 'https://www.purina.es/sites/default/files/2021-02/CAT%20HERO_0003_Birman.jpg',
          descripcionBreve: 'Dócil, cariñoso, sociable, requiere cepillado regular para mantener su pelaje sedoso.'
        },
        {
          nombre: 'Criollo',
          imagen: 'https://cloudfront-us-east-1.images.arcpublishing.com/semana/4ZP3XLAUCNAHZJHFN5C2YJL5Y4.jpg',
          descripcionBreve: 'Independiente, adaptable, variado, depende del entorno y genética del gato.'
        }
      ]      
  };

  constructor(private http: HttpClient, 
    private router: Router, 
    private location: Location) {
this.todayDate = new Date().toISOString().split('T')[0];
}



  goBack() {
    this.location.back(); // Esto lleva al usuario a la página anterior
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  toggleVaccine(event: any, vaccine: string) {
    if (event.target.checked) {
      this.pet.vaccines.push(vaccine);
    } else {
      this.pet.vaccines = this.pet.vaccines.filter(v => v !== vaccine);
    }
  }

  abrirSelectorRaza() {
    if (this.pet.type === 'Perro' || this.pet.type === 'Gato') {
      console.log('Abriendo selector de raza...'); // QUITAR!
      this.mostrarSelectorRaza = true;
      this.razasFiltradas = this.razas[this.pet.type];
    } else {
      console.log('Tipo de mascota no seleccionado.');
    }
  }
  
  

  seleccionarRaza(raza: { nombre: string }) {
    this.pet.breed = raza.nombre;
    this.mostrarSelectorRaza = false;
  }

  cerrarSelectorRaza() {
    this.mostrarSelectorRaza = false;
  }

  resetRaza() {
    this.pet.breed = ''; // Limpiar la raza
    this.pet.vaccines = []; // Limpiar las vacunas seleccionadas
    this.vacunasSeleccionadasTexto = ''; // Limpiar el texto de las vacunas seleccionadas
    console.log('Tipo de mascota cambiado. Vacunas y raza limpiadas.'); // Depuración
  }


  // Abrir modal de vacunas
  abrirSelectorVacunas() {
    if (this.pet.type === 'Perro' || this.pet.type === 'Gato') {
      console.log('Selector de vacunas abierto');
      this.mostrarSelectorVacunas = true; // Abre el modal
      console.log('Modal de vacunas abierto'); // Para depuración
    } else {
      console.log('Tipo de mascota no seleccionado.'); // Para depuración
    }
  }


// Cerrar modal de vacunas
cerrarSelectorVacunas() {
  this.mostrarSelectorVacunas = false;
}

// Seleccionar o deseleccionar una vacuna
toggleVacuna(vacuna: string) {
  if (this.pet.vaccines.includes(vacuna)) {
    this.pet.vaccines = this.pet.vaccines.filter(v => v !== vacuna); // Quitar vacuna
  } else {
    this.pet.vaccines.push(vacuna); // Añadir vacuna
  }
}

// Guardar selección y cerrar modal
guardarVacunas() {
  this.vacunasSeleccionadasTexto = this.pet.vaccines.join(', '); // Mostrar vacunas seleccionadas
  this.cerrarSelectorVacunas();
}

obtenerUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      this.pet.location = `${lat}, ${lng}`;
    }, error => {
      console.error("Error obteniendo ubicación:", error);
      alert("No se pudo obtener la ubicación.");
    });
  } else {
    alert("Geolocalización no soportada en este navegador.");
  }
}

onSubmit(form: any) {
  // Validar campos obligatorios en el frontend
  if (!this.pet.name) {
    this.showErrorAlert('El nombre es obligatorio.');
    return;
  }

  // Validar que el nombre solo contenga letras, tildes y espacios
  const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(this.pet.name)) {
    this.showErrorAlert('El nombre solo puede contener letras y tildes.');
    return;
  }

  if (!this.pet.birthDate) {
    this.showErrorAlert('La fecha de nacimiento es obligatoria.');
    return;
  }

  if (!this.pet.type) {
    this.showErrorAlert('Debes seleccionar el tipo de mascota (Perro o Gato).');
    return;
  }

  if (!this.pet.breed) {
    this.showErrorAlert('Debes seleccionar la raza de la mascota.');
    return;
  }

  if (!this.pet.sex) {
    this.showErrorAlert('Debes seleccionar el sexo de la mascota.');
    return;
  }

  if (!this.pet.size) {
    this.showErrorAlert('Debes seleccionar el tamaño de la mascota.');
    return;
  }

  if (!this.pet.weight) {
    this.showErrorAlert('Debes seleccionar el peso de la mascota.');
    return;
  }

  // Solo validar vacunas si está vacunada
  if (this.pet.isVaccinated === 'Sí') {
    if (!this.pet.vaccines || this.pet.vaccines.length === 0) {
      this.showErrorAlert('Debes seleccionar al menos una vacuna.');
      return;
    }
  }

  // Validar si el estado de vacunación ha sido indicado
  if (this.pet.isVaccinated === null || this.pet.isVaccinated === undefined) {
    this.showErrorAlert('Debes indicar si la mascota está vacunada.');
    return;
  }

  if (this.pet.sterilized === null || this.pet.sterilized === undefined) {
    this.showErrorAlert('Debes indicar si la mascota está esterilizada/castrada.');
    return;
  }

  if (!this.pet.activityLevel) {
    this.showErrorAlert('Debes seleccionar el nivel de actividad de la mascota.');
    return;
  }

  if (!this.pet.behaviorPeople) {
    this.showErrorAlert('Debes seleccionar el comportamiento de la mascota con las personas.');
    return;
  }

  if (!this.pet.behaviorAnimals) {
    this.showErrorAlert('Debes seleccionar el comportamiento de la mascota con otros animales.');
    return;
  }

  if (!this.image) {
    this.showErrorAlert('Debes subir una imagen de la mascota.');
    return;
  }

  // Validar la imagen de verificación
  if (!this.verificationImage) {
    this.showErrorAlert('Debes subir una imagen de verificación.');
    return;
  }

  // Validar la ubicación del cuidador
  if (!this.pet.location) {
    this.showErrorAlert('Debes proporcionar una ubicación.');
    return;
  }

  // Validar condiciones médicas previas
  if (this.pet.medicalConditions === null || this.pet.medicalConditions === undefined || this.pet.medicalConditions === '') {
    this.showErrorAlert('Debes indicar si la mascota tiene condiciones médicas previas.');
    return;
  }

  // Si tiene condiciones médicas, validar que haya al menos una seleccionada
  if (this.pet.medicalConditions === 'Sí' && (!this.pet.medicalConditions || this.pet.medicalConditions.length === 0)) {
    this.showErrorAlert('Debes seleccionar al menos una condición médica.');
    return;
  }

  // Validar alergias
  if (this.pet.allergies === null || this.pet.allergies === undefined || this.pet.allergies === '') {
    this.showErrorAlert('Debes indicar si la mascota tiene alergias.');
    return;
  }

  // Si tiene alergias, validar que haya al menos una seleccionada
  if (this.pet.allergies === 'Sí' && (!this.pet.allergies || this.pet.allergies.length === 0)) {
    this.showErrorAlert('Debes seleccionar al menos una alergia.');
    return;
  }

  // Validar la confirmación de tenencia
  if (!this.pet.ownershipConfirmation) {
    console.log("⚠️ Debes confirmar la tenencia antes de continuar.");
    return;
  }

  // Alerta de confirmación antes de proceder con el registro
  Swal.fire({
    icon: 'question',
    title: '¿Estás seguro de registrar esta mascota?',
    text: 'Asegúrate de que todos los datos son correctos.',
    showCancelButton: true,
    confirmButtonText: 'Sí, registrar',
    cancelButtonText: 'No, cancelar',
    confirmButtonColor: '#4CAF50',
    cancelButtonColor: '#f44336'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, se ejecuta el método procederConRegistro
      this.procederConRegistro();
    } else {
      // Si el usuario cancela, simplemente no se hace nada
      console.log('Registro de mascota cancelado');
    }
  });
}  

// Método para proceder con el registro de la mascota
procederConRegistro() {
  const token = localStorage.getItem('token');
  const cuidador_id = localStorage.getItem('userId');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const formData = new FormData();
  formData.append('name', this.pet.name);
  formData.append('birthDate', this.pet.birthDate);
  formData.append('type', this.pet.type);
  formData.append('breed', this.pet.breed);
  formData.append('sex', this.pet.sex);
  formData.append('size', this.pet.size);
  formData.append('weight', this.pet.weight);
  formData.append('isVaccinated', this.pet.isVaccinated.toString());
  formData.append('sterilized', this.pet.sterilized.toString());
  formData.append('activityLevel', this.pet.activityLevel);
  formData.append('behaviorPeople', this.pet.behaviorPeople);
  formData.append('behaviorAnimals', this.pet.behaviorAnimals);
  formData.append('approvalStatus', this.pet.approvalStatus);
  formData.append('vaccines', JSON.stringify(this.pet.vaccines));
  formData.append('medicalConditions', this.pet.medicalConditions);
  formData.append('allergies', this.pet.allergies);
  formData.append('location', this.pet.location);
  formData.append('ownershipConfirmation', this.pet.ownershipConfirmation.toString());

  if (this.image) {
    formData.append('image', this.image);
  }

  if (this.verificationImage) {
    formData.append('verificationImage', this.verificationImage); // Agrega la imagen de verificación
  }

  if (cuidador_id) {
    formData.append('cuidador_id', cuidador_id);
  }

  this.http.post(this.apiUrl, formData, { headers }).subscribe(
    (response) => {
      console.log('Mascota registrada con éxito:', response);
      this.showSuccessAlert(); // Mostrar alerta de éxito
    },
    (error) => {
      console.error('Error al registrar la mascota:', error);

      // Mostrar mensajes de error específicos del backend
      if (error.error.errors) {
        const errors = error.error.errors;
        if (errors.name) {
          this.showErrorAlert(errors.name.message);
        } else if (errors.birthDate) {
          this.showErrorAlert(errors.birthDate.message);
        } else {
          this.showErrorAlert('Error al registrar la mascota. Por favor, revisa los datos.');
        }
      } else {
        this.showErrorAlert('Error al registrar la mascota. Por favor, intenta nuevamente.');
      }
    }
  );
}

// Método para mostrar alertas de éxito
showSuccessAlert() {
  Swal.fire({
    icon: 'success',
    title: '¡Mascota registrada con éxito!',
    text: 'Serás redirigido a la lista de mascotas.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#4CAF50',
    timer: 5000,
    timerProgressBar: true
  }).then(() => {
    this.router.navigate(['/dashboard/cuidador-panel']);
  });
}

// Método para mostrar alertas de error
showErrorAlert(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#f44336'
  });
}
}
