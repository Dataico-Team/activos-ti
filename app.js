const equipos = [
    {
        codigo: "LAPTOP-DA-RE-12",
        origen: "Rentado",
        marca: "Lenovo",
        modelo: "ThinkPad T14",
        serial: "ABC123456",
        estado: "Disponible",
        asignadoA: "",
        observaciones: ""
    },
    {
        codigo: "MAC-PRO",
        origen: "Corporativo",
        marca: "Apple",
        modelo: "MacBook Pro 14",
        serial: "XYZ987654",
        estado: "Asignado",
        asignadoA: "Ana López",
        observaciones: ""
    }
];
let colaboradores = [
    {
        id: 1,
        nombre: "Laura Gómez",
        correo: "laura.gomez@dataico.com",
        area: "Tecnología",
        cargo: "Analista TI",
        estado: "Activo",
        observaciones: "Portátil principal del área administrativa"
    },
    {
        id: 2,
        nombre: "Juan Pérez",
        correo: "juan.perez@dataico.com",
        area: "Operaciones",
        cargo: "Coordinador",
        estado: "Activo",
        observaciones: "Usuario frecuente de periféricos"
    }
];



const movimientos = [
    { fecha: "2026-04-08", accion: "ASIGNACION", equipo: "MAC-PRO" },
    { fecha: "2026-04-07", accion: "CREACION", equipo: "LAPTOP-DA-RE-12" }
];

const asignaciones = [
    { colaborador: "Ana López", equipo: "MAC-PRO", perifericos: "Monitor, Bolso" }
];

const menuItems = document.querySelectorAll(".menu-item");
const views = document.querySelectorAll(".view");
const viewTitle = document.getElementById("viewTitle");
const viewSubtitle = document.getElementById("viewSubtitle");

const subtitles = {
    dashboard: "Control de equipos, colaboradores y asignaciones",
    equipos: "Creación y consulta de equipos",
    asignaciones: "Asignar equipos disponibles a colaboradores",
    colaboradores: "Gestión y búsqueda de colaboradores"
};

menuItems.forEach(btn => {
    btn.addEventListener("click", () => {
        menuItems.forEach(x => x.classList.remove("active"));
        btn.classList.add("active");

        const target = btn.dataset.view;
        views.forEach(v => v.classList.remove("active"));
        document.getElementById(`${target}View`).classList.add("active");

        viewTitle.textContent = btn.textContent;
        viewSubtitle.textContent = subtitles[target];
    });
});

const origen = document.getElementById("origen");
const numeroRentado = document.getElementById("numeroRentado");
const nombreBase = document.getElementById("nombreBase");
const codigoGenerado = document.getElementById("codigoGenerado");
const rentadoFields = document.getElementById("rentadoFields");
const corporativoFields = document.getElementById("corporativoFields");

function normalizarCodigo(texto) {
    return texto.trim().toUpperCase().replace(/\s+/g, "-");
}

function actualizarCodigo() {
    if (origen.value === "Rentado") {
        rentadoFields.classList.remove("hidden");
        corporativoFields.classList.add("hidden");
        const numero = numeroRentado.value ? numeroRentado.value.trim() : "";
        codigoGenerado.value = numero ? `LAPTOP-DA-RE-${numero}` : "LAPTOP-DA-RE-";
    } else if (origen.value === "Corporativo") {
        corporativoFields.classList.remove("hidden");
        rentadoFields.classList.add("hidden");
        codigoGenerado.value = normalizarCodigo(nombreBase.value || "");
    } else {
        rentadoFields.classList.add("hidden");
        corporativoFields.classList.add("hidden");
        codigoGenerado.value = "";
    }
}

origen.addEventListener("change", actualizarCodigo);
numeroRentado.addEventListener("input", actualizarCodigo);
nombreBase.addEventListener("input", actualizarCodigo);

const equipoForm = document.getElementById("equipoForm");
equipoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigo = codigoGenerado.value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const serial = document.getElementById("serial").value.trim();
    const estado = document.getElementById("estado").value;
    const observaciones = document.getElementById("observaciones").value.trim();

    if (!codigo) {
        alert("Debes generar un código válido.");
        return;
    }

    const existe = equipos.some(eq => eq.codigo === codigo);
    if (existe) {
        alert("Ese código ya existe.");
        return;
    }

    equipos.unshift({
        codigo,
        origen: origen.value,
        marca,
        modelo,
        serial,
        estado,
        observaciones
    });

    movimientos.unshift({
        fecha: new Date().toISOString().slice(0, 10),
        accion: "CREACION",
        equipo: codigo
    });

    equipoForm.reset();
    codigoGenerado.value = "";
    actualizarCodigo();
    const equipoModal = document.getElementById("equipoModal");
    if (equipoModal) equipoModal.classList.add("hidden");
    renderAll();
});

const asignacionForm = document.getElementById("asignacionForm");
asignacionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const colaborador = document.getElementById("colaborador").value.trim();
    const equipoCodigo = document.getElementById("equipoAsignar").value;
    const checks = [...document.querySelectorAll('.checks input[type="checkbox"]:checked')];
    const perifericos = checks.map(c => c.value).join(", ");
    const observacion = document.getElementById("observacionAsignacion").value.trim();

    if (!colaborador || !equipoCodigo) {
        alert("Debes seleccionar colaborador y equipo.");
        return;
    }

    asignaciones.unshift({
        colaborador,
        equipo: equipoCodigo,
        perifericos
    });

    const equipo = equipos.find(eq => eq.codigo === equipoCodigo);
    if (equipo) {
        equipo.estado = "Asignado";
        equipo.asignadoA = colaborador;
    }

    movimientos.unshift({
        fecha: new Date().toISOString().slice(0, 10),
        accion: "ASIGNACION",
        equipo: equipoCodigo
    });

    asignacionForm.reset();
    const asignacionModal = document.getElementById("asignacionModal");
    if (asignacionModal) asignacionModal.classList.add("hidden");
    renderAll();
});

function renderEquiposTable() {
    const tbody = document.getElementById("equiposTable");
    const input = document.getElementById("busquedaEquipoInput");
    if (!tbody) return;

    let docs = equipos;
    if (input) {
        const term = input.value.toLowerCase().trim();
        if (term) {
            docs = equipos.filter(eq => 
                eq.codigo.toLowerCase().includes(term) || eq.marca.toLowerCase().includes(term)
            );
        }
    }

    tbody.innerHTML = docs.map(eq => `
    <tr>
      <td>${eq.codigo}</td>
      <td>${eq.origen}</td>
      <td>${eq.marca}</td>
      <td>${eq.modelo}</td>
      <td>${eq.estado}</td>
      <td>${eq.asignadoA || "-"}</td>
    </tr>
  `).join("");
}

const busquedaEquipoInput = document.getElementById("busquedaEquipoInput");
if (busquedaEquipoInput) {
    busquedaEquipoInput.addEventListener("input", renderEquiposTable);
}

function renderEquiposRecent() {
    const tbody = document.getElementById("equiposRecentTable");
    tbody.innerHTML = equipos.slice(0, 5).map(eq => `
    <tr>
      <td>${eq.codigo}</td>
      <td>${eq.marca}</td>
      <td>${eq.modelo}</td>
      <td>${eq.estado}</td>
      <td>${eq.asignadoA || "-"}</td>
    </tr>
  `).join("");
}

function renderMovimientos() {
    const tbody = document.getElementById("movimientosTable");
    tbody.innerHTML = movimientos.slice(0, 5).map(m => `
    <tr>
      <td>${m.fecha}</td>
      <td>${m.accion}</td>
      <td>${m.equipo}</td>
    </tr>
  `).join("");
}

function renderAsignaciones() {
    const tbody = document.getElementById("asignacionesTable");
    const input = document.getElementById("busquedaAsignacionInput");
    if (!tbody) return;

    let docs = asignaciones;
    if (input) {
        const term = input.value.toLowerCase().trim();
        if (term) {
            docs = asignaciones.filter(a => 
                a.colaborador.toLowerCase().includes(term) || a.equipo.toLowerCase().includes(term)
            );
        }
    }

    tbody.innerHTML = docs.map(a => `
    <tr>
      <td>${a.colaborador}</td>
      <td>${a.equipo}</td>
      <td>${a.perifericos || "-"}</td>
    </tr>
  `).join("");
}

const busquedaAsignacionInput = document.getElementById("busquedaAsignacionInput");
if (busquedaAsignacionInput) {
    busquedaAsignacionInput.addEventListener("input", renderAsignaciones);
}

function renderEquipoSelect() {
    const select = document.getElementById("equipoAsignar");
    const disponibles = equipos.filter(eq => eq.estado === "Disponible");

    select.innerHTML = `<option value="">Selecciona un equipo</option>` +
        disponibles.map(eq => `
      <option value="${eq.codigo}">
        ${eq.codigo} | ${eq.marca} | ${eq.modelo}
      </option>
    `).join("");
}

function renderStats() {
    document.getElementById("totalEquipos").textContent = equipos.length;
    document.getElementById("totalDisponibles").textContent =
        equipos.filter(eq => eq.estado === "Disponible").length;
    document.getElementById("totalAsignados").textContent =
        equipos.filter(eq => eq.estado === "Asignado").length;
    document.getElementById("totalRentados").textContent =
        equipos.filter(eq => eq.origen === "Rentado").length;
}

function renderColaboradoresDatalist() {
    const datalist = document.getElementById("datalistColaboradores");
    if (datalist) {
        datalist.innerHTML = colaboradores.map(c => `<option value="${c.nombre}"></option>`).join("");
    }
}

function renderEquiposDatalists() {
    const listMarcas = document.getElementById("datalistMarcas");
    const listModelos = document.getElementById("datalistModelos");

    if (listMarcas) {
        const marcasUnicas = [...new Set(equipos.map(eq => eq.marca).filter(Boolean))];
        listMarcas.innerHTML = marcasUnicas.map(m => `<option value="${m}"></option>`).join("");
    }

    if (listModelos) {
        const modelosUnicos = [...new Set(equipos.map(eq => eq.modelo).filter(Boolean))];
        listModelos.innerHTML = modelosUnicos.map(m => `<option value="${m}"></option>`).join("");
    }
}

function renderAll() {
    renderStats();
    renderEquiposTable();
    renderEquiposRecent();
    renderMovimientos();
    renderAsignaciones();
    renderEquipoSelect();
    renderColaboradores();
    renderColaboradoresDatalist();
    renderEquiposDatalists();
}

function renderColaboradores() {
    const tbody = document.getElementById("colaboradoresTableBody");
    const input = document.getElementById("busquedaColaboradorInput");
    if (!tbody || !input) return;

    const term = input.value.toLowerCase().trim();
    
    let docs = colaboradores;
    if (term) {
        docs = colaboradores.filter(col => col.nombre.toLowerCase().includes(term));
    }
    
    tbody.innerHTML = docs.map(col => `
    <tr class="clickable-row" style="cursor: pointer;" onclick="mostrarDetalleColaborador('${col.nombre.replace(/'/g, "\\'")}')">
      <td>${col.nombre}</td>
      <td>${col.correo}</td>
      <td>${col.area} / ${col.cargo}</td>
      <td>${col.estado}</td>
    </tr>
  `).join("");
}

const busquedaInput = document.getElementById("busquedaColaboradorInput");
if (busquedaInput) {
    busquedaInput.addEventListener("input", renderColaboradores);
}

const colaboradorModal = document.getElementById("colaboradorModal");
const btnOpenColaboradorModal = document.getElementById("btnOpenColaboradorModal");
const btnCloseColaboradorModal = document.getElementById("btnCloseColaboradorModal");

if (btnOpenColaboradorModal && colaboradorModal) {
    btnOpenColaboradorModal.addEventListener("click", () => {
        colaboradorModal.classList.remove("hidden");
    });
}

if (btnCloseColaboradorModal && colaboradorModal) {
    btnCloseColaboradorModal.addEventListener("click", () => {
        colaboradorModal.classList.add("hidden");
    });
}

if (colaboradorModal) {
    colaboradorModal.addEventListener("click", (e) => {
        if (e.target === colaboradorModal) {
            colaboradorModal.classList.add("hidden");
        }
    });
}

const colaboradorForm = document.getElementById("colaboradorForm");
if (colaboradorForm) {
    colaboradorForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("colNome").value.trim();
        const correo = document.getElementById("colCorreo").value.trim();
        const area = document.getElementById("colArea").value.trim();
        const cargo = document.getElementById("colCargo").value.trim();
        const estado = document.getElementById("colEstado").value;
        const observaciones = document.getElementById("colObservaciones").value.trim();

        const maxId = colaboradores.length > 0 ? Math.max(...colaboradores.map(c => c.id)) : 0;

        colaboradores.unshift({
            id: maxId + 1,
            nombre,
            correo,
            area,
            cargo,
            estado,
            observaciones
        });

        colaboradorForm.reset();
        if (colaboradorModal) {
            colaboradorModal.classList.add("hidden");
        }
        renderColaboradores();
    });
}

function mostrarDetalleColaborador(nombre) {
    const col = colaboradores.find(c => c.nombre === nombre);
    if (!col) return;

    document.getElementById("detalleColaboradorNombre").textContent = col.nombre;
    document.getElementById("detalleColaboradorCorreo").textContent = col.correo;
    document.getElementById("detalleColaboradorAreaCargo").textContent = col.area + " / " + col.cargo;
    document.getElementById("detalleColaboradorEstado").textContent = col.estado;
    document.getElementById("detalleColaboradorObs").textContent = col.observaciones || "Ninguna";

    const listas = asignaciones.filter(a => a.colaborador === nombre);
    const container = document.getElementById("detalleColaboradorEquipos");

    if (listas.length === 0) {
        container.innerHTML = "<p style='color: #6b7280; font-size: 14px;'>No tiene equipos ni periféricos asignados al momento.</p>";
    } else {
        container.innerHTML = listas.map(asig => {
            const eq = equipos.find(e => e.codigo === asig.equipo);
            const equipoData = eq 
                ? `<strong>Marca:</strong> ${eq.marca} | <strong>Modelo:</strong> ${eq.modelo} | <strong>Serial:</strong> ${eq.serial}` 
                : `<span style="color:#ef4444">Equipo no encontrado</span>`;
            
            return `
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                <p style="margin: 0 0 5px;"><strong>Equipo (Código):</strong> ${asig.equipo}</p>
                <p style="margin: 0 0 5px; font-size: 13px; color: #4b5563;">${equipoData}</p>
                <p style="margin: 0; font-size: 13px; color: #4b5563;"><strong>Periféricos:</strong> ${asig.perifericos || "Ninguno"}</p>
            </div>
            `;
        }).join("");
    }

    document.getElementById("detalleColaboradorModal").classList.remove("hidden");
}

const modals = [
    { modalId: "equipoModal", openId: "btnOpenEquipoModal", closeId: "btnCloseEquipoModal" },
    { modalId: "asignacionModal", openId: "btnOpenAsignacionModal", closeId: "btnCloseAsignacionModal" },
    { modalId: "detalleColaboradorModal", openId: null, closeId: "btnCloseDetalleColaboradorModal" }
];

modals.forEach(({ modalId, openId, closeId }) => {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openId);
    const closeBtn = document.getElementById(closeId);
    
    if (modal && openBtn) {
        openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    }
    if (modal && closeBtn) {
        closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.add("hidden");
        });
    }
});

renderAll();