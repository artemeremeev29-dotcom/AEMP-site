
const API_URL =
    "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=100";

const CURRENT_VERSION = "1.5";

const status = document.getElementById("archiveStatus");
const archive = document.getElementById("archiveList");

function normalizeVersion(value) {
    return String(value || "")
        .trim()
        .replace(/^v/i, "")
        .toLowerCase();
}


// Сравнение версий

function compareVersions(a, b) {
    const getParts = release =>
        normalizeVersion(release.tag_name)
            .split(/[.+_-]/)
            .map(part => parseInt(part, 10) || 0);

    const first = getParts(a);
    const second = getParts(b);

    for (let i = 0; i < Math.max(first.length, second.length); i++) {
        const x = first[i] || 0;
        const y = second[i] || 0;

        if (x !== y) return y - x;
    }

    return new Date(b.published_at || 0) -
           new Date(a.published_at || 0);
}


// Проверка текущей версии

function isCurrentRelease(release) {
    const tag = normalizeVersion(release.tag_name);

    return tag === CURRENT_VERSION;
}


// Поиск APK

function findAPK(release) {
    const assets = release.assets || [];
    const version = normalizeVersion(release.tag_name);

    const files = assets.filter(asset =>
        asset.name.toLowerCase().endsWith(".apk") &&
        asset.browser_download_url
    );

    return files.find(asset =>
        normalizeVersion(asset.name).includes(
            version.replace(/\./g, "_")
        ) ||
        normalizeVersion(asset.name).includes(version)
    ) || files[0] || null;
}


// Создание ссылки

function createLink(text, url) {
    const link = document.createElement("a");

    link.className = "button";
    link.textContent = text;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";

    return link;
}


// Иконка приложения

function createIcon() {
    const image = document.createElement("img");

    image.src = "aemp-pro-icon.png";
    image.alt = "AEMP PRO";
    image.className = "aemp-app-icon";
    image.width = 76;
    image.height = 76;

    image.onerror = () => {
        image.style.display = "none";
    };

    return image;
}


// Форматирование даты

function formatDate(date) {
    if (!date) return "Дата не указана";

    return new Date(date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// Создание карточки релиза

function createReleaseCard(release) {
    const card = document.createElement("div");
    card.className = "archive-release";

    const icon = createIcon();

    const info = document.createElement("div");
    info.className = "archive-release-info";

    const title = document.createElement("h2");
    title.textContent =
        release.name || "AEMP PRO " + release.tag_name;

    const date = document.createElement("p");
    date.className = "muted";
    date.textContent = "Дата выпуска: " +
        formatDate(release.published_at);

    const apk = findAPK(release);

    info.appendChild(title);
    info.appendChild(date);

    card.appendChild(icon);
    card.appendChild(info);

    if (apk) {
        card.appendChild(
            createLink("Скачать APK", apk.browser_download_url)
        );
    } else {
        const missing = document.createElement("p");
        missing.className = "muted";
        missing.textContent = "APK в этом релизе отсутствует.";
        card.appendChild(missing);
    }

    card.appendChild(
        createLink("GitHub", release.html_url)
    );

    return card;
}


// Загрузка архива

async function loadArchive() {
    try {
        status.textContent = "Загружаем архив AEMP...";

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

        const oldVersions = releases
            .filter(release =>
                !release.draft &&
                !release.prerelease &&
                !isCurrentRelease(release)
            )
            .sort(compareVersions);

        archive.replaceChildren();

        if (!oldVersions.length) {
            status.textContent = "Предыдущих версий пока нет.";
            return;
        }

        oldVersions.forEach(release => {
            archive.appendChild(
                createReleaseCard(release)
            );
        });

        status.textContent =
            "В архиве: " + oldVersions.length + " версий.";

    } catch (error) {
        console.error("AEMP archive:", error);

        status.textContent =
            "Не удалось загрузить архив: " + error.message;
    }
}

loadArchive();
