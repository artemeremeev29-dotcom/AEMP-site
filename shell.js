
// ========================================
// AEMP WEBSITE — NAVIGATION SYSTEM
// ========================================

const pages = [
  {
    id: "home",
    title: "Главная",
    url: "index.html"
  },
  {
    id: "downloads",
    title: "Загрузки",
    url: "downloads.html"
  },
  {
    id: "old",
    title: "Старые версии",
    url: "old.html"
  },
  {
    id: "skins",
    title: "Скины",
    url: "skins.html"
  },
  {
    id: "news",
    title: "Новости",
    url: "news.html"
  },
  {
    id: "about",
    title: "О проекте",
    url: "about.html"
  },
  {
    id: "license",
    title: "Лицензионное соглашение",
    url: "license.html"
  }
];

// Получаем содержимое страницы
const content = document.getElementById("page-content");

if (!content) {
  console.error("AEMP: элемент #page-content не найден!");
} else {

  const currentPage = content.dataset.page;

  // Создаём навигацию
  const navigation = pages.map(page => `
    <a
      class="nav-link ${page.id === currentPage ? "active" : ""}"
      href="${page.url}"
      ${page.id === currentPage ? 'aria-current="page"' : ""}
    >
      ${page.title}
    </a>
  `).join("");

  // Создаём структуру сайта
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

      <h3>Рекомендации</h3>

      <a class="recommendation" href="downloads.html">
        <div>
          <strong>AEMP PRO</strong>
          <p>Попробуй наш музыкальный плеер</p>
        </div>
      </a>

      <a class="recommendation" href="skins.html">
        <div>
          <strong>Скины</strong>
          <p>Измени внешний вид AEMP</p>
        </div>
      </a>

      <a class="recommendation" href="news.html">
        <div>
          <strong>Новости</strong>
          <p>Следи за обновлениями проекта</p>
        </div>
      </a>

    </aside>
  `;

  // Перемещаем содержимое страницы
  const mainContainer = layout.querySelector(".main-container");
  mainContainer.appendChild(content);

  // Добавляем структуру на страницу
  document.body.appendChild(layout);

  console.log("AEMP: навигация успешно загружена!");
}
