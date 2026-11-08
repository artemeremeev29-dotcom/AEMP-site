
async function loadLatestRelease() {
    const version = document.getElementById("latestVersion");
    const description = document.getElementById("releaseDescription");
    const date = document.getElementById("releaseDate");
    const button = document.getElementById("downloadButton");

    try {
        const response = await fetch(
            "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases/latest"
        );

        if (!response.ok) {
            throw new Error("Не удалось получить релиз");
        }

        const release = await response.json();

        const apk = release.assets.find(asset =>
            asset.name.toLowerCase().endsWith(".apk")
        );

        version.textContent = release.tag_name || release.name || "Последняя версия";

        description.textContent = release.body ||
            "Последний официальный выпуск AEMP PRO.";

        date.textContent = release.published_at
            ? "Дата выпуска: " + new Date(release.published_at).toLocaleDateString("ru-RU")
            : "";

        if (apk) {
            button.href = apk.browser_download_url;
            button.textContent = "Скачать " + apk.name;
        } else {
            button.href = release.html_url;
            button.textContent = "Открыть релиз";
        }

    } catch (error) {
        version.textContent = "AEMP PRO";
        description.textContent = "Не удалось загрузить информацию о версии.";
        button.href = "https://github.com/artemeremeev29-dotcom/AEMP-PRO/releases/latest";
        button.textContent = "Открыть GitHub";
    }
}

loadLatestRelease();
