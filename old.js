
const API_URL =
    "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=100";

const status = document.getElementById("archiveStatus");
const archive = document.getElementById("archiveList");

function findAPK(release) {
    const assets = release.assets || [];

    return assets.find(asset =>
        asset.name.toLowerCase().endsWith(".apk")
    );
}

function formatDate(date) {
    return date
        ? new Date(date).toLocaleDateString("ru-RU")
        : "Дата не указана";
}

function createLink(text, url) {
    const link = document.createElement("a");

    link.className = "button";
    link.textContent = text;
    link.href = url;

    return link;
}

async function loadArchive() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Accept: "application/vnd.github+json"
            },
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error("GitHub API: " + response.status);
        }

        const releases = await response.json();

        const versions = releases
            .filter(release =>
                !release.draft &&
                !release.prerelease
            )
            .sort((a, b) =>
                new Date(b.published_at || 0) -
                new Date(a.published_at || 0)
            );

        // Последний релиз считается актуальным.
        // Остальные показываются в архиве.

        const oldVersions = versions.slice(1);

        archive.replaceChildren();

        if (!oldVersions.length) {
            status.textContent = "Предыдущих версий пока нет.";
            return;
        }

        oldVersions.forEach(release => {
            const card = document.createElement("div");
            card.className = "archive-release";

            const title = document.createElement("h2");
            title.textContent =
                release.name || "AEMP PRO " + release.tag_name;

            const date = document.createElement("p");
            date.className = "muted";
            date.textContent =
                "Дата выпуска: " + formatDate(release.published_at);

            const apk = findAPK(release);

            card.appendChild(title);
            card.appendChild(date);

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
                createLink("Открыть GitHub", release.html_url)
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
