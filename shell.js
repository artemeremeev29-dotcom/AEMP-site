// ========================================
// AEMP WEBSITE — NAVIGATION SYSTEM
// ========================================

const currentPage = document.getElementById("page-content")?.dataset.page;

const navigation = [
    {
        title: "Главная",
        url: "index.html",
        id: "home"
    }
];

const platformSections = [
    {
        title: "Для Windows",
        items: [
            { title: "О программе", url: "windows-about.html", id: "windows-about" },
            { title: "Скачать", url: "windows-downloads.html", id: "windows-downloads" },
            { title: "Старые версии", url: "windows-old.html", id: "windows-old" },
            { title: "Скины", url: "windows-skins.html", id: "windows-skins" },
            { title: "Новости", url: "windows-news.html", id: "windows-news" }
        ]
    },
    {
        title: "Для Android",
        items: [
            { title: "О программе", url: "about.html", id: "about" },
            { title: "Скачать", url: "downloads.html", id: "downloads" },
            { title: "Старые версии", url: "old.html", id: "old" },
            { title: "Скины", url: "skins.html", id: "skins" },
            { title: "Новости", url: "news.html", id: "news" }
        ]
    }
];

const content = document.getElementById("page-content");

if (!content) {
    console.error("AEMP: элемент #page-content не найден!");
} else {

    const layout = document.createElement("div");
    layout.className = "layout";

    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";

    const logo = document.createElement("div");
    logo.className = "site-logo";
    logo.innerHTML = `
        <div class="logo-text">AEMP</div>
        <div class="logo-subtitle">Enjoy the sound.</div>
    `;

    const nav = document.createElement("nav");
    nav.className = "nav-links";

    function createLink(item) {
        const link = document.createElement("a");
        link.className = "nav-link";
        link.href = item.url;
        link.textContent = item.title;

        if (item.id === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

        return link;
    }

    navigation.forEach(item => {
        nav.appendChild(createLink(item));
    });

    platformSections.forEach(section => {
        const heading = document.createElement("div");
        heading.className = "nav-title";
        heading.textContent = section.title;
        nav.appendChild(heading);

        section.items.forEach(item => {
            nav.appendChild(createLink(item));
        });
    });

    const sidebarFooter = document.createElement("div");
    sidebarFooter.className = "sidebar-footer";
    sidebarFooter.textContent = "AEMP © 2026";

    sidebar.append(logo, nav, sidebarFooter);

    const mainContainer = document.createElement("div");
    mainContainer.className = "main-container";
    mainContainer.appendChild(content);

    const rightbar = document.createElement("aside");
    rightbar.className = "rightbar";
    rightbar.innerHTML = `
        <h3>Рекомендации</h3>

        <a class="recommendation" href="windows-downloads.html">
            <div>
                <strong>AEMP Windows</strong>
                <p>Музыкальный плеер для Windows</p>
            </div>
        </a>

        <a class="recommendation" href="downloads.html">
            <div>
                <strong>AEMP Android</strong>
                <p>Мобильная версия AEMP PRO</p>
            </div>
        </a>

        <a class="recommendation" href="skins.html">
            <div>
                <strong>Скины Android</strong>
                <p>Измени внешний вид плеера</p>
            </div>
        </a>

        <a class="recommendation" href="windows-skins.html">
            <div>
                <strong>Скины Windows</strong>
                <p>Оформление Windows-версии</p>
            </div>
        </a>
    `;

    layout.append(sidebar, mainContainer, rightbar);
    document.body.appendChild(layout);

    console.log("AEMP: навигация загружена!");
}
