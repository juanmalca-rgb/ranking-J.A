```javascript
/* =====================================================
   SOCIALPREMIOS
   SISTEMA DEMO LOCAL
===================================================== */


/* =========================
   DATOS INICIALES
========================= */

function getData(key, fallback) {

    const data = localStorage.getItem(key);

    if (!data) {
        return fallback;
    }

    try {
        return JSON.parse(data);
    } catch {
        return fallback;
    }
}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =========================
   USUARIOS
========================= */

let users = getData("sp_users", [

    {
        id: 1,
        name: "Administrador",
        username: "admin",
        password: "admin123",
        points: 0,
        role: "admin"
    }

]);


/* =========================
   CAMPAÑAS
========================= */

let campaigns = getData("sp_campaigns", [

    {
        id: 1,
        name: "Primera campaña TikTok",
        social: "TikTok",
        description:
            "Publica un contenido relacionado con entretenimiento.",
        points: 50,
        active: true
    },

    {
        id: 2,
        name: "Campaña Instagram",
        social: "Instagram",
        description:
            "Comparte una publicación relacionada con tecnología.",
        points: 75,
        active: true
    }

]);


/* =========================
   PUBLICACIONES
========================= */

let submissions = getData(
    "sp_submissions",
    []
);


/* =========================
   CANJES
========================= */

let redemptions = getData(
    "sp_redemptions",
    []
);


/* =========================
   SESIÓN
========================= */

let currentUser =
    JSON.parse(
        localStorage.getItem("sp_currentUser")
    );


/* =========================
   REGISTRO
========================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const username =
                document
                    .getElementById("registerUser")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            const exists =
                users.some(
                    user =>
                        user.username.toLowerCase() ===
                        username.toLowerCase()
                );


            if (exists) {

                message.textContent =
                    "❌ Ese usuario ya existe.";

                return;

            }


            const newUser = {

                id: Date.now(),

                name: name,

                username: username,

                password: password,

                points: 0,

                role: "user"

            };


            users.push(newUser);

            saveData("sp_users", users);


            message.textContent =
                "✅ Cuenta creada correctamente.";


            setTimeout(
                () => {
                    window.location.href =
                        "index.html";
                },
                1000
            );

        }
    );

}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("loginUser")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const user =
                users.find(
                    u =>
                        u.username === username &&
                        u.password === password
                );


            if (!user) {

                message.textContent =
                    "❌ Usuario o contraseña incorrectos.";

                return;

            }


            currentUser = user;


            localStorage.setItem(
                "sp_currentUser",
                JSON.stringify(user)
            );


            if (user.role === "admin") {

                window.location.href =
                    "admin.html";

            } else {

                window.location.href =
                    "dashboard.html";

            }

        }
    );

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "sp_currentUser"
    );

    window.location.href =
        "index.html";

}


/* =========================
   COMPROBAR USUARIO
========================= */

function requireUser() {

    if (!currentUser) {

        window.location.href =
            "index.html";

        return false;

    }

    return true;

}


/* =========================
   DASHBOARD
========================= */

if (
    document.getElementById("userName")
) {

    if (!requireUser()) {

        // No continuar

    } else {

        loadDashboard();

    }

}


/* =========================
   CARGAR DASHBOARD
========================= */

function loadDashboard() {

    refreshCurrentUser();


    document.getElementById(
        "userName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "userPoints"
    ).textContent =
        currentUser.points;


    document.getElementById(
        "campaignCount"
    ).textContent =
        campaigns.filter(
            c => c.active
        ).length;


    loadRanking();

    loadCampaigns();

    loadRewards();

    loadRequests();

    updatePosition();

}


/* =========================
   ACTUALIZAR USUARIO
========================= */

function refreshCurrentUser() {

    users =
        getData(
            "sp_users",
            []
        );


    currentUser =
        users.find(
            u => u.id === currentUser.id
        );


    localStorage.setItem(
        "sp_currentUser",
        JSON.stringify(currentUser)
    );

}


/* =========================
   RANKING
========================= */

function loadRanking() {

    const container =
        document.getElementById(
            "ranking"
        );


    if (!container) return;


    const sorted =
        [...users]
            .filter(
                u => u.role !== "admin"
            )
            .sort(
                (a,b) =>
                    b.points - a.points
            );


    container.innerHTML = "";


    sorted.forEach(
        (user,index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "ranking-row";


            row.innerHTML = `

                <span class="rank-number">
                    #${index + 1}
                </span>

                <strong>
                    ${escapeHTML(user.name)}
                </strong>

                <span>
                    ⭐ ${user.points}
                </span>

            `;


            container.appendChild(row);

        }
    );

}


/* =========================
   POSICIÓN
========================= */

function updatePosition() {

    const sorted =
        [...users]
            .filter(
                u => u.role !== "admin"
            )
            .sort(
                (a,b) =>
                    b.points - a.points
            );


    const position =
        sorted.findIndex(
            u =>
                u.id === currentUser.id
        ) + 1;


    const element =
        document.getElementById(
            "userPosition"
        );


    if (element) {

        element.textContent =
            position > 0
                ? "#" + position
                : "-";

    }

}


/* =========================
   CAMPAÑAS
========================= */

function loadCampaigns() {

    const container =
        document.getElementById(
            "campaigns"
        );


    if (!container) return;


    container.innerHTML = "";


    const active =
        campaigns.filter(
            c => c.active
        );


    if (!active.length) {

        container.innerHTML =
            "<p>No hay campañas disponibles.</p>";

        return;

    }


    active.forEach(
        campaign => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "campaign";


            div.innerHTML = `

                <h3>
                    ${escapeHTML(campaign.name)}
                </h3>

                <span class="badge">
                    ${escapeHTML(campaign.social)}
                </span>

                <span class="badge">
                    ⭐ ${campaign.points} puntos
                </span>

                <p>
                    ${escapeHTML(campaign.description)}
                </p>

                <input
                    id="submission-${campaign.id}"
                    type="url"
                    placeholder="Pega aquí el enlace de tu publicación"
                >

                <button
                    class="action-btn"
                    onclick="submitCampaign(${campaign.id})"
                >
                    📤 Enviar publicación
                </button>

            `;


            container.appendChild(div);

        }
    );

}


/* =========================
   ENVIAR PUBLICACIÓN
========================= */

function submitCampaign(campaignId) {

    const input =
        document.getElementById(
            "submission-" + campaignId
        );


    const link =
        input.value.trim();


    if (!link) {

        alert(
            "Coloca el enlace de tu publicación."
        );

        return;

    }


    if (!/^https?:\/\//i.test(link)) {

        alert(
            "Introduce un enlace válido."
        );

        return;

    }


    const campaign =
        campaigns.find(
            c =>
                c.id === campaignId
        );


    submissions.push({

        id: Date.now(),

        userId: currentUser.id,

        username: currentUser.username,

        campaignId: campaign.id,

        campaignName: campaign.name,

        social: campaign.social,

        link: link,

        points: campaign.points,

        status: "pending",

        date:
            new Date().toLocaleString()

    });


    saveData(
        "sp_submissions",
        submissions
    );


    alert(
        "✅ Publicación enviada.\n\n" +
        "Queda pendiente de revisión."
    );


    input.value = "";

}


/* =========================
   PREMIOS
========================= */

const rewards = [

    {
        id: 1,
        name: "20 seguidores",
        description:
            "Solicitud de recompensa gestionada por el administrador.",
        cost: 100,
        icon: "👥"
    },

    {
        id: 2,
        name: "Perfil destacado",
        description:
            "Tu perfil puede aparecer en la sección destacada.",
        cost: 150,
        icon: "⭐"
    },

    {
        id: 3,
        name: "Publicación destacada",
        description:
            "Tu publicación puede participar en una campaña destacada.",
        cost: 200,
        icon: "🚀"
    },

    {
        id: 4,
        name: "Premio especial",
        description:
            "Recompensa especial administrada por la plataforma.",
        cost: 500,
        icon: "🏆"
    }

];


function loadRewards() {

    const container =
        document.getElementById(
            "rewards"
        );


    if (!container) return;


    container.innerHTML = "";


    rewards.forEach(
        reward => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "reward";


            div.innerHTML = `

                <div class="reward-icon">
                    ${reward.icon}
                </div>

                <h3>
                    ${reward.name}
                </h3>

                <p>
                    ${reward.description}
                </p>

                <div class="cost">
                    ⭐ ${reward.cost} puntos
                </div>

                <button
                    class="action-btn"
                    onclick="redeemReward(${reward.id})"
                >
                    Canjear
                </button>

            `;


            container.appendChild(div);

        }
    );

}


/* =========================
   CANJEAR
========================= */

function redeemReward(rewardId) {

    refreshCurrentUser();


    const reward =
        rewards.find(
            r => r.id === rewardId
        );


    if (
        currentUser.points <
        reward.cost
    ) {

        alert(
            "❌ No tienes suficientes puntos."
        );

        return;

    }


    const alreadyPending =
        redemptions.some(
            r =>
                r.userId === currentUser.id &&
                r.rewardId === reward.id &&
                r.status === "pending"
        );


    if (alreadyPending) {

        alert(
            "Ya tienes una solicitud pendiente para este premio."
        );

        return;

    }


    currentUser.points -=
        reward.cost;


    const index =
        users.findIndex(
            u =>
                u.id === currentUser.id
        );


    users[index] =
        currentUser;


    saveData(
        "sp_users",
        users
    );


    redemptions.push({

        id: Date.now(),

        userId:
            currentUser.id,

        username:
            currentUser.username,

        rewardId:
            reward.id,

        reward:
            reward.name,

        cost:
            reward.cost,

        status:
            "pending",

        date:
            new Date().toLocaleString()

    });


    saveData(
        "sp_redemptions",
        redemptions
    );


    alert(
        "🎁 Solicitud enviada.\n\n" +
        "Premio: " +
        reward.name +
        "\n\n" +
        "El administrador revisará tu solicitud."
    );


    loadDashboard();

}


/* =========================
   SOLICITUDES DEL USUARIO
========================= */

function loadRequests() {

    const container =
        document.getElementById(
            "myRequests"
        );


    if (!container) return;


    const requests =
        redemptions.filter(
            r =>
                r.userId ===
                currentUser.id
        );


    container.innerHTML = "";


    if (!requests.length) {

        container.innerHTML =
            "<p>No tienes solicitudes todavía.</p>";

        return;

    }


    requests
        .slice()
        .reverse()
        .forEach(
            request => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "admin-item";


                div.innerHTML = `

                    <strong>
                        ${escapeHTML(request.reward)}
                    </strong>

                    <p>
                        ⭐ ${request.cost} puntos
                    </p>

                    <p>
                        Fecha:
                        ${request.date}
                    </p>

                    <p>
                        Estado:
                        ${statusText(request.status)}
                    </p>

                `;


                container.appendChild(div);

            }
        );

}


/* =====================================================
   ADMINISTRADOR
===================================================== */

if (
    document.getElementById(
        "adminUsers"
    )
) {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        alert(
            "Acceso restringido."
        );

        window.location.href =
            "index.html";

    } else {

        loadAdmin();

    }

}


/* =========================
   ADMIN DASHBOARD
========================= */

function loadAdmin() {

    users =
        getData(
            "sp_users",
            []
        );


    campaigns =
        getData(
            "sp_campaigns",
            []
        );


    submissions =
        getData(
            "sp_submissions",
            []
        );


    redemptions =
        getData(
            "sp_redemptions",
            []
        );


    document.getElementById(
        "adminUsers"
    ).textContent =
        users.filter(
            u => u.role !== "admin"
        ).length;


    document.getElementById(
        "adminCampaigns"
    ).textContent =
        campaigns.length;


    document.getElementById(
        "adminSubmissions"
    ).textContent =
        submissions.filter(
            s => s.status === "pending"
        ).length;


    loadAdminCampaigns();

    loadSubmissions();

    loadRedemptions();

    loadUsers();

}


/* =========================
   CREAR CAMPAÑA
========================= */

const campaignForm =
    document.getElementById(
        "campaignForm"
    );


if (campaignForm) {

    campaignForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const campaign = {

                id: Date.now(),

                name:
                    document
                        .getElementById(
                            "campaignName"
                        )
                        .value,

                social:
                    document
                        .getElementById(
                            "campaignSocial"
                        )
                        .value,

                description:
                    document
                        .getElementById(
                            "campaignDescription"
                        )
                        .value,

                points:
                    Number(
                        document
                            .getElementById(
                                "campaignPoints"
                            )
                            .value
                    ),

                active: true

            };


            campaigns.push(
                campaign
            );


            saveData(
                "sp_campaigns",
                campaigns
            );


            alert(
                "✅ Campaña creada."
            );


            campaignForm.reset();


            loadAdmin();

        }
    );

}


/* =========================
   ADMIN CAMPAÑAS
========================= */

function loadAdminCampaigns() {

    const container =
        document.getElementById(
            "adminCampaignList"
        );


    if (!container) return;


    container.innerHTML = "";


    campaigns.forEach(
        campaign => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-item";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(campaign.name)}
                </strong>

                <p>
                    Red:
                    ${escapeHTML(campaign.social)}
                </p>

                <p>
                    ⭐ ${campaign.points} puntos
                </p>

                <p>
                    ${escapeHTML(campaign.description)}
                </p>

                <p>
                    Estado:
                    ${
                        campaign.active
                        ? "🟢 Activa"
                        : "🔴 Inactiva"
                    }
                </p>

                <div class="admin-actions">

                    <button
                        class="warning-btn"
                        onclick="toggleCampaign(${campaign.id})"
                    >
                        Activar/desactivar
                    </button>

                    <button
                        class="danger-btn"
                        onclick="deleteCampaign(${campaign.id})"
                    >
                        Eliminar
                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );

}


/* =========================
   ACTIVAR CAMPAÑA
========================= */

function toggleCampaign(id) {

    const campaign =
        campaigns.find(
            c => c.id === id
        );


    if (!campaign) return;


    campaign.active =
        !campaign.active;


    saveData(
        "sp_campaigns",
        campaigns
    );


    loadAdmin();

}


/* =========================
   ELIMINAR CAMPAÑA
========================= */

function deleteCampaign(id) {

    if (
        !confirm(
            "¿Eliminar esta campaña?"
        )
    ) {

        return;

    }


    campaigns =
        campaigns.filter(
            c => c.id !== id
        );


    saveData(
        "sp_campaigns",
        campaigns
    );


    loadAdmin();

}


/* =========================
   PUBLICACIONES ADMIN
========================= */

function loadSubmissions() {

    const container =
        document.getElementById(
            "submissions"
        );


    if (!container) return;


    const pending =
        submissions.filter(
            s =>
                s.status ===
                "pending"
        );


    container.innerHTML = "";


    if (!pending.length) {

        container.innerHTML =
            "<p>🎉 No hay publicaciones pendientes.</p>";

        return;

    }


    pending.forEach(
        submission => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-item";


            div.innerHTML = `

                <strong>
                    👤 ${escapeHTML(submission.username)}
                </strong>

                <p>
                    Campaña:
                    ${escapeHTML(submission.campaignName)}
                </p>

                <p>
                    Red:
                    ${escapeHTML(submission.social)}
                </p>

                <p>
                    ⭐ Recompensa:
                    ${submission.points} puntos
                </p>

                <p>
                    🔗
                    <a
                        href="${escapeAttribute(submission.link)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="color:#9f7cff"
                    >
                        Ver publicación
                    </a>
                </p>

                <p>
                    📅 ${submission.date}
                </p>

                <div class="admin-actions">

                    <button
                        class="action-btn"
                        onclick="approveSubmission(${submission.id})"
                    >
                        ✅ Aprobar
                    </button>

                    <button
                        class="danger-btn"
                        onclick="rejectSubmission(${submission.id})"
                    >
                        ❌ Rechazar
                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );

}


/* =========================
   APROBAR PUBLICACIÓN
========================= */

function approveSubmission(id) {

    const submission =
        submissions.find(
            s => s.id === id
        );


    if (!submission) return;


    if (
        submission.status !==
        "pending"
    ) return;


    const user =
        users.find(
            u =>
                u.id ===
                submission.userId
        );


    if (!user) {

        alert(
            "Usuario no encontrado."
        );

        return;

    }


    user.points +=
        submission.points;


    submission.status =
        "approved";


    saveData(
        "sp_users",
        users
    );


    saveData(
        "sp_submissions",
        submissions
    );


    alert(
        "✅ Publicación aprobada.\n\n" +
        "+" +
        submission.points +
        " puntos para " +
        user.username
    );


    loadAdmin();

}


/* =========================
   RECHAZAR PUBLICACIÓN
========================= */

function rejectSubmission(id) {

    const submission =
        submissions.find(
            s => s.id === id
        );


    if (!submission) return;


    submission.status =
        "rejected";


    saveData(
        "sp_submissions",
        submissions
    );


    alert(
        "❌ Publicación rechazada."
    );


    loadAdmin();

}


/* =========================
   CANJES ADMIN
========================= */

function loadRedemptions() {

    const container =
        document.getElementById(
            "redemptions"
        );


    if (!container) return;


    container.innerHTML = "";


    if (!redemptions.length) {

        container.innerHTML =
            "<p>No hay solicitudes.</p>";

        return;

    }


    redemptions
        .slice()
        .reverse()
        .forEach(
            request => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "admin-item";


                div.innerHTML = `

                    <strong>
                        👤 ${escapeHTML(request.username)}
                    </strong>

                    <p>
                        🎁 ${escapeHTML(request.reward)}
                    </p>

                    <p>
                        ⭐ ${request.cost} puntos
                    </p>

                    <p>
                        📅 ${request.date}
                    </p>

                    <p>
                        Estado:
                        ${statusText(request.status)}
                    </p>

                    ${
                        request.status === "pending"

                        ?

                        `

                        <div class="admin-actions">

                            <button
                                class="action-btn"
                                onclick="approveRedemption(${request.id})"
                            >
                                ✅ Aprobar
                            </button>

                            <button
                                class="danger-btn"
                                onclick="rejectRedemption(${request.id})"
                            >
                                ❌ Rechazar
                            </button>

                        </div>

                        `

                        : ""

                    }

                `;


                container.appendChild(div);

            }
        );

}


/* =========================
   APROBAR CANJE
========================= */

function approveRedemption(id) {

    const request =
        redemptions.find(
            r => r.id === id
        );


    if (!request) return;


    request.status =
        "approved";


    saveData(
        "sp_redemptions",
        redemptions
    );


    alert(
        "🎁 Canje aprobado."
    );


    loadAdmin();

}


/* =========================
   RECHAZAR CANJE
========================= */

function rejectRedemption(id) {

    const request =
        redemptions.find(
            r => r.id === id
        );


    if (!request) return;


    const user =
        users.find(
            u =>
                u.id === request.userId
        );


    /*
       Si se rechaza, devolvemos
       los puntos al usuario.
    */

    if (
        request.status ===
        "pending"
    ) {

        if (user) {

            user.points +=
                request.cost;

        }

    }


    request.status =
        "rejected";


    saveData(
        "sp_users",
        users
    );


    saveData(
        "sp_redemptions",
        redemptions
    );


    alert(
        "❌ Canje rechazado.\n\n" +
        "Los puntos fueron devueltos."
    );


    loadAdmin();

}


/* =========================
   USUARIOS ADMIN
========================= */

function loadUsers() {

    const container =
        document.getElementById(
            "users"
        );


    if (!container) return;


    container.innerHTML = "";


    users
        .filter(
            u => u.role !== "admin"
        )
        .forEach(
            user => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "admin-item";


                div.innerHTML = `

                    <strong>
                        👤 ${escapeHTML(user.name)}
                    </strong>

                    <p>
                        @${escapeHTML(user.username)}
                    </p>

                    <p>
                        ⭐ ${user.points} puntos
                    </p>

                `;


                container.appendChild(div);

            }
        );

}


/* =========================
   ESTADOS
========================= */

function statusText(status) {

    if (status === "pending")
        return "🟡 Pendiente";

    if (status === "approved")
        return "🟢 Aprobado";

    if (status === "rejected")
        return "🔴 Rechazado";

    return status;

}


/* =========================
   SEGURIDAD BÁSICA VISUAL
========================= */

function escapeHTML(text) {

    return String(text)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


function escapeAttribute(text) {

    return String(text)

        .replaceAll("&", "&amp;")

        .replaceAll('"', "&quot;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;");

}
```
