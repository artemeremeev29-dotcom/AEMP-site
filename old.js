
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

function isCurrentRelease(release) {
    const tag = normalizeVersion(release.tag_name);
    const name = normalizeVersion(release.name);

    return tag === CURRENT_VERSION ||
           name.includes(CURRENT_VERSION);
}

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

function createLink(text, url) {
    const link = document.createElement("a");

    link.className = "button";
    link.textContent = text;
    link.href = url;

    return link;
}

function createIcon() {
    const image = document.createElement("img");

    image.src = "aemp-pro-icon.png";
    image.alt = "AEMP PRO";
    image.className = "aemp-app-icon";
    image.width = 76;
    image.height = 76;

    image.style.width = "76px";
    image.style.height = "76px";
    image.style.minWidth = "76px";
    image.style.border = "4px solid #080808";
    image.style.borderRadius = "50%";
    image.style.objectFit = "cover";

    return image;
}

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

        const oldVersions = releases.filter(release =>
            !release.draft &&
            !release.prerelease &&
            !isCurrentRelease(release)
        );

        archive.replaceChildren();

        if (!oldVersions.length) {
            status.textContent = "Предыдущих версий пока нет.";
            return;
        }

        oldVersions.forEach(release => {
            const card = document.createElement("div");
            card.className = "archive-release";

            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.flexWrap = "wrap";
            card.style.gap = "16px";
            card.style.padding = "14px 0";

            const icon = createIcon();

            const info = document.createElement("div");
            info.style.flex = "1";
            info.style.minWidth = "150px";

            const title = document.createElement("h2");
            title.textContent =
                release.name || "AEMP PRO " + release.tag_name;

            const apk = findAPK(release);

            info.appendChild(title);

            if (release.published_at) {
                const date = document.createElement("p");
                date.className = "muted";

                date.textContent =
                    "Дата выпуска: " +
                    new Date(release.published_at).toLocaleDateString(
                        "ru-RU",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );

                info.appendChild(date);
            }

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

            archive.appendChild(card);
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
