// ==========================================
// AEMP — PLATFORM NAVIGATION
// Windows + Android
// ==========================================

const content = document.getElementById("page-content");

if (!content) {
    console.error("AEMP: page-content not found");
} else {
    const currentPage = content.dataset.page || "home";

    const sections = [
        {
            title: "Главное",
            links: [
                { id: "home", title: "Главная", url: "index.html" }
            ]
        },
        {
            title: "Для Windows",
            links: [
                { id: "windows-about", title: "О программе", url: "windows-about.html" },
                { id: "windows-downloads", title: "Скачать", url: "windows-downloads.html" },
                { id: "windows-old", title: "Старые версии", url: "windows-old.html" },
                { id: "windows-skins", title: "Скины", url: "windows-skins.html" },
                { id: "windows-news", title: "Новости", url: "windows-news.html" }
            ]
        },
        {
            title: "Для Android",
            links: [
                { id: "about", title: "О программе", url: "about.html" },
                { id: "downloads", title: "Скачать", url: "downloads.html" },
                { id: "old", title: "Старые версии", url: "old.html" },
                { id: "skins", title: "Скины", url: "skins.html" },
                { id: "news", title: "Новости", url: "news.html" }
            ]
        },
        {
            title: "О проекте",
            links: [
                { id: "project", title: "О проекте", url: "project.html" },
                { id: "license", title: "Лицензионное соглашение", url: "license.html" }
            ]
        }
    ];

    const layout = document.createElement("div");
    layout.className = "layout";

    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";

    sidebar.innerHTML = `
        <div class="site-logo">
            <div class="logo-text">AEMP</div>
            <div class="logo-subtitle">Enjoy the sound.</div>
        </div>

        <nav class="nav-links">
            ${sections.map(section => `
                <div class="nav-section">
                    <div class="nav-title">${section.title}</div>

                    ${section.links.map(link => `
                        <a
                            class="nav-link ${link.id === currentPage ? "active" : ""}"
                            href="${link.url}"
                            ${link.id === currentPage ? 'aria-current="page"' : ""}
                        >
                            ${link.title}
                        </a>
                    `).join("")}
                </div>
            `).join("")}
        </nav>

        <div class="sidebar-footer">
            AEMP © 2026
        </div>
    `;

    const mainContainer = document.createElement("div");
    mainContainer.className = "main-container";
    mainContainer.appendChild(content);

    const rightbar = document.createElement("aside");
    rightbar.className = "rightbar";

    rightbar.innerHTML = `
        <h3>Платформы AEMP</h3>

        <a class="recommendation" href="windows-downloads.html">
            <strong>AEMP Windows</strong>
            <p>Версия 1.5.0 Stable</p>
        </a>

        <a class="recommendation" href="downloads.html">
            <strong>AEMP Android</strong>
            <p>Мобильная версия плеера</p>
        </a>

        <h3 style="margin-top: 25px;">Полезное</h3>

        <a class="recommendation" href="news.html">
            <strong>Новости Android</strong>
            <p>Обновления мобильной версии</p>
        </a>

        <a class="recommendation" href="windows-news.html">
            <strong>Новости Windows</strong>
            <p>Обновления Windows-версии</p>
        </a>
    `;

    layout.appendChild(sidebar);
    layout.appendChild(mainContainer);
    layout.appendChild(rightbar);

    document.body.appendChild(layout);

    console.log("AEMP: platform navigation loaded");
}
