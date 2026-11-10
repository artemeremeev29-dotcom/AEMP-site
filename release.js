
const API_URL =
    "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=100";

const elements = {
    version: document.getElementById("latestVersion"),
    description: document.getElementById("releaseDescription"),
    date: document.getElementById("releaseDate"),
    status: document.getElementById("releaseStatus"),
    button: document.getElementById("downloadButton"),
    github: document.getElementById("githubButton"),
    archive: document.getElementById("oldVersions")
};


// Очистка описания

function cleanDescription(text) {
    return (text || "")
        .replace(/<img\b[^>]*>/gi, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\r/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


// Сравнение версий

function compareVersions(a, b) {
    const getParts = tag =>
        tag.replace(/^v/i, "")
           .split(/[.+_-]/)
           .map(part => parseInt(part, 10) || 0);

    const first = getParts(a.tag_name);
    const second = getParts(b.tag_name);

    for (let i = 0; i < Math.max(first.length, second.length); i++) {
        const x = first[i] || 0;
        const y = second[i] || 0;

        if (x !== y) return y - x;
    }

    return new Date(b.published_at || 0) -
           new Date(a.published_at || 0);
}


// Поиск APK

function findAPK(release) {
    const assets = release.assets || [];

    const apkFiles = assets.filter(asset =>
        asset.name.toLowerCase().endsWith(".apk") &&
        asset.browser_download_url
    );

    if (!apkFiles.length) return null;

    const version = release.tag_name
        .replace(/^v/i, "")
        .toLowerCase();

    const normalized = version.replace(/\./g, "_");

    return apkFiles.find(asset => {
        const name = asset.name.toLowerCase();

        return name.includes(normalized) ||
               name.includes(version);
    }) || apkFiles[0];
}


// Форматирование даты

function formatDate(date) {
    if (!date) return "Дата не указана";

    return new Date(date).toLocaleDateString("ru-RU");
}


// Создание элемента архива

function createArchiveItem(release) {
    const container = document.createElement("div");
    container.className = "archive-item";

    const title = document.createElement("h3");
    title.textContent =
        release.name || "AEMP PRO " + release.tag_name;

    const date = document.createElement("p");
    date.className = "muted";
    date.textContent = formatDate(release.published_at);

    const apk = findAPK(release);

    container.appendChild(title);
    container.appendChild(date);

    const link = document.createElement("a");
    link.className = "secondary-button";
    link.target = "_blank";
    link.rel = "noopener";

    if (apk) {
        link.href = apk.browser_download_url;
        link.textContent = "Скачать APK";
    } else {
        link.href = release.html_url;
        link.textContent = "Открыть релиз на GitHub";
    }

    container.appendChild(link);

    return container;
}


// Отображение архива

function renderArchive(releases) {
    if (!elements.archive) return;

    elements.archive.replaceChildren();

    const oldReleases = releases.slice(1);

    if (!oldReleases.length) {
        elements.archive.textContent =
            "Предыдущих версий пока нет.";
        return;
    }

    oldReleases.forEach(release => {
        elements.archive.appendChild(
            createArchiveItem(release)
        );
    });
}


// Загрузка релизов

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
            throw new Error("GitHub API: HTTP " + response.status);
        }

        const releases = await response.json();

        const stableReleases = releases
            .filter(release =>
                !release.draft &&
                !release.prerelease
            )
            .sort(compareVersions);

        if (!stableReleases.length) {
            throw new Error("Релизы не найдены");
        }

        const latest = stableReleases[0];
        const apk = findAPK(latest);


        // Название версии

        if (elements.version) {
            elements.version.textContent =
                latest.name || "AEMP PRO " + latest.tag_name;
        }


        // Описание

        if (elements.description) {
            elements.description.textContent =
                cleanDescription(latest.body) ||
                "Информация об обновлении отсутствует.";
        }


        // Дата

        if (elements.date) {
            elements.date.textContent =
                formatDate(latest.published_at);
        }


        // Скачивание APK

        if (elements.button) {
            if (apk) {
                elements.button.href =
                    apk.browser_download_url;

                elements.button.removeAttribute("target");
                elements.button.removeAttribute("rel");

                elements.button.setAttribute("download", apk.name);
                elements.button.textContent = "Скачать APK";
                elements.button.style.display = "";
            } else {
                elements.button.style.display = "none";
            }
        }


        // Ссылка на GitHub

        if (elements.github) {
            elements.github.href = latest.html_url;
            elements.github.target = "_blank";
            elements.github.rel = "noopener";
            elements.github.textContent =
                "Перейти к релизу на GitHub";
        }


        // Статус

        if (elements.status) {
            elements.status.textContent = apk
                ? "Последняя версия доступна для скачивания"
                : "Релиз найден, но APK отсутствует";
        }


        // Архив

        renderArchive(stableReleases);

        console.log("AEMP latest release:", latest);
        console.log("AEMP APK:", apk);

    } catch (error) {
        console.error("AEMP API:", error);

        if (elements.status) {
            elements.status.textContent =
                "Ошибка загрузки: " + error.message;
        }

        if (elements.archive) {
            elements.archive.textContent =
                "Не удалось загрузить архив версий.";
        }
    }
}

loadLatestRelease();
