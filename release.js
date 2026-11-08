
async function loadLatestRelease() {
    const version = document.getElementById("latestVersion");
    const description = document.getElementById("releaseDescription");
    const date = document.getElementById("releaseDate");
    const status = document.getElementById("releaseStatus");
    const button = document.getElementById("downloadButton");

    const apiUrl =
        "https://api.github.com/repos/artemeremeev29-dotcom/AEMP-PRO/releases/latest";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("GitHub API: " + response.status);
        }

        const release = await response.json();

        const apk = release.assets.find(asset =>
            asset.name.toLowerCase().endsWith(".apk")
        );

        version.textContent = "AEMP PRO " +
            (release.tag_name || release.name || "");

        status.textContent = "Последняя опубликованная версия";

        description.textContent = release.body ||
            "Последний официальный выпуск AEMP PRO.";

        date.textContent = release.published_at
            ? "Дата публикации: " +
              new Date(release.published_at).toLocaleDateString("ru-RU")
            : "";

        if (apk) {
            button.href = apk.browser_download_url;
            button.textContent = "Скачать AEMP PRO";
            button.style.display = "inline-block";
        } else {
            button.href = release.html_url;
            button.textContent = "Открыть релиз на GitHub";
        }

    } catch (error) {
        console.error(error);

        version.textContent = "AEMP PRO";
        status.textContent = "Не удалось получить последнюю версию";
        description.textContent =
            "Попробуйте открыть страницу релизов GitHub.";

        button.href =
            "https://github.com/artemeremeev29-dotcom/AEMP-PRO/releases";

        button.textContent = "Открыть GitHub";
    }
}

loadLatestRelease();
