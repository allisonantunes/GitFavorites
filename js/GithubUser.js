export class GithubUser{
    static search(username) {
        const endpont = `https://api.github.com/users/${username}`
        return fetch(endpont)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}