
async function loadLatestRelease() {
    const version = document.getElementById("latestVersion");
    const description = document.getElementById("releaseDescription");
    const date = document.getElementById("releaseDate");
    const status = document.getElementById("releaseStatus");
    const button = document.getElementById("downloadButton");

    const apiUrl =
        "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases?per_page=10";

    try {
        status.textContent = "Подключение к GitHub...";

        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/vnd.github+json"
            }
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const releases = await response.json();

        const release = releases.find(item =>
            !item.draft &&
            !item.prerelease &&
            item.assets.some(asset =>
                asset.name.toLowerCase().endsWith(".apk")
            )
        );

        if (!release) {
            throw new Error("Опубликованные APK-релизы не найдены");
        }

        const apk = release.assets.find(asset =>
            asset.name.toLowerCase().endsWith(".apk")
        );

        version.textContent = "AEMP PRO " + release.tag_name;
        status.textContent = "Последняя доступная версия";

        description.textContent = release.body ||
            "Официальный выпуск AEMP PRO.";

        date.textContent = release.published_at
            ? "Дата публикации: " +
              new Date(release.published_at).toLocaleDateString("ru-RU")
            : "";

        button.href = apk.browser_download_url;
        button.textContent = "Скачать " + apk.name;
        button.style.display = "inline-block";

    } catch (error) {
        console.error("AEMP API:", error);

        version.textContent = "AEMP PRO";
        status.textContent = "Ошибка загрузки";
        description.textContent = error.message;

        button.href =
            "https://github.com/artemeremeev29-dotcom/AEMP-PRO/releases";

        button.textContent = "Открыть GitHub";
    }
}

loadLatestRelease();
