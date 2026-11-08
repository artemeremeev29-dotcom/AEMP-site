
const API_URL =
  "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=20";

const elements = {
  version: document.getElementById("latestVersion"),
  description: document.getElementById("releaseDescription"),
  date: document.getElementById("releaseDate"),
  status: document.getElementById("releaseStatus"),
  button: document.getElementById("downloadButton")
};

function cleanDescription(text) {
  return (text || "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findAPK(release) {
  const assets = release.assets || [];

  // Сначала ищем APK с номером версии в названии
  const version = release.tag_name.replace(/^v/i, "");

  const matching = assets.find(asset => {
    if (!asset.name.toLowerCase().endsWith(".apk")) return false;

    return asset.name
      .toLowerCase()
      .includes(version.toLowerCase());
  });

  // Если подходящего нет, берём первый APK
  return matching || assets.find(asset =>
    asset.name.toLowerCase().endsWith(".apk")
  );
}

async function loadLatestRelease() {
  try {
    if (elements.status) {
      elements.status.textContent =
        "Проверяем последнюю версию на GitHub...";
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

    const latest = releases.find(release =>
      !release.draft && !release.prerelease
    );

    if (!latest) {
      throw new Error("Опубликованные релизы не найдены");
    }

    const apk = findAPK(latest);

    if (elements.version) {
      elements.version.textContent =
        latest.name || `AEMP PRO ${latest.tag_name}`;
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
        elements.button.download = apk.name;
        elements.button.style.display = "";
      } else {
        elements.button.style.display = "none";
      }
    }

    if (elements.status) {
      elements.status.textContent = apk
        ? "Последняя доступная версия"
        : "Релиз найден, APK отсутствует";
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
