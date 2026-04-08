// Usamos la conexión ya creada en index.html
const supabase = window.supabaseClient;

// 1. DEFINIR LOGOUT ANTES QUE CUALQUIER OTRA COSA
async function logout() {
    console.log("Logout iniciado...");
    try {
        if (supabase) await supabase.auth.signOut();
    } catch (e) {
        console.error(e);
    } finally {
        localStorage.clear();
        sessionStorage.clear();
        alert("Sesión cerrada. Redirigiendo...");
        window.location.href = 'login.html';
    }
}
window.logout = logout;
window.handleLogout = logout;

// 2. PROTECCIÓN DE RUTAS
window.addEventListener('DOMContentLoaded', async () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!supabase) return;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session && !isLoginPage) {
            window.location.href = 'login.html';
            return;
        }

        if (session && !isLoginPage) {
            const userEmailElem = document.getElementById('userEmailDisplay');
            if (userEmailElem) userEmailElem.textContent = session.user.email;
        }
    } catch (err) {
        console.warn("Falla en sesión:", err);
        if (!isLoginPage) window.location.href = 'login.html';
    }
});
