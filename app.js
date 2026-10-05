const mes = document.getElementById("mes");
const anio = document.getElementById("anio");
const tablaDias = document.getElementById("tablaDias");
const totalHoras = document.getElementById("totalHoras");
const borrarMes = document.getElementById("borrarMes");


// ==========================================
// FECHA ACTUAL
// ==========================================

const fecha = new Date();

anio.value = fecha.getFullYear();
mes.value = fecha.getMonth();


// ==========================================
// DÍAS DE LA SEMANA
// ==========================================

const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];


// ==========================================
// CONVERTIR HH:MM A MINUTOS
// ==========================================

function minutos(hora) {

    const partes = hora.split(":");

    return Number(partes[0]) * 60 + Number(partes[1]);

}


// ==========================================
// CONVERTIR MINUTOS A HH:MM
// ==========================================

function horaTexto(total) {

    const horas = Math.floor(total / 60);

    const minutosRestantes = total % 60;

    return (
        String(horas).padStart(2, "0") +
        ":" +
        String(minutosRestantes).padStart(2, "0")
    );

}

function mostrarHora(hora) {

    if (!hora) {
        return "";
    }

    if (formatoHora === "24") {
        return hora;
    }

    const partes = hora.split(":");

    let horas = parseInt(partes[0]);
    const minutos = partes[1];

    const periodo =
        horas >= 12 ? "PM" : "AM";

    if (horas === 0) {
        horas = 12;
    } else if (horas > 12) {
        horas -= 12;
    }

    return (
        String(horas).padStart(2, "0") +
        ":" +
        minutos +
        " " +
        periodo
    );
}


// ==========================================
// CLAVE DEL MES
// ==========================================

function obtenerClave() {

    return `horas_${anio.value}_${mes.value}`;

}


// ==========================================
// CARGAR DATOS
// ==========================================

function cargarDatos() {

    const datosGuardados =
        localStorage.getItem(obtenerClave());

    if (!datosGuardados) {

        return {};

    }

    return JSON.parse(datosGuardados);

}


// ==========================================
// GUARDAR DATOS
// ==========================================

function guardarDatos() {

    const datos = {};

    const entradas =
        document.querySelectorAll(".entrada");

    entradas.forEach(entrada => {

        const dia =
            entrada.dataset.dia;

        const salida =
            document.querySelector(
                `.salida[data-dia="${dia}"]`
            );

        datos[dia] = {

            entrada: entrada.value,

            salida: salida.value

        };

    });

    localStorage.setItem(
        obtenerClave(),
        JSON.stringify(datos)
    );

}


// ==========================================
// BORRAR UN DÍA
// ==========================================

function borrarDia(dia) {

    const datos =
        cargarDatos();

    delete datos[dia];

    localStorage.setItem(
        obtenerClave(),
        JSON.stringify(datos)
    );

    crearDias();

}


// ==========================================
// BORRAR TODO EL MES
// ==========================================

function borrarTodoElMes() {

    const confirmar = confirm(
        "¿Quieres borrar todos los datos del mes seleccionado?"
    );

    if (!confirmar) {

        return;

    }

    localStorage.removeItem(
        obtenerClave()
    );

    crearDias();

}


// ==========================================
// SELECTOR DE HORA
// ==========================================

function abrirSelectorHora(campo) {

    // Si ya hay un selector abierto, cerrarlo

    const selectorAnterior =
        document.querySelector(".selector-hora");

    if (selectorAnterior) {

        selectorAnterior.remove();

    }


    // ======================================
    // HORA ACTUAL
    // ======================================

    let hora24 = 0;
    let minutoActual = 0;

    if (campo.value) {

        const partes =
            campo.value.split(":");

        hora24 =
            Number(partes[0]);

        minutoActual =
            Number(partes[1]);

    }


    // Convertir a formato 12 horas

    let periodo =
        hora24 >= 12 ? "PM" : "AM";

    let hora12 =
        hora24 % 12;

    if (hora12 === 0) {

        hora12 = 12;

    }


    // ======================================
    // CREAR SELECTOR
    // ======================================

    const selector =
        document.createElement("div");

    selector.className =
        "selector-hora";


    // ======================================
    // HORAS
    // ======================================

    let opcionesHoras = "";

    for (let hora = 1; hora <= 12; hora++) {

        const seleccionada =
            hora === hora12
                ? "selected"
                : "";

        opcionesHoras += `
            <option
                value="${hora}"
                ${seleccionada}
            >
                ${String(hora).padStart(2, "0")}
            </option>
        `;

    }


    // ======================================
    // MINUTOS
    // ======================================

    let opcionesMinutos = "";

    for (let minuto = 0; minuto < 60; minuto++) {

        const seleccionada =
            minuto === minutoActual
                ? "selected"
                : "";

        opcionesMinutos += `
            <option
                value="${minuto}"
                ${seleccionada}
            >
                ${String(minuto).padStart(2, "0")}
            </option>
        `;

    }


    // ======================================
    // CONTENIDO
    // ======================================

    selector.innerHTML = `

        <div class="selector-hora-contenido">

            <h3>Seleccionar hora</h3>

            <div class="selector-hora-campos">

                <select class="selector-horas">
                    ${opcionesHoras}
                </select>

                <span>:</span>

                <select class="selector-minutos">
                    ${opcionesMinutos}
                </select>

                <select class="selector-periodo">

                    <option
                        value="AM"
                        ${periodo === "AM" ? "selected" : ""}
                    >
                        AM
                    </option>

                    <option
                        value="PM"
                        ${periodo === "PM" ? "selected" : ""}
                    >
                        PM
                    </option>

                </select>

            </div>

            <div class="selector-hora-botones">

                <button
                    type="button"
                    class="cancelar-hora"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    class="aceptar-hora"
                >
                    Aceptar
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(selector);


    // ======================================
    // ACEPTAR
    // ======================================

    selector
        .querySelector(".aceptar-hora")
        .addEventListener(
            "click",
            function () {

                const horaSeleccionada =
                    Number(
                        selector.querySelector(
                            ".selector-horas"
                        ).value
                    );

                const minutoSeleccionado =
                    Number(
                        selector.querySelector(
                            ".selector-minutos"
                        ).value
                    );

                const periodoSeleccionado =
                    selector.querySelector(
                        ".selector-periodo"
                    ).value;


                // Convertir 12 h a 24 h

                let horaFinal =
                    horaSeleccionada;


                if (
                    periodoSeleccionado === "AM"
                ) {

                    if (horaFinal === 12) {

                        horaFinal = 0;

                    }

                } else {

                    if (horaFinal !== 12) {

                        horaFinal += 12;

                    }

                }


                // Guardar como HH:MM

                campo.value =
                    `${String(horaFinal).padStart(2, "0")}:${String(minutoSeleccionado).padStart(2, "0")}`;


                guardarDatos();

                calcularHoras();

                selector.remove();

            }
        );


    // ======================================
    // CANCELAR
    // ======================================

    selector
        .querySelector(".cancelar-hora")
        .addEventListener(
            "click",
            function () {

                selector.remove();

            }
        );

}


// ==========================================
// CREAR LOS DÍAS DEL MES
// ==========================================

function crearDias() {

    tablaDias.innerHTML = "";

    const mesActual =
        Number(mes.value);

    const anioActual =
        Number(anio.value);

    const numeroDias =
        new Date(
            anioActual,
            mesActual + 1,
            0
        ).getDate();

    const datosGuardados =
        cargarDatos();


    // ======================================
    // CREAR FILAS
    // ======================================

    for (
        let dia = 1;
        dia <= numeroDias;
        dia++
    ) {

        const fechaDia =
            new Date(
                anioActual,
                mesActual,
                dia
            );

        const nombreDia =
            diasSemana[
                fechaDia.getDay()
            ];

        const datos =
            datosGuardados[dia] || {};

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${dia}
            </td>

            <td>
                ${nombreDia}
            </td>

            <td>

                <input
                    type="text"
                    class="entrada"
                    data-dia="${dia}"
                    value="${mostrarhora(datos.entrada || "")}"
                    placeholder="HH:MM"
                    readonly
                >

            </td>

            <td>

                <input
                    type="text"
                    class="salida"
                    data-dia="${dia}"
                    value="${mostrarhora(datos.salida || "")}"
                    placeholder="HH:MM"
                    readonly
                >

            </td>

            <td
                class="horas"
                data-dia="${dia}"
            >
                00:00
            </td>

            <td>

                <button
                    type="button"
                    class="borrar-dia"
                    data-dia="${dia}"
                >
                    🗑️
                </button>

            </td>

        `;

        tablaDias.appendChild(fila);

    }


    // ======================================
    // EVENTOS DE HORA
    // ======================================

    const campos =
        document.querySelectorAll(
            ".entrada, .salida"
        );

    campos.forEach(campo => {

        campo.addEventListener(
            "click",
            function () {

                abrirSelectorHora(campo);

            }
        );

    });


    // ======================================
    // BORRAR DÍA
    // ======================================

    const botones =
        document.querySelectorAll(
            ".borrar-dia"
        );

    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            function () {

                const dia =
                    boton.dataset.dia;

                const confirmar =
                    confirm(
                        `¿Quieres borrar los datos del día ${dia}?`
                    );

                if (!confirmar) {

                    return;

                }

                borrarDia(dia);

            }
        );

    });


    calcularHoras();

}


// ==========================================
// CALCULAR HORAS
// ==========================================

function calcularHoras() {

    let total = 0;
    let diasTrabajados = 0;

    const entradas =
        document.querySelectorAll(".entrada");


    entradas.forEach (entrada => {

    const dia =
            entrada.dataset.dia;

        const salida =
            document.querySelector(
                `.salida[data-dia="${dia}"]`
            );

        const resultado =
            document.querySelector(
                `.horas[data-dia="${dia}"]`
            );


        if (
            !entrada.value &&
            !salida.value
        ) {

            resultado.textContent =
                "00:00";

            return;

        }


        if (!entrada.value) {

            resultado.textContent =
                "⚠️ Falta entrada"; 
            
            resultado.style.color = "red";
            resultado.style.fontWeigth = "bold";

            return;

        }


        if (!salida.value) {

            resultado.textContent =
                "⚠️ Falta salida";

            resultado.style.color = "red";
            resultado.style.fontWeigth = "bold";


    
            return;

        }
    let entradaTexto =
    entrada.value.trim();

    let salidaTexto =
    salida.value.trim();


// Convertir entrada a 24 horas si está en formato AM/PM

if (
    entradaTexto.includes("AM") ||
    entradaTexto.includes("PM")
) {

    const partes =
        entradaTexto.split(" ");

    const horaMinuto =
        partes[0].split(":");

    let hora =
        Number(horaMinuto[0]);

    const minuto =
        Number(horaMinuto[1]);

    const periodo =
        partes[1];

    if (periodo === "AM") {

        if (hora === 12) {
            hora = 0;
        }

    } else {

        if (hora !== 12) {
            hora += 12;
        }

    }

    entradaTexto =
        String(hora).padStart(2, "0") +
        ":" +
        String(minuto).padStart(2, "0");

}


if (
    salidaTexto.includes("AM") ||
    salidaTexto.includes("PM")
) {
    const partes =
        salidaTexto.split(" ");

    const horaMinuto =
        partes[0].split(":");

    let hora =
        Number(horaMinuto[0]);

    const minuto =
        Number(horaMinuto[1]);

    const periodo =
        partes[1];

    if (periodo === "AM") {

        if (hora === 12) {
            hora = 0;
        }

    } else {

        if (hora !== 12) {
            hora += 12;
        }

    }

    salidaTexto =
        String(hora).padStart(2, "0") +
        ":" +
        String(minuto).padStart(2, "0");
}

        
        // Turno nocturno

        if (
            salidaMinutos < entradaMinutos
        ) {

            salidaMinutos +=
                24 * 60;

        }


        const trabajadas =
            salidaMinutos -
            entradaMinutos;


        if (trabajadas === 0) {

            resultado.textContent =
                "⚠️ Horario no válido";
            
            resultado.style.color = "red";
            resultado.style.fontWeigth = "bold";

        
            return;

        }
        
        resultado.style.color = "";
        resultado.style.fontWeigth = "";


        resultado.textContent =
            horaTexto(trabajadas);


        total += trabajadas;

        diasTrabajados++; 

    });


    totalHoras.textContent =
        horaTexto(total);
    
    document.getElementById(
    "diasRegistrados"
).textContent =
    diasTrabajados;

document.getElementById(
    "resumenTotalHoras"
).textContent =
    horaTexto(total);

let promedio = 0;

if (diasTrabajados > 0) {

    promedio =
        Math.floor(total / diasTrabajados);

}

document.getElementById(
    "promedioHoras"
).textContent =
    horaTexto(promedio);   

    

}


// ==========================================
// CAMBIAR MES
// ==========================================

mes.addEventListener(
    "change",
    crearDias
);

// ==========================================
// CAMBIAR AÑO
// ==========================================

anio.addEventListener(
    "change",
    crearDias
);


// ==========================================
// BORRAR MES
// ==========================================

borrarMes.addEventListener(
    "click",
    borrarTodoElMes
);


// ==========================================
// INICIAR
// ==========================================

crearDias();

// ==========================================
// NAVEGACIÓN DE LA APP
// ==========================================

const botonJornada =
    document.querySelectorAll(".nav-item")[0];

const botonResumen =
    document.querySelectorAll(".nav-item")[1];

const botonAjustes =
    document.querySelectorAll(".nav-item")[2];

const pantallaJornada =
    document.querySelector(".contenido");

const pantallaResumen =
    document.getElementById("pantallaResumen");

const pantallaAjustes =
    document.getElementById("pantallaAjustes");


// ==========================================
// BOTÓN JORNADA
// ==========================================

botonJornada.addEventListener(
    "click",
    function () {

        pantallaJornada.style.display = "block";

        pantallaResumen.style.display = "none";

        pantallaAjustes.style.display = "none";

        botonJornada.classList.add("activo");

        botonResumen.classList.remove("activo");

        botonAjustes.classList.remove("activo");

    }
);


// ==========================================
// BOTÓN RESUMEN
// ==========================================

botonResumen.addEventListener(
    "click",
    function () {

        pantallaJornada.style.display = "none";

        pantallaResumen.style.display = "block";

        pantallaAjustes.style.display = "none";

        botonJornada.classList.remove("activo");

        botonResumen.classList.add("activo");

        botonAjustes.classList.remove("activo");

    }
);


// ==========================================
// BOTÓN AJUSTES
// ==========================================

botonAjustes.addEventListener(
    "click",
    function () {

        pantallaJornada.style.display = "none";

        pantallaResumen.style.display = "none";

        pantallaAjustes.style.display = "block";

        botonJornada.classList.remove("activo");

        botonResumen.classList.remove("activo");

        botonAjustes.classList.add("activo");

    }
);
// ==========================================
// MODO OSCURO
// ==========================================

const botonModoOscuro =
    document.getElementById("modoOscuro");


// CARGAR PREFERENCIA GUARDADA

const modoOscuroGuardado =
    localStorage.getItem("modoOscuro");

if (modoOscuroGuardado === "activado") {

    document.body.classList.add(
        "modo-oscuro"
    );

    botonModoOscuro.classList.add(
        "activo"
    );

}


// CAMBIAR MODO OSCURO

botonModoOscuro.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "modo-oscuro"
        );

        botonModoOscuro.classList.toggle(
            "activo"
        );


        if (
            document.body.classList.contains(
                "modo-oscuro"
            )
        ) {

            localStorage.setItem(
                "modoOscuro",
                "activado"
            );

        } else {

            localStorage.setItem(
                "modoOscuro",
                "desactivado"
            );

        }

    }
);

// ==========================================
// FORMATO DE HORA
// ==========================================

const botonFormatoHora =
    document.getElementById("formatoHora");

const descripcionFormatoHora =
    document.getElementById("descripcionFormatoHora");

// Cargar formato guardado

let formatoHora =
    localStorage.getItem("formatoHora") || "12";

// Mostrar formato actual

function actualizarBotonFormato() {

    if (formatoHora === "12") {

        botonFormatoHora.textContent = "12 h";

        descripcionFormatoHora.textContent =
            "Usar formato de 12 horas";

    } else {

        botonFormatoHora.textContent = "24 h";

        descripcionFormatoHora.textContent =
            "Usar formato de 24 horas";

    }

}

actualizarBotonFormato();

// Cambiar formato

botonFormatoHora.addEventListener(
    "click",
    function () {

        if (formatoHora === "12") {

            formatoHora = "24";

        } else {

            formatoHora = "12";

        }

        localStorage.setItem(
            "formatoHora",
            formatoHora
        );

        actualizarBotonFormato();

    }
);