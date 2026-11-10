
// ========================================
// AEMP — NAVIGATION CHECK
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");

    console.log("AEMP Navigation Check");
    console.log("Найдено ссылок:", links.length);

    links.forEach(link => {
        if (!link.getAttribute("href")) {
            console.warn("AEMP: ссылка без адреса", link);
        }
    });

    const currentPage = document
        .getElementById("page-content")
        ?.dataset.page;

    console.log("Текущая страница:", currentPage || "не определена");

    const windowsPages = [
        "windows-about.html",
        "windows-downloads.html",
        "windows-old.html",
        "windows-skins.html",
        "windows-news.html"
    ];

    console.log("Windows-раздел:", windowsPages.length, "страниц");
});
