
const API_URL =
  "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=10";

const elements = {
  version: document.getElementById("latestVersion"),
  description: document.getElementById("releaseDescription"),
  date: document.getElementById("releaseDate"),
  status: document.getElementById("releaseStatus"),
  button: document.getElementById("downloadButton")
};

function setStatus(message) {
  if (elements.status) {
    elements.status.textContent = message;
  }
}

async function loadLatestRelease() {
  try {
    setStatus("Проверяем последнюю версию на GitHub...");

    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/vnd.github+json"
      },
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(`GitHub API: HTTP ${response.status}`);
    }

    const releases = await response.json();

    if (!Array.isArray(releases)) {
      throw new Error("Неверный формат ответа GitHub");
    }

    const latest = releases.find(
      release => !release.draft && !release.prerelease
    );

    if (!latest) {
      throw new Error("Опубликованные релизы не найдены");
    }

    // Ищем APK в последнем релизе
    const apk = latest.assets.find(asset =>
      asset.name.toLowerCase().endsWith(".apk")
    );

    if (elements.version) {
      elements.version.textContent =
        `AEMP PRO ${latest.tag_name}`;
    }

    if (elements.description) {
      elements.description.textContent =
        latest.body || "Описание обновления пока отсутствует.";
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
        elements.button.removeAttribute("aria-disabled");
      } else {
        elements.button.style.display = "none";
      }
    }

    setStatus(
      apk
        ? "Последняя версия успешно загружена!"
        : "Релиз найден, но APK в нём отсутствует."
    );

  } catch (error) {
    console.error("AEMP release error:", error);
    setStatus("Не удалось загрузить релиз: " + error.message);
  }
}

loadLatestRelease();
