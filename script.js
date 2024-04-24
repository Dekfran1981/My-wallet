document.addEventListener("DOMContentLoaded", function() {
    const saldoTotalSpan = document.getElementById("saldo-total");
    const saldoDisponibleSpan = document.getElementById("saldo-disponible");
    const agregarFondosInput = document.getElementById("agregar-fondos");
    const agregarFondosBtn = document.getElementById("agregar-fondos-btn");
    const realizarPagoInput = document.getElementById("realizar-pago");
    const realizarPagoBtn = document.getElementById("realizar-pago-btn");
    const listaTransacciones = document.getElementById("lista-transacciones");
    const actualizarSaldosBtn = document.getElementById("actualizar-saldos-btn");
    const resetSaldoDisponibleBtn = document.getElementById("reset-saldo-disponible-btn");
    const resetSaldoTotalBtn = document.getElementById("reset-saldo-total-btn");

    // Recuperar datos del almacenamiento local o establecer valores predeterminados
    let saldoTotal = parseFloat(localStorage.getItem("saldoTotal")) || 0.00;
    let saldoDisponible = parseFloat(localStorage.getItem("saldoDisponible")) || 0.00;
    let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

    // Mostrar saldo inicial
    actualizarSaldo();

    // Agregar fondos
    agregarFondosBtn.addEventListener("click", function() {
        const cantidad = parseFloat(agregarFondosInput.value);
        if (cantidad > 0) {
            saldoTotal += cantidad;
            saldoDisponible += cantidad;
            actualizarSaldo();
            agregarTransaccion(`Recarga de saldo - $${cantidad.toFixed(2)}`);
            // Guardar datos en el almacenamiento local
            guardarDatos();
        } else {
            alert("Ingrese una cantidad válida para agregar fondos.");
        }
    });

    // Realizar pago
    realizarPagoBtn.addEventListener("click", function() {
        const cantidad = parseFloat(realizarPagoInput.value);
        if (cantidad > 0 && cantidad <= saldoDisponible) {
            const detallePago = prompt("Ingrese la descripción del pago:");
            if (detallePago) { // Comprueba si se ingresó una descripción del pago
                const gasto = -cantidad; // Convertir la cantidad a un valor negativo para representar un gasto
                saldoDisponible += gasto; // Restar el gasto al saldo disponible
                actualizarSaldo(); // Actualizar los saldos
                const fechaPago = new Date().toLocaleDateString();
                agregarTransaccion(`${detallePago} - $${cantidad.toFixed(2)} - ${fechaPago}`);
                realizarPagoInput.value = ''; // Limpiar el campo de entrada después de agregar la transacción
                // Guardar datos en el almacenamiento local
                guardarDatos();
            } else {
                alert("Debe ingresar una descripción para el pago.");
            }
        } else {
            alert("No tiene suficiente saldo para realizar este pago.");
        }
    });

    // Reiniciar saldo disponible
    resetSaldoDisponibleBtn.addEventListener("click", function() {
        saldoDisponible = 0;
        actualizarSaldo();
        guardarDatos();
    });

    // Reiniciar saldo total
    resetSaldoTotalBtn.addEventListener("click", function() {
        saldoTotal = 0;
        actualizarSaldo();
        guardarDatos();
    });

    // Función para actualizar el saldo mostrado en la página
    function actualizarSaldo() {
        // Calcular el saldo total sumando todos los montos de las transacciones
        saldoTotal = transacciones.reduce((total, transaccion) => {
            const cantidad = parseFloat(transaccion.split(" - ")[1].replace("$", ""));
            return total + cantidad;
        }, 0);
        saldoTotalSpan.textContent = `$${saldoTotal.toFixed(2)}`;
        saldoDisponibleSpan.textContent = `$${saldoDisponible.toFixed(2)}`;
    }
    // Reiniciar saldo disponible
resetSaldoDisponibleBtn.addEventListener("click", function() {
    saldoDisponible = 0;
    saldoTotal = 0; // Establecer saldo total en cero también
    actualizarSaldo();
    guardarDatos();
});

    // Función para agregar una transacción a la lista
    function agregarTransaccion(transaccion) {
        transacciones.push(transaccion);
        actualizarListaTransacciones();
    }

    // Función para eliminar una transacción de la lista
    function eliminarTransaccion(index) {
        const transaccionEliminada = transacciones[index];
        const cantidad = parseFloat(transaccionEliminada.split(" - ")[1].replace("$", ""));
        if (cantidad < 0) {
            saldoDisponible += Math.abs(cantidad); // Sumar el valor absoluto del gasto al saldo disponible
        }
        transacciones.splice(index, 1);
        actualizarSaldo();
        actualizarListaTransacciones();
    }

    // Función para actualizar la lista de transacciones mostrada en la página
    function actualizarListaTransacciones() {
        listaTransacciones.innerHTML = "";
        transacciones.forEach(function(transaccion, index) {
            const li = document.createElement("li");
            li.textContent = transaccion;

            // Agregar botón de eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "x"; // La "x" en minúscula
            btnEliminar.className = "btn-eliminar"; // Asignar la clase al botón de eliminar
            btnEliminar.addEventListener("click", function() {
                eliminarTransaccion(index);
            });

            // Agregar el botón de eliminar a la transacción
            li.appendChild(btnEliminar);

            // Agregar la transacción a la lista
            listaTransacciones.appendChild(li);
        });
    }

    // Función para guardar datos en el almacenamiento local
    function guardarDatos() {
        localStorage.setItem("saldoTotal", saldoTotal);
        localStorage.setItem("saldoDisponible", saldoDisponible);
        localStorage.setItem("transacciones", JSON.stringify(transacciones));
    }
});
