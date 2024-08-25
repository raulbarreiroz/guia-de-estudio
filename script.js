const filePath = "./preguntas.json";
async function readFile(filePath) {
  let response = await fetch(filePath);
  let parsedData = await response.json();
  return parsedData;
}

function shuffleArray(array) {
  // Iterate from the end of the array to the beginning
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const cantidadDePrguntas = 20;

async function getPreguntas(filtro = 1) {
  data = await readFile(filePath);
  let preguntas = undefined;
  if (filtro == 1) {
    preguntas = shuffleArray(data).slice(0, cantidadDePrguntas);
  } else if (filtro == 2) {
    console.log("filtro 2");
  }
  return preguntas;
}

let respuestaCorrecta = "";

function agregarPregunta(container, pregunta) {
  const checkBoxes = [];
  let respuestaCorrectaDiv;
  const divsList = pregunta["respuestas"]?.map((respuesta, i) => {
    const p = document.createElement("p");
    p.textContent = respuesta["nombre"];
    const input = document.createElement("input");
    input.type = "checkbox";
    input.style.marginRight = "0.6rem";
    input.id = `checkbox-${i}`;
    input.checked = false;
    checkBoxes.push(input);
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "left";
    div.style.alignItems = "center";
    div.style.borderRadius = "0.5rem";
    div.style.cursor = "pointer";
    div.id = `div-${i}`;

    div.onmouseover = (e) => {
      if (over) {
        div.style.backgroundColor = "#add8e6";
      }
    };
    div.onmouseout = (e) => {
      if (over) {
        div.style.backgroundColor = "white";
      }
    };
    div.append(input);
    div.append(p);
    if (respuesta["correcta"]) {
      respuestaCorrecta = respuesta["nombre"];
    }

    return div;
  });

  const divPrincipal = document.createElement("div");
  divPrincipal.style.margin = 0;
  divPrincipal.style.padding = 0;
  divPrincipal.id = "div-actual";

  const h3 = document.createElement("h3");
  h3.textContent = pregunta["titulo"];
  divPrincipal.append(h3);

  divsList?.forEach((div, i) => {
    const input = div.childNodes[0];
    const p = div.childNodes[1];
    div.addEventListener("click", (e) => {
      if (div?.id === `div-${i}`) {
        input.checked = !input?.checked;
      }
      divsList
        .filter((d) => d.id !== `div-${i}`)
        ?.forEach((d) => {
          const i = d?.childNodes[0];
          i.checked = false;
        });

      if (input?.checked) {
        respuestaSeleccionada = i;
      } else {
        respuestaSeleccionada = -1;
      }

      const errorText = document.querySelector("#error-text");
      const btnVerificar = document.querySelector("#button-verificar");
      if (divsList.filter((d) => d?.childNodes[0]?.checked).length) {
        console.log("mostrar texto");
        errorText.style.visibility = "hidden";
        btnVerificar.disabled = false;
        btnVerificar.style.backgroundColor = "#007bff";
        btnVerificar.style.cursor = "pointer";

        btnSiguiente.disabled = false;
      btnSiguiente.style.backgroundColor = "#007bff";
      btnSiguiente.style.cursor = "pointer";

      } else {
        console.log("no mostrar texto");
        errorText.style.visibility = "visible";
        btnVerificar.disabled = true;
        btnVerificar.style.backgroundColor = "#d3d3d3";
        btnVerificar.style.cursor = "default";

        btnSiguiente.disabled = true;
        btnSiguiente.style.backgroundColor = "#d3d3d3";
        btnSiguiente.style.cursor = "default";
      
      }
    });
    input.addEventListener("change", (e) => {
      input.checked = !input.checked;
    });
    divPrincipal.style.margin = 0;
    divPrincipal.appendChild(div);
  });

  const respuestaCorrectaText = document.createElement("p");
  respuestaCorrectaText.textContent = "Respuesta correcta";
  respuestaCorrectaText.style.textAlign = "center";
  respuestaCorrectaText.style.display = "none";
  respuestaCorrectaText.id = "respuestaCorrectaText";
  const respuestaIncorrectaText = document.createElement("p");
  respuestaIncorrectaText.textContent =
    "Respuesta incorrecta, la opción correcta es: ";
  respuestaIncorrectaText.style.textAlign = "center";
  respuestaIncorrectaText.style.display = "none";
  respuestaIncorrectaText.id = "respuestaIncorrectaText";
  divPrincipal.append(respuestaCorrectaText);
  divPrincipal.append(respuestaIncorrectaText);
  divPrincipal.append(respuestaCorrectaText);
  divPrincipal.append(respuestaIncorrectaText);
  respuestaComprobar = document.createElement("p");
  respuestaComprobar.textContent = "La repsuesta correcta es:";
  respuestaComprobar.style.textAlign = "center";
  respuestaComprobar.style.display = "none";
  respuestaComprobar.id = "respuestaComprobar";
  divPrincipal.append(respuestaComprobar);
  const respuestaCorrectaSolucion = document.createElement("p");
  respuestaCorrectaSolucion.textContent = respuestaCorrecta;
  respuestaCorrectaSolucion.style.textAlign = "center";
  respuestaCorrectaSolucion.style.display = "none";
  respuestaCorrectaSolucion.id = "respuestaCorrectaSolucion";
  divPrincipal.append(respuestaCorrectaSolucion);
  container.append(divPrincipal);
}

let preguntas = [];
let indicePreguntaActual = 0;
let respuestaSeleccionada = -1;
let over = true;

window.addEventListener("DOMContentLoaded", (event) => {
  const btnIniciar = document.querySelector("#button-iniciar");
  const homeContainer = document.querySelector("#home-container");
  const simuladorContainer = document.querySelector("#simulador-container");

  if (btnIniciar) {
    btnIniciar.addEventListener("click", async () => {
      btnIniciar.classList.remove("hidden");
      preguntas = await getPreguntas();
      simuladorContainer.classList.remove("hidden");
      homeContainer.classList.add("hidden");
      agregarPregunta(simuladorContainer, preguntas[indicePreguntaActual]);
    });
  }
});

const btnAnterior = document.querySelector("#button-anterior");
const btnSiguiente = document.querySelector("#button-siguiente");
const btnVerificar = document.querySelector("#button-verificar");
const btnComprobar = document.querySelector("#button-comprobar");
const contadorContainer = document.querySelector("#contador-container");

if (btnAnterior) {
  if (indicePreguntaActual === 0) {
    btnAnterior.disabled = true;
    btnAnterior.style.backgroundColor = "#d3d3d3";
    btnAnterior.style.cursor = "default";
  }
  btnAnterior.addEventListener("click", (e) => {
    if (indicePreguntaActual > 0) {
      indicePreguntaActual--;
      contadorContainer.textContent = `${
        indicePreguntaActual + 1
      } de ${cantidadDePrguntas} preeguntas`;
      btnSiguiente.disabled = false;
      btnSiguiente.style.backgroundColor = "#007bff";
      btnSiguiente.style.cursor = "pointer";
      const simuladorContainer = document.querySelector("#simulador-container");
      const divActual = document.querySelector("#div-actual");
      simuladorContainer?.removeChild(divActual);
      agregarPregunta(simuladorContainer, preguntas[indicePreguntaActual]);
    }

    if (indicePreguntaActual === 0) {
      btnAnterior.disabled = true;
      btnAnterior.style.backgroundColor = "#d3d3d3";
      btnAnterior.style.cursor = "default";
    }
  });
}

if (btnSiguiente) {
  if (indicePreguntaActual === 0) {
    btnSiguiente.disabled = true;
    btnSiguiente.style.backgroundColor = "#d3d3d3";
    btnSiguiente.style.cursor = "default";
  }
  btnSiguiente.addEventListener("click", (e) => {
    if (indicePreguntaActual <= cantidadDePrguntas) {
      indicePreguntaActual++;
      contadorContainer.textContent = `${
        indicePreguntaActual + 1
      } de ${cantidadDePrguntas} preeguntas`;

      if (indicePreguntaActual === cantidadDePrguntas) {
        const homeContainer = document.querySelector("#home-container");
        const simuladorContainer = document.querySelector(
          "#simulador-container"
        );

        simuladorContainer.classList.add("hidden");
        homeContainer.classList.remove("hidden");
      } else {
        btnAnterior.disabled = false;
        btnAnterior.style.backgroundColor = "#007bff";
        btnAnterior.style.cursor = "pointer";
        const simuladorContainer = document.querySelector(
          "#simulador-container"
        );
        const divActual = document.querySelector("#div-actual");
        simuladorContainer?.removeChild(divActual);
        agregarPregunta(simuladorContainer, preguntas[indicePreguntaActual]);

        btnVerificar.disabled = true;
        btnVerificar.style.backgroundColor = "#d3d3d3";
        btnVerificar.style.cursor = "default";

        btnComprobar.disabled = false;
        btnComprobar.style.backgroundColor = "#007bff";
        btnComprobar.style.cursor = "pointer";

        btnSiguiente.disabled = true;
        btnSiguiente.style.backgroundColor = "#d3d3d3";
        btnSiguiente.style.cursor = "default";
      }
    }

    if (indicePreguntaActual === cantidadDePrguntas - 1) {
      btnSiguiente.disabled = true;
      btnSiguiente.style.backgroundColor = "#d3d3d3";
      btnSiguiente.style.cursor = "default";
    }
  });
}

if (btnVerificar) {
  if (indicePreguntaActual === 0) {
    btnVerificar.disabled = true;
    btnVerificar.style.backgroundColor = "#d3d3d3";
    btnVerificar.style.cursor = "default";
  }
  btnVerificar.addEventListener("click", (e) => {
    if (indicePreguntaActual < cantidadDePrguntas) {
      console.log(respuestaSeleccionada);
      console.log(preguntas[indicePreguntaActual]);
      if (
        preguntas[indicePreguntaActual]["respuestas"][respuestaSeleccionada][
          "correcta"
        ]
      ) {
        const respuestaCorrectaText = document.querySelector(
          "#respuestaCorrectaText"
        );
        respuestaCorrectaText.style.display = "block";
        const divCorrecto = document.querySelector(
          `#div-${respuestaSeleccionada}`
        );
        console.log(divCorrecto);
        divCorrecto.style.backgroundColor = "#90EE90";
      } else {
        const respuestaIncorrectaText = document.querySelector(
          "#respuestaIncorrectaText"
        );
        respuestaIncorrectaText.style.display = "block";
        const divInorrecto = document.querySelector(
          `#div-${respuestaSeleccionada}`
        );
        divInorrecto.style.backgroundColor = "#FF5733";
        const respuestaCorrectaSolucion = document.querySelector(
          "#respuestaCorrectaSolucion"
        );
        respuestaCorrectaSolucion.style.display = "block";
      }

      over = false;

      btnSiguiente.disabled = false;
      btnSiguiente.style.backgroundColor = "#007bff";
      btnSiguiente.style.cursor = "pointer";

      btnComprobar.disabled = true;
      btnComprobar.style.backgroundColor = "#d3d3d3";
      btnComprobar.style.cursor = "default";

      btnVerificar.disabled = true;
      btnVerificar.style.backgroundColor = "#d3d3d3";
      btnVerificar.style.cursor = "default";
    }

    if (indicePreguntaActual === cantidadDePrguntas - 1) {
      btnSiguiente.disabled = true;
      btnSiguiente.style.backgroundColor = "#d3d3d3";
      btnSiguiente.style.cursor = "default";
    }
  });
}

if (btnComprobar) {
  btnComprobar.addEventListener("click", (e) => {
    const respuestaComprobar = document.querySelector("#respuestaComprobar");
    respuestaComprobar.style.display = "block";
    const respuestaCorrectaSolucion = document.querySelector(
      "#respuestaCorrectaSolucion"
    );
    respuestaCorrectaSolucion.style.display = "block";

    btnSiguiente.disabled = false;
    btnSiguiente.style.backgroundColor = "#007bff";
    btnSiguiente.style.cursor = "pointer";

    btnComprobar.disabled = true;
    btnComprobar.style.backgroundColor = "#d3d3d3";
    btnComprobar.style.cursor = "default";

    btnVerificar.disabled = true;
        btnVerificar.style.backgroundColor = "#d3d3d3";
        btnVerificar.style.cursor = "default";
  });
}

if (contadorContainer) {
  contadorContainer.textContent = `${
    indicePreguntaActual + 1
  } de ${cantidadDePrguntas} preeguntas`;
}
