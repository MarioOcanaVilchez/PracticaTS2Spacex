import { buscarLanzamientos, buscarLanzamientosPorEstado, estaEnFavoritos, getLancamientos, obtenerLanzamientos, quitarFavorito, guardarLanzamiento } from './controller'
import type { Lanzamiento } from './interfaces'
import './style.css'


let lanzamientos:Lanzamiento[] = await getLancamientos();

lanzamientos.forEach((lanzamiento) => console.log(lanzamiento.name)
);

function pintaLanzamiento(lanzamiento:Lanzamiento):string{
  return `<div class="lanzamiento"> 
  <h2>${lanzamiento.name} </h2>
  <p>Lanzado el: ${lanzamiento.date_utc}</p>
  <p>${lanzamiento.success != null && lanzamiento.success ? 'Con exito' : lanzamiento.success != null ? 'Fallido' : 'Sin lanzar aún'}</p>
   ${estaEnFavoritos(lanzamiento) ? `<button type="button" data-accion="quitar" data-id="${lanzamiento.name}">Quitar</button>` : `<button type="button" data-accion="guardar" data-id="${lanzamiento.name}">Guardar</button>`}
  </div>
  `
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<input type="text" id="Buscador" name="Buscador" placeholder="Buscador">
<button id="Buscar"> Buscar </button>
<select id="selector">
<option value="Exitosos" selected>Exitosas</option>
<option value="Fallidos">Fallidos</option>
<option value="Pendientes">Pendientes</option>
</select>
<button id="BotonSelector"> Buscar </button>
<button id="Favoritos"> Favoritos </button>
<div class="estadisticas">
<div class="estadistica exitos">
<h3>Nº Exitos</h3>
<p>${lanzamientos.filter((lanzamiento) => lanzamiento.success != null && lanzamiento.success == true).length}</p>
</div>
<div class="estadistica fallos">
<h3>Nº Fallos</h3>
<p>${lanzamientos.filter((lanzamiento) => lanzamiento.success != null && lanzamiento.success == false).length}</p>
</div>
<div class="estadistica pendientes">
<h3>Nº Pendientes</h3>
<p>${lanzamientos.filter((lanzamiento) => lanzamiento.success == null).length}</p>
</div>
</div>
<div id="datos">
</div>
`
pintaLanzamientos(lanzamientos);

function pintaLanzamientos(lanzamientos:Lanzamiento[]):void{
  let textoLanzamientos:string = '';
  lanzamientos.forEach((lanzamiento) => (textoLanzamientos += pintaLanzamiento(lanzamiento)));
  document.querySelector<HTMLDivElement>('#datos')!.innerHTML = `
  ${textoLanzamientos}
  `
  document.querySelector<HTMLDivElement>('#datos')!.addEventListener("click", (event: MouseEvent) => {
    const objetivo = event.target;
    if (!(objetivo instanceof Element)) return;
    const boton = objetivo.closest<HTMLButtonElement>("button[data-accion]");
    if (!boton || !document.querySelector<HTMLDivElement>('#datos')!.contains(boton)) return;

    const name = boton.dataset.id;
    const accion = boton.dataset.accion;

    const lanzamiento = lanzamientos.find(
      l => String(l.name) === name
    );
    if (!lanzamiento) return;
    if (accion === "guardar") {
      guardarLanzamiento(lanzamiento);
    } else if (accion === "quitar") {
      quitarFavorito(lanzamiento);
    }
  });
}
document.querySelector<HTMLButtonElement>('#Buscar')?.addEventListener('click',() => buscarLanzamientosNombre())
function buscarLanzamientosNombre(){
  pintaLanzamientos(buscarLanzamientos(lanzamientos,document.querySelector<HTMLInputElement>('#Buscador')!.value))
}
document.querySelector<HTMLButtonElement>('#BotonSelector')?.addEventListener('click',() => pintaLanzamientosEstado())
function pintaLanzamientosEstado(){
  pintaLanzamientos(buscarLanzamientosPorEstado(lanzamientos,document.querySelector<HTMLSelectElement>('#selector')!.value))
}
document.querySelector<HTMLButtonElement>('#Favoritos')?.addEventListener('click',() => pintaLanzamientosFavoritos());
function pintaLanzamientosFavoritos(){
  let lanzamientosFavoritos:Lanzamiento[] | null = obtenerLanzamientos();
  if (lanzamientosFavoritos == null) lanzamientosFavoritos = [];
   pintaLanzamientos(lanzamientosFavoritos);
}
