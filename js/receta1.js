//funcion para alternar visivilidad
function toggleSection(button, targetId) {
    const target = document.getElementById(targetId);
    const isHidden = target.hasAttribute("hidden");

    if (isHidden) {
        target.removeAttribute("hidden");
        button.setAttribute("aria-expanded", "true");
    } else {
        target.setAttribute("hidden", "");
        button.setAttribute("aria-expanded", "false");
    }
}

//ingredientes
const btnIngredientes = document.querySelector("#ingredientes .toggle-btn");
btnIngredientes.addEventListener("click", () => {
    toggleSection(btnIngredientes, "lista-ingredientes");
});

//pasos
const btnPasos = document.querySelector("#pasos .toggle-btn");
btnPasos.addEventListener("click", () => {
    toggleSection(btnPasos, "lista-pasos");
});

//errores en cada paso
document.querySelectorAll(".paso").forEach(paso => {
    const btnError = paso.querySelector(".error-btn");
    const mensajeError = paso.querySelector(".mensaje-error");
    const textoError = paso.dataset.error;

    btnError.addEventListener("click", () => {
        if (mensajeError.hasAttribute("hidden")) {
            mensajeError.textContent = textoError;
            mensajeError.removeAttribute("hidden");
        } else {
            mensajeError.setAttribute("hidden", "");
        }
    });
});
