const API_URL =
    "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=20";

const elements = {
    version: document.getElementById("latestVersion"),
    description: document.getElementById("releaseDescription"),
    date: document.getElementById("releaseDate"),
    status: document.getElementById("releaseStatus"),
    button: document.getElementById("downloadButton"),
    github: document.getElementById("githubButton"),
    archive: document.getElementById("oldVersions")
};


// ОЧИСТКА ОПИСАНИЯ

function cleanDescription(text) {
    return (text || "")
        .replace(/<img\b[^>]*>/gi, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\r/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


// ПОЛУЧЕНИЕ НОМЕРА ВЕРСИИ

function getVersion(tag) {
    return (tag || "")
        .replace(/^v/i, "")
        .split(/[+-]/)[0]
        .split(".")
        .map(part => parseInt(part, 10) || 0);
}


// СРАВНЕНИЕ ВЕРСИЙ

function compareVersions(a, b) {
    const va = getVersion(a.tag_name);
    const vb = getVersion(b.tag_name);

    const length = Math.max(va.length, vb.length);

    for (let i = 0; i < length; i++) {
        const x = va[i] || 0;
        const y = vb[i] || 0;

        if (x !== y) {
            return y - x;
        }
    }

    return new Date(b.published_at || 0) -
           new Date(a.published_at || 0);
}


// ПОИСК APK

function findAPK(release) {
    const assets = release.assets || [];

    const apkFiles = assets.filter(asset =>
        asset.name.toLowerCase().endsWith(".apk")
    );

    if (!apkFiles.length) {
        return null;
    }

    const version = release.tag_name
        .replace(/^v/i, "")
        .toLowerCase();

    const normalizedVersion = version.replace(/\./g, "_");

    return apkFiles.find(asset => {
        const name = asset.name.toLowerCase();

        return name.includes(version) ||
               name.includes(normalizedVersion);
    }) || apkFiles[0];
}


// ФОРМАТИРОВАНИЕ ДАТЫ

function formatDate(date) {
    if (!date) return "Дата не указана";

    return new Date(date).toLocaleDateString("ru-RU");
}


// СОЗДАНИЕ КНОПКИ

function createLink(text, url, className) {
    const link = document.createElement("a");

    link.textContent = text;
    link.href = url;
    link.className = className;

    return link;
}


// ОТОБРАЖЕНИЕ АРХИВА

function renderArchive(releases, latest) {
    if (!elements.archive) return;

    elements.archive.replaceChildren();

    const oldReleases = releases.filter(release =>
        release.id !== latest.id
    );

    if (!oldReleases.length) {
        const message = document.createElement("p");
        message.className = "muted";
        message.textContent = "Предыдущих версий пока нет.";

        elements.archive.appendChild(message);
        return;
    }

    oldReleases.forEach(release => {
        const card = document.createElement("div");

        card.className = "archive-release";

        const title = document.createElement("h3");

        title.textContent =
            release.name || `AEMP PRO ${release.tag_name}`;

        const date = document.createElement("p");

        date.className = "muted";
        date.textContent =
            "Выпущено: " + formatDate(release.published_at);

        const apk = findAPK(release);

        const actions = document.createElement("div");

        if (apk) {
            actions.appendChild(
                createLink(
                    "Скачать APK",
                    apk.browser_download_url,
                    "secondary-button"
                )
            );
        }

        actions.appendChild(
            createLink(
                "GitHub",
                release.html_url,
                "secondary-button"
            )
        );

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(actions);

        elements.archive.appendChild(card);
    });
}


// ЗАГРУЗКА РЕЛИЗОВ

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
            throw new Error(`GitHub API: HTTP ${response.status}`);
        }

        const releases = await response.json();

        const stableReleases = releases
            .filter(release =>
                !release.draft && !release.prerelease
            )
            .sort(compareVersions);

        if (!stableReleases.length) {
            throw new Error("Опубликованные релизы не найдены");
        }

        const latest = stableReleases[0];
        const apk = findAPK(latest);

        // АКТУАЛЬНАЯ ВЕРСИЯ

        if (elements.version) {
            elements.version.textContent =
                latest.name || `AEMP PRO ${latest.tag_name}`;
        }

        if (elements.description) {
            elements.description.textContent =
                cleanDescription(latest.body) ||
                "Информация об обновлении отсутствует.";
        }

        if (elements.date) {
            elements.date.textContent =
                formatDate(latest.published_at);
        }

        if (elements.button) {
            if (apk) {
                elements.button.href =
                    apk.browser_download_url;

                elements.button.download = apk.name;
                elements.button.textContent = "Скачать APK";
                elements.button.style.display = "";
            } else {
                elements.button.style.display = "none";
            }
        }

        if (elements.github) {
            elements.github.href = latest.html_url;
        }

        if (elements.status) {
            elements.status.textContent = apk
                ? "Последняя версия доступна для скачивания"
                : "Релиз найден, APK пока отсутствует";
        }

        // АРХИВ ПРЕДЫДУЩИХ ВЕРСИЙ

        renderArchive(stableReleases, latest);

    } catch (error) {
        console.error("AEMP API:", error);

        if (elements.status) {
            elements.status.textContent =
                "Ошибка загрузки: " + error.message;
        }

        if (elements.archive) {
            elements.archive.textContent =
                "Не удалось загрузить историю версий.";
        }
    }
}


loadLatestRelease();
  
