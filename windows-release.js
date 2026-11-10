const API_URL =
    "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-Windows/releases?per_page=100";

const latestVersion = document.getElementById("windowsLatestVersion");
const latestBadge = document.getElementById("windowsLatestVersionBadge");
const releaseStatus = document.getElementById("windowsReleaseStatus");
const releaseDate = document.getElementById("windowsReleaseDate");
const releaseDescription = document.getElementById("windowsReleaseDescription");
const downloadButton = document.getElementById("windowsDownloadButton");
const archive = document.getElementById("windowsOldVersions");

// Нормализация номера версии
function normalizeVersion(value) {
    return String(value || "")
        .trim()
        .replace(/^v/i, "")
        .split("-")[0];
}

// Сравнение версий: 1.10.0 будет новее 1.9.0
function compareVersions(a, b) {
    const first = normalizeVersion(a).split(".");
    const second = normalizeVersion(b).split(".");

    const length = Math.max(first.length, second.length);

    for (let i = 0; i < length; i++) {
        const x = Number(first[i] || 0);
        const y = Number(second[i] || 0);

        if (x !== y) {
            return x - y;
        }
    }

    return 0;
}

// Поиск EXE установщика
function findInstaller(release) {
    return (release.assets || []).find(asset =>
        asset.name.toLowerCase().endsWith(".exe") &&
        asset.browser_download_url
    );
}

// Форматирование даты
function formatDate(value) {
    if (!value) return "Дата не указана";

    return new Date(value).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// Создание карточки старой версии
function createArchiveItem(release) {
    const card = document.createElement("div");
    card.className = "archive-release";

    const title = document.createElement("h3");
    title.textContent = release.name || release.tag_name;

    const version = document.createElement("p");
    version.className = "version";
    version.textContent = release.tag_name;

    const date = document.createElement("p");
    date.className = "muted";
    date.textContent =
        "Дата выпуска: " + formatDate(release.published_at);

    const link = document.createElement("a");
    link.className = "secondary-button";
    link.href = release.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Открыть релиз";

    card.append(title, version, date, link);

    const installer = findInstaller(release);

    if (installer) {
        const download = document.createElement("a");
        download.className = "button";
        download.href = installer.browser_download_url;
        download.textContent = "Скачать EXE";

        card.appendChild(download);
    }

    return card;
}

// Загрузка релизов GitHub
async function loadWindowsReleases() {
    try {
        if (releaseStatus) {
            releaseStatus.textContent =
                "Загружаем информацию о версиях...";
        }

        const response = await fetch(API_URL, {
            headers: {
                Accept: "application/vnd.github+json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Ошибка GitHub API: " + response.status);
        }

        const releases = await response.json();

        // Только опубликованные стабильные релизы с EXE
        const stable = releases
            .filter(release =>
                !release.draft &&
                !release.prerelease &&
                findInstaller(release)
            )
            .sort((a, b) =>
                compareVersions(b.tag_name, a.tag_name)
            );

        if (stable.length === 0) {
            throw new Error("Стабильные версии с EXE не найдены.");
        }

        const current = stable[0];
        const installer = findInstaller(current);

        const version = current.tag_name || current.name;

        // Последняя версия
        if (latestVersion) {
            latestVersion.textContent = version;
        }

        // Значок Stable
        if (latestBadge) {
            latestBadge.textContent = version + " Stable";
        }

        // Дата выпуска
        if (releaseDate) {
            releaseDate.textContent =
                "Дата выпуска: " + formatDate(current.published_at);
        }

        // Описание релиза
        if (releaseDescription) {
            releaseDescription.textContent =
                current.body || "Описание релиза отсутствует.";
        }

        // Кнопка скачивания
        if (downloadButton) {
            downloadButton.href = installer.browser_download_url;
            downloadButton.hidden = false;
        }

        // Статус
        if (releaseStatus) {
            releaseStatus.textContent =
                "Последняя стабильная версия найдена.";
        }

        // Архив предыдущих версий
        if (archive) {
            archive.replaceChildren();

            const oldReleases = stable.slice(1);

            if (oldReleases.length === 0) {
                archive.textContent =
                    "Предыдущих версий пока нет.";
            } else {
                oldReleases.forEach(release => {
                    archive.appendChild(createArchiveItem(release));
                });
            }
        }

    } catch (error) {
        console.error("AEMP Windows releases:", error);

        if (releaseStatus) {
            releaseStatus.textContent =
                "Не удалось загрузить версии: " + error.message;
        }

        if (archive) {
            archive.textContent =
                "Не удалось загрузить архив версий.";
        }
    }
}

// Запуск
loadWindowsReleases();
