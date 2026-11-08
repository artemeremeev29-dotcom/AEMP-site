
const pages = [
    { id: "home", title: "Главная", url: "index.html", icon: "⌂" },
    { id: "downloads", title: "Загрузки", url: "downloads.html", icon: "↓" },
    { id: "old", title: "Старые версии", url: "old.html", icon: "◷" },
    { id: "skins", title: "Скины", url: "skins.html", icon: "◈" },
    { id: "news", title: "Новости", url: "news.html", icon: "▤" },
    { id: "about", title: "О проекте", url: "about.html", icon: "ⓘ" }
];

const content = document.getElementById("page-content");
const currentPage = content.dataset.page;

const navigation = pages.map(page => `
    <a class="nav-link ${page.id === currentPage ? "active" : ""}"
       href="${page.url}" target="_blank" rel="noopener">
       ${page.icon} ${page.title}
    </a>
`).join("");

const layout = document.createElement("div");
layout.className = "layout";

layout.innerHTML = `
    <aside class="sidebar">
        <div class="logo">AEMP</div>
        <div class="logo-subtitle">Enjoy the sound</div>

        <div class="nav-title">Навигация</div>
        <nav class="nav-links">${navigation}</nav>
    </aside>

    <div class="main-container"></div>

    <aside class="rightbar">
        <h3>Рекомендации</h3>

        <div class="recommendation">
            <strong>AEMP PRO</strong>
            Попробуйте расширенную версию плеера.
        </div>

        <div class="recommendation">
            <strong>Скины</strong>
            Настройте внешний вид своего плеера.
        </div>

        <div class="recommendation">
            <strong>Новости</strong>
            Следите за обновлениями проекта.
        </div>
    </aside>
`;

document.body.appendChild(layout);
layout.querySelector(".main-container").appendChild(content);
