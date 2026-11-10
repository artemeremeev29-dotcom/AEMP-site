
/* ========================================
   AEMP WEBSITE — NAVIGATION SYSTEM
   Windows + Android
======================================== */

const platforms = [
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
    }
];

const pages = [
    { id: "home", title: "Главная", url: "index.html" },
    { id: "project", title: "О проекте", url: "about.html" },
    { id: "license", title: "Лицензионное соглашение", url: "license.html" }
];

const content = document.getElementById("page-content");

if (!content) {
    console.error("AEMP: элемент #page-content не найден!");
} else {
    const currentPage = content.dataset.page || "home";

    const createLink = page => `
        <a
            class="nav-link ${page.id === currentPage ? "active" : ""}"
            href="${page.url}"
            ${page.id === currentPage ? 'aria-current="page"' : ""}
        >
            ${page.title}
        </a>
    `;

    const navigation = `
        ${pages.slice(0, 1).map(createLink).join("")}

        ${platforms.map(platform => `
            <div class="nav-section">
                <div class="nav-title">${platform.title}</div>
                ${platform.links.map(createLink).join("")}
            </div>
        `).join("")}

        <div class="nav-section">
            <div class="nav-title">Информация</div>
            ${pages.slice(1).map(createLink).join("")}
        </div>
    `;

    const layout = document.createElement("div");
    layout.className = "layout";

    layout.innerHTML = `
        <aside class="sidebar">

            <div class="site-logo">
                <div class="logo-text">AEMP</div>
                <div class="logo-subtitle">Enjoy the sound.</div>
            </div>

            <nav class="nav-links">
                ${navigation}
            </nav>

            <div class="sidebar-footer">
                <span>AEMP © 2026</span>
            </div>

        </aside>

        <div class="main-container"></div>

        <aside class="rightbar">
            <h3>Платформы AEMP</h3>

            <a class="recommendation" href="windows-downloads.html">
                <strong>AEMP Windows</strong>
                <p>Версия 1.5.0 Stable</p>
            </a>

            <a class="recommendation" href="downloads.html">
                <strong>AEMP Android</strong>
                <p>Мобильная версия плеера</p>
            </a>

            <h3>Новости</h3>

            <a class="recommendation" href="windows-news.html">
                <strong>Windows</strong>
                <p>Новости настольной версии</p>
            </a>

            <a class="recommendation" href="news.html">
                <strong>Android</strong>
                <p>Новости мобильной версии</p>
            </a>
        </aside>
    `;

    const mainContainer = layout.querySelector(".main-container");
    mainContainer.appendChild(content);

    document.body.appendChild(layout);

    console.log("AEMP: Windows + Android navigation loaded!");
}
