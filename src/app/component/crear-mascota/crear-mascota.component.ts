import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/sevicios/usuario.service';
import { MascotaService } from 'src/app/sevicios/mascota.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-mascota',
  templateUrl: './crear-mascota.component.html',
  styleUrls: ['./crear-mascota.component.css'],
})
export class CrearMascotaComponent implements OnInit {
  public showModal: boolean = false;
  public token: any;
  public nombre: any;
  public id: any;
  public rol: any;
  public idusuario: any;
  public datosMascota: any;
  public base_url = environment.url;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private mascotaService: MascotaService
  ) {
    this.token = this.usuarioService.obtenerToken();
    this.nombre = this.usuarioService.obtenerNombre();
    this.idusuario = this.usuarioService.obtenerIdentidad();
    this.rol = this.usuarioService.obtenerRol();
  }

  ngOnInit(): void {
    this.validar();
  }
  modal() {
    this.showModal = true;
  }
  public onCloseModal() {
    this.showModal = false;
  }

  validar() {
    if (this.token) {
      this.mascotaPorUsuario();
    } else {
      this.router.navigate(['no-autorizado']);
    }
  }

  mascotaPorUsuario() {
    this.mascotaService.mascotaPorUsuario(this.idusuario).subscribe((res) => {
      this.datosMascota = res;
      console.log(this.datosMascota);
    });
  }

  eliminarMascota(row: any) {
    this.mascotaService.eliminarMascota(row._id).subscribe((res) => {
      Swal.fire('Mascota eliminado!', 'error');
      this.mascotaPorUsuario();
    });
  }

  public calcularEdad(fecha: string) {
    const fechaDeNacimiento = new Date(fecha);
    const anosCompletos =
      Math.floor(new Date().getTime() - new Date(fechaDeNacimiento).getTime()) /
      (1000 * 60 * 60 * 24 * 365);

    const anos = Math.floor(anosCompletos);
    const meses = Math.floor((anosCompletos % 1) * 12);

    if (anos < 1) return `${meses} meses`;
    if (meses === 0 && anos === 1) return `${anos} año`;
    if (meses === 0) return `${anos} años`;
    return `${anos} años y ${meses} meses`;
  }
}
