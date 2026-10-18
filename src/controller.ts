import type { Lanzamiento } from "./interfaces";


export async function getLancamientos():Promise<Lanzamiento[]>{
    var response = await fetch(`https://gateway.pipeworx.io/spacex/v4/launches`);
    if (!response.ok) throw new Error();
    return await response.json() as Lanzamiento[];
}

export function buscarLanzamientos(lanzamientos:Lanzamiento[],texto:string):Lanzamiento[]{
    let seleccionados:Lanzamiento[] = [];
    lanzamientos.forEach((lanzamiento) => lanzamiento.name.toLowerCase().includes(texto.toLowerCase()) ? seleccionados.push(lanzamiento) : '');
    return seleccionados;
}
export function buscarLanzamientosPorEstado(lanzamiento:Lanzamiento[],seleccion:string):Lanzamiento[]{
    let seleccionados:Lanzamiento[] = [];
    switch (seleccion){
        case 'Exitosos':
            lanzamiento.forEach((lanzamiento) => lanzamiento.success != null && lanzamiento.success == true ? seleccionados.push(lanzamiento) : '');
            break;
        case 'Fallidos':
            lanzamiento.forEach((lanzamiento) => lanzamiento.success != null && lanzamiento.success == false ? seleccionados.push(lanzamiento) : '');
            break;
        case 'Pendientes':
            lanzamiento.forEach((lanzamiento) => lanzamiento.success == null ? seleccionados.push(lanzamiento) : '');
            break;
    }
    return seleccionados;
}

export function guardarLanzamiento(lanzamiento: Lanzamiento): void {
  if (estaEnFavoritos(lanzamiento)) return;
  let lanzamientosFavoritos: Lanzamiento[] | null = obtenerLanzamientos();
  if (lanzamientosFavoritos == null) lanzamientosFavoritos = [];
  lanzamientosFavoritos.push(lanzamiento);
  localStorage.setItem('lanzamientosFavoritos', JSON.stringify(lanzamientosFavoritos));
}

export function obtenerLanzamientos(): Lanzamiento[] | null {
  const valor = localStorage.getItem('lanzamientosFavoritos');
  if (valor === null) {
    return null;
  }
  try {
    return JSON.parse(valor) as Lanzamiento[];
  } catch {
    return null;
  }
}
export function estaEnFavoritos(lanzamiento:Lanzamiento):boolean{
    let lanzamientosFavoritos:Lanzamiento[] | null = obtenerLanzamientos();
    if (lanzamientosFavoritos == null) return false;
    else {
        for (const lanzamientosFavorito of lanzamientosFavoritos) {
            if (lanzamientosFavorito.name == lanzamiento.name) return true;
        }
    }
    return false;
}
export function quitarFavorito(lanzamiento:Lanzamiento):void{
    let lanzamientosFavoritos:Lanzamiento[] | null = obtenerLanzamientos();
    if (lanzamientosFavoritos == null) return;
    lanzamientosFavoritos = lanzamientosFavoritos.filter((lanzamientosFavorito) => lanzamientosFavorito.name != lanzamiento.name);
    localStorage.setItem('lanzamientosFavoritos', JSON.stringify(lanzamientosFavoritos));
}