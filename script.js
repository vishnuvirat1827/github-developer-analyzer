const profile = document.getElementById("profile");
const reposContainer = document.getElementById("repos");
const loading = document.getElementById("loading");
const repoSearch = document.getElementById("repoSearch");

let allRepos = [];

async function searchUser() {

    const username =
        document.getElementById("username").value.trim();

    if (!username) {
        alert("Enter Username");
        return;
    }

    profile.innerHTML = "";
    reposContainer.innerHTML = "";

    loading.innerHTML = "Loading...";

    try {

        const userResponse =
            await fetch(
                `https://api.github.com/users/${username}`
            );

        const userData =
            await userResponse.json();

        if (userData.message === "Not Found") {

            loading.innerHTML = "";

            profile.innerHTML =
                "<h2 style='color:red'>User Not Found</h2>";

            return;
        }

        profile.innerHTML = `
            <img src="${userData.avatar_url}">
            <h2>${userData.name || "No Name"}</h2>
            <p>${userData.bio || "No Bio Available"}</p>
            <p>📍 ${userData.location || "Not Available"}</p>
            <p>👥 Followers: ${userData.followers}</p>
            <p>➡ Following: ${userData.following}</p>
            <p>📂 Public Repos: ${userData.public_repos}</p>
        `;

        const repoResponse =
            await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated`
            );

        const repos =
            await repoResponse.json();

        allRepos = repos;

        displayRepos(repos);

        repoSearch.style.display = "block";

        loading.innerHTML = "";

    } catch (error) {

        loading.innerHTML = "";

        profile.innerHTML =
            "<h2 style='color:red'>Something went wrong!</h2>";
    }
}

function displayRepos(repos) {

    reposContainer.innerHTML = "";

    repos.slice(0, 10).forEach(repo => {

        reposContainer.innerHTML += `
            <div class="repo-card">
                <h3>${repo.name}</h3>

                <p>
                    ⭐ Stars:
                    ${repo.stargazers_count}
                </p>

                <p>
                    🍴 Forks:
                    ${repo.forks_count}
                </p>

                <p>
                    💻 Language:
                    ${repo.language || "N/A"}
                </p>

                <br>

                <a href="${repo.html_url}"
                    target="_blank">
                    View Repository
                </a>
            </div>
        `;
    });
}

function filterRepos() {

    const search =
        repoSearch.value.toLowerCase();

    const filtered =
        allRepos.filter(repo =>
            repo.name.toLowerCase()
            .includes(search)
        );

    displayRepos(filtered);
}

const themeBtn =
    document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerText =
            "☀ Light Mode";
    } else {
        themeBtn.innerText =
            "🌙 Dark Mode";
    }
});