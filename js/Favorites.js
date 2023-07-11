import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

/*         GithubUser.search('allisonantunes') // vem da pesquisa
        .then(user => console.log(user))
        // pegando a cadeia de promessa do GithubUser... continuando */
    }
    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        // salvar no localstorage
        // transformar em json o entries
    }

    async add(username) { // assincrono
        try {
            // find = encontre. recebe funcao. devolve um obj
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined){
                throw new Error('Usuario não encontrado')
            }
            this.entries = [user, ...this.entries] // add um novo user no novo array e pegando os outros
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
        // await está aguardando uma promessa
    }

    delete(user) {
        // Higher=order functions (map, filter, find, reduse)
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

// classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root) // chama o constructor do favorites
        
        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update() {
        this.removeAllTr()


        this.entries.forEach((user) => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha ?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')
        // criar um elemento pela DOM js

        
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/allisonantunes.png" alt="imagem perfil github">
            <a href="https://github.com/allisonantunes" target="_blank">
                <p>Allison Antunes</p>
                <span>allisonantunes</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>      
        `
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        }) // All ta pegando todos os tr
    }
}