
const API_URL =
    "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-Windows/releases?per_page=100";

const latestVersion = document.getElementById("windowsLatestVersion");
const releaseStatus = document.getElementById("windowsReleaseStatus");
const releaseDate = document.getElementById("windowsReleaseDate");
const releaseDescription = document.getElementById("windowsReleaseDescription");
const downloadButton = document.getElementById("windowsDownloadButton");
const archive = document.getElementById("windowsOldVersions");

function normalizeVersion(value) {
    return String(value || "")
        .trim()
        .replace(/^v/i, "")
        .toLowerCase();
}

function compareVersions(a, b) {
    const first = normalizeVersion(a).split(/[.-]/);
    const second = normalizeVersion(b).split(/[.-]/);

    for (let i = 0; i < Math.max(first.length, second.length); i++) {
        const x = first[i] || "0";
        const y = second[i] || "0";

        const nx = Number(x);
        const ny = Number(y);

        let result;

        if (Number.isFinite(nx) && Number.isFinite(ny)) {
            result = nx - ny;
        } else {
            result = x.localeCompare(y);
        }

        if (result !== 0) return result;
    }

    return 0;
}

function findInstaller(release) {
    const assets = release.assets || [];

    return assets.find(asset =>
        asset.name.toLowerCase().endsWith(".exe") &&
        asset.browser_download_url
    );
}

function formatDate(value) {
    if (!value) return "Дата не указана";

    return new Date(value).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function createArchiveItem(release) {
    const card = document.createElement("div");
    card.className = "archive-release";

    const title = document.createElement("h3");
    title.textContent = release.name || release.tag_name;

    const date = document.createElement("p");
    date.className = "muted";
    date.textContent = "Дата выпуска: " + formatDate(release.published_at);

    const link = document.createElement("a");
    link.className = "secondary-button";
    link.href = release.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Открыть релиз";

    card.append(title, date, link);

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

async function loadWindowsReleases() {
    try {
        if (releaseStatus) {
            releaseStatus.textContent = "Загружаем информацию о версиях...";
        }

        const response = await fetch(API_URL, {
            headers: {
                Accept: "application/vnd.github+json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("GitHub API: " + response.status);
        }

        const releases = await response.json();

        const stable = releases
            .filter(release =>
                !release.draft &&
                !release.prerelease
            )
            .sort((a, b) =>
                compareVersions(b.tag_name, a.tag_name)
            );

        if (!stable.length) {
            throw new Error("Стабильные релизы пока не найдены.");
        }

        const current = stable[0];
        const installer = findInstaller(current);

        if (latestVersion) {
            latestVersion.textContent =
                current.tag_name || current.name;
        }

        if (releaseDate) {
            releaseDate.textContent =
                "Дата выпуска: " + formatDate(current.published_at);
        }

        if (releaseDescription) {
            releaseDescription.textContent =
                current.body || "Описание релиза отсутствует.";
        }

        if (downloadButton) {
            if (installer) {
                downloadButton.href = installer.browser_download_url;
                downloadButton.hidden = false;
            } else {
                downloadButton.hidden = true;
            }
        }

        if (releaseStatus) {
            releaseStatus.textContent = installer
                ? "Последняя стабильная версия найдена."
                : "Релиз найден, но установщик EXE отсутствует.";
        }

        if (archive) {
            archive.replaceChildren();

            stable.slice(1).forEach(release => {
                archive.appendChild(createArchiveItem(release));
            });

            if (stable.length <= 1) {
                archive.textContent = "Предыдущих версий пока нет.";
            }
        }

    } catch (error) {
        console.error("AEMP Windows releases:", error);

        if (releaseStatus) {
            releaseStatus.textContent =
                "Не удалось загрузить версии: " + error.message;
        }
    }
}

loadWindowsReleases();
