
const API_URL =
  "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=10";

const APK_NAME = "AEMP-PRO-1.4-skins_mod.apk";

const elements = {
  version: document.getElementById("latestVersion"),
  description: document.getElementById("releaseDescription"),
  date: document.getElementById("releaseDate"),
  status: document.getElementById("releaseStatus"),
  button: document.getElementById("downloadButton")
};

function cleanDescription(text) {
  return (text || "")
    // Убираем HTML-картинки
    .replace(/<img\b[^>]*>/gi, "")
    // Убираем HTML-теги
    .replace(/<[^>]*>/g, "")
    // Убираем Markdown-ссылки на изображения
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // Убираем лишние пробелы и пустые строки
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function loadLatestRelease() {
  try {
    if (elements.status) {
      elements.status.textContent = "Проверяем последнюю версию на GitHub...";
    }

    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/vnd.github+json"
      },
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const releases = await response.json();

    const latest = releases.find(
      release => !release.draft && !release.prerelease
    );

    if (!latest) {
      throw new Error("Опубликованные релизы не найдены");
    }

    const apk = latest.assets.find(
      asset => asset.name === APK_NAME
    );

    if (elements.version) {
      elements.version.textContent = latest.name || latest.tag_name;
    }

    if (elements.description) {
      elements.description.textContent =
        cleanDescription(latest.body);
    }

    if (elements.date) {
      elements.date.textContent = latest.published_at
        ? new Date(latest.published_at).toLocaleDateString("ru-RU")
        : "Дата не указана";
    }

    if (elements.button) {
      if (apk) {
        elements.button.href = apk.browser_download_url;
        elements.button.style.display = "";
      } else {
        elements.button.style.display = "none";
      }
    }

    if (elements.status) {
      elements.status.textContent = apk
        ? "Последняя доступная версия"
        : "Релиз найден, но нужный APK отсутствует";
    }

  } catch (error) {
    console.error("AEMP API:", error);

    if (elements.status) {
      elements.status.textContent =
        "Ошибка загрузки: " + error.message;
    }
  }
}

loadLatestRelease();

const API_URL =
  "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=10";

const APK_NAME = "AEMP-PRO-1.4-skins_mod.apk";

const elements = {
  version: document.getElementById("latestVersion"),
  description: document.getElementById("releaseDescription"),
  date: document.getElementById("releaseDate"),
  status: document.getElementById("releaseStatus"),
  button: document.getElementById("downloadButton")
};

function cleanDescription(text) {
  return (text || "")
    // Убираем HTML-картинки
    .replace(/<img\b[^>]*>/gi, "")
    // Убираем HTML-теги
    .replace(/<[^>]*>/g, "")
    // Убираем Markdown-ссылки на изображения
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // Убираем лишние пробелы и пустые строки
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function loadLatestRelease() {
  try {
    if (elements.status) {
      elements.status.textContent = "Проверяем последнюю версию на GitHub...";
    }

    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/vnd.github+json"
      },
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const releases = await response.json();

    const latest = releases.find(
      release => !release.draft && !release.prerelease
    );

    if (!latest) {
      throw new Error("Опубликованные релизы не найдены");
    }

    const apk = latest.assets.find(
      asset => asset.name === APK_NAME
    );

    if (elements.version) {
      elements.version.textContent = latest.name || latest.tag_name;
    }

    if (elements.description) {
      elements.description.textContent =
        cleanDescription(latest.body);
    }

    if (elements.date) {
      elements.date.textContent = latest.published_at
        ? new Date(latest.published_at).toLocaleDateString("ru-RU")
        : "Дата не указана";
    }

    if (elements.button) {
      if (apk) {
        elements.button.href = apk.browser_download_url;
        elements.button.style.display = "";
      } else {
        elements.button.style.display = "none";
      }
    }

    if (elements.status) {
      elements.status.textContent = apk
        ? "Последняя доступная версия"
        : "Релиз найден, но нужный APK отсутствует";
    }

  } catch (error) {
    console.error("AEMP API:", error);

    if (elements.status) {
      elements.status.textContent =
        "Ошибка загрузки: " + error.message;
    }
  }
}

loadLatestRelease();
