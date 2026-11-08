
async function loadLatestRelease() {
    const version = document.getElementById("latestVersion");
    const description = document.getElementById("releaseDescription");
    const date = document.getElementById("releaseDate");
    const status = document.getElementById("releaseStatus");
    const button = document.getElementById("downloadButton");

    const apiUrl =
        "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases/latest";

    try {
        status.textContent = "Подключение к GitHub API...";

        const response = await fetch(apiUrl, {
            headers: {
                "Accept": "application/vnd.github+json"
            }
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const release = await response.json();

        const apk = release.assets.find(asset =>
            asset.name.toLowerCase().endsWith(".apk")
        );

        version.textContent = "AEMP PRO " + release.tag_name;
        status.textContent = "Последняя версия на GitHub";

        description.textContent = release.body ||
            "Последний официальный выпуск AEMP PRO.";

        date.textContent = release.published_at
            ? "Дата публикации: " +
              new Date(release.published_at).toLocaleDateString("ru-RU")
            : "";

        if (apk) {
            button.href = apk.browser_download_url;
            button.textContent = "Скачать " + apk.name;
        } else {
            button.href = release.html_url;
            button.textContent = "Открыть релиз";
            status.textContent = "В релизе не найден APK-файл";
        }

    } catch (error) {
        console.error("AEMP GitHub API:", error);

        version.textContent = "AEMP PRO";
        status.textContent = "Ошибка: " + error.message;
        description.textContent =
            "Не удалось получить информацию о последнем релизе.";

        button.href =
            "https://github.com/artemeremeev29-dotcom/AEMP-PRO/releases";

        button.textContent = "Открыть релизы GitHub";
    }
}

loadLatestRelease();
