particlesJS("particles-js", {
    particles: {
      number: {
        value: 100, // Número de partículas
        density: {
          enable: true,
          value_area: 800
        }
      },
      shape: {
        type: "circle", // Usamos círculos como las partículas
        stroke: {
          width: 0,
          color: "#ffffff"
        }
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.3,
          sync: false
        }
      },
      size: {
        value: 15, // Tamaño de las partículas
        random: true,
        anim: {
          enable: true,
          speed: 10,
          size_min: 0.5,
          sync: false
        }
      },
      color: {
        value: "#8A2BE2" // Color morado para las partículas
      },
      move: {
        enable: true,
        speed: 2, // Velocidad de movimiento
        direction: "none", // Movimiento aleatorio
        random: true, // Movimiento aleatorio
        straight: false,
        out_mode: "out",
        bounce: false
      },
      line_linked: {
        enable: true, // Activar las líneas entre las partículas
        distance: 150, // Distancia máxima para conectar las partículas
        color: "#000000", // Color de las líneas (negro)
        opacity: 0.5, // Opacidad de las líneas
        width: 1 // Grosor de las líneas
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 1
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });
  
  

  




// Función para generar un UUID (identificador único)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Obtener el UUID del usuario o crear uno nuevo si no existe
let userUUID = localStorage.getItem('userUUID');
if (!userUUID) {
    userUUID = generateUUID();
    localStorage.setItem('userUUID', userUUID);
}

// Variables principales
const savingsList = document.getElementById("savings-list");
const progressBarInner = document.getElementById("progress-bar-inner");
const showMoreBtn = document.getElementById("show-more-btn");
const resetBtn = document.getElementById("reset-btn");
const goalAmount = 3000000;
const minDeposit = 10000;
const maxDeposit = 80000;

// Variables para el modal
const editModal = document.getElementById("editModal");
const editAmountInput = document.getElementById("editAmount");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
let editingIndex = -1;

// Función para generar montos aleatorios que sumen el objetivo
function generateDeposits(goal, min, max) {
    let total = 0;
    const deposits = [];
    while (total < goal) {
        const remaining = goal - total;
        const deposit = Math.min(remaining, Math.floor(Math.random() * (max - min + 1)) + min);
        deposits.push(deposit);
        total += deposit;
    }
    return deposits;
}

// Recuperar depósitos y estado guardado en localStorage, utilizando el UUID
let deposits = JSON.parse(localStorage.getItem(`deposits-${userUUID}`)) || generateDeposits(goalAmount, minDeposit, maxDeposit);
let completedIndexes = JSON.parse(localStorage.getItem(`completedIndexes-${userUUID}`)) || [];

// Guardar depósitos en localStorage si no existen
if (!localStorage.getItem(`deposits-${userUUID}`)) {
    localStorage.setItem(`deposits-${userUUID}`, JSON.stringify(deposits));
}

// Variables para manejo de la visualización
let currentIndex = 0;

// Función para cargar los depósitos
function loadSavings() {
    const toShow = deposits.slice(0, currentIndex + 5);
    savingsList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
    toShow.forEach((amount, index) => {
        const savingItem = document.createElement("div");
        savingItem.classList.add("saving-item");
        savingItem.innerHTML = `
            <span style="color: white;">Depósito ${index + 1}: $${amount.toLocaleString()}</span>
            <div>
                <i class="fas fa-dollar-sign icon-btn deposit" data-step="${index}"></i>
                <i class="fas fa-trash icon-btn delete" data-step="${index}"></i>
                <i class="fas fa-edit icon-btn edit" data-step="${index}"></i>
            </div>
        `;

        // Marcar como completado si está en completedIndexes
        if (completedIndexes.includes(index)) {
            savingItem.classList.add("completed");
        }

        savingsList.appendChild(savingItem);
    });

    // Mostrar el botón "Ver más" si hay más elementos para cargar
    showMoreBtn.style.display = currentIndex + 5 >= deposits.length ? 'none' : 'block';

    updateProgressBar(); // Actualizar barra de progreso después de cargar
}

// Función para mostrar más depósitos
function showMore() {
    currentIndex += 5;
    loadSavings();
}

// Obtener el modal de confirmación y los botones
const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

let selectedItemForDeletion = null; // Cambié el nombre de la variable para evitar conflicto

// Manejo de los íconos
savingsList.addEventListener("click", (e) => {
    const stepIndex = parseInt(e.target.getAttribute('data-step'), 10);
    const savingItem = e.target.closest('.saving-item');

    if (e.target.classList.contains("deposit") && !savingItem.classList.contains("completed")) {
        savingItem.classList.add("completed");
        completedIndexes.push(stepIndex);
        localStorage.setItem(`completedIndexes-${userUUID}`, JSON.stringify(completedIndexes));
        updateProgressBar();

        // Mensaje de ánimo
        const encouragementMessages = [
            "¡Excelente! Sigue así, estás en el buen camino.",
            "¡Gran trabajo! Cada paso cuenta.",
            "¡Sigue avanzando! Ya casi llegas.",
            "¡Eso es! Cada esfuerzo suma.",
            "¡Increíble! Lo estás logrando."
        ];

        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

        const messageElement = document.getElementById('encouragement-message');
        messageElement.textContent = randomMessage;
        messageElement.style.display = 'block';

        // Ocultar el mensaje después de 10 segundos
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000); // 10 segundos
    } else if (e.target.classList.contains("delete")) {
        selectedItemForDeletion = savingItem; // Guardamos el ítem que vamos a eliminar
        deleteConfirmationModal.style.display = 'flex'; // Mostramos el modal de confirmación
    } else if (e.target.classList.contains("edit")) {
        // Mostrar el modal con el monto actual
        editingIndex = stepIndex;
        editAmountInput.value = deposits[stepIndex]; // Rellenar el input con el monto actual
        editModal.style.display = "flex"; // Mostrar el modal
    }
});

// Confirmar la eliminación
confirmDeleteBtn.addEventListener("click", () => {
    if (selectedItemForDeletion) {
        savingsList.removeChild(selectedItemForDeletion); // Eliminar el ítem de la lista
        updateProgressBar();
    }
    deleteConfirmationModal.style.display = 'none'; // Ocultar el modal de confirmación
});

// Cancelar la eliminación
cancelDeleteBtn.addEventListener("click", () => {
    deleteConfirmationModal.style.display = 'none'; // Solo cerrar el modal sin eliminar
});

// Guardar el nuevo monto cuando se presiona "Guardar"
saveBtn.addEventListener("click", () => {
    const newAmount = parseFloat(editAmountInput.value);
    if (newAmount && newAmount > 0) {
        deposits[editingIndex] = newAmount;
        const savingItem = savingsList.children[editingIndex];
        savingItem.querySelector("span").textContent = `Depósito ${editingIndex + 1}: $${newAmount.toLocaleString()}`;
        localStorage.setItem(`deposits-${userUUID}`, JSON.stringify(deposits)); // Actualizar depósitos en localStorage
    }
    editModal.style.display = "none"; // Cerrar el modal
});

// Cancelar la edición
cancelBtn.addEventListener("click", () => {
    editModal.style.display = "none"; // Cerrar el modal sin guardar
});

// Función para actualizar barra de progreso
function updateProgressBar() {
    const progressPercentage = (completedIndexes.length / deposits.length) * 100;
    progressBarInner.style.width = `${progressPercentage}%`;
}

// Función para reiniciar todo
function resetSavings() {
    completedIndexes = [];
    deposits = generateDeposits(goalAmount, minDeposit, maxDeposit);
    currentIndex = 0;
    localStorage.setItem(`completedIndexes-${userUUID}`, JSON.stringify(completedIndexes));
    localStorage.setItem(`deposits-${userUUID}`, JSON.stringify(deposits));
    loadSavings();
}

// Cargar los primeros 5 elementos al inicio
loadSavings();

// Añadir eventos a los botones
showMoreBtn.addEventListener('click', showMore);
resetBtn.addEventListener('click', resetSavings);

// Detectar cuando se llega al final de la página BOTON DE REINICIAR
window.addEventListener('scroll', function() {
    const resetButton = document.getElementById('reset-btn');
    
    // Verificar si el usuario ha llegado al final de la página
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
        resetButton.style.animation = 'slideInRight 1s forwards'; // Aparecer con animación
        resetButton.style.opacity = 1; // Asegurarse que esté visible
    } else {
        resetButton.style.animation = 'none'; // Eliminar la animación si no está al final
        resetButton.style.opacity = 0; // Mantenerlo invisible
    }
});




// Función para aplicar color blanco a los íconos solo en pantallas grandes (escritorio)
function setIconColor() {
    // Verificamos si la pantalla es de escritorio
    if (window.innerWidth >= 1024) {  // Escritorio
        const depositIcons = document.querySelectorAll('.deposit');
        const deleteIcons = document.querySelectorAll('.delete');
        const editIcons = document.querySelectorAll('.edit');

        // Cambiar el color de los íconos a blanco
        depositIcons.forEach(icon => icon.style.color = 'white');
        deleteIcons.forEach(icon => icon.style.color = 'white');
        editIcons.forEach(icon => icon.style.color = 'white');
    }
}

// Llamamos a la función para aplicar el color blanco al cargar la página
setIconColor();

// Detectar cuando el tamaño de la ventana cambie
window.addEventListener('resize', setIconColor);







