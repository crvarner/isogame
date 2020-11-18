import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

function Lobby (props) {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(async () => {
        const resp = await fetch(window.routes.list_games)
        const body = await resp.json()
        setGames(body.games)
        setLoading(false)
    }, [])

    async function createGame (e) {
        e.preventDefault()
        const resp = await fetch(window.routes.create_game, {
            method: "POST",
            contentType: "application/json"
        })
        const body = await resp.json()
        window.location.href = window.routes.client.replace(':game_id', body.id)
    }

    const rows = games.map(g => (<tr key={g.id}>
      <td><a href={window.routes.client.replace(':game_id', g.id)}>{ g.id }</a></td>
      <td>{ g.players }</td>
    </tr>));

    return (
        <div>
            <button onClick={createGame}>Create Game</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

ReactDOM.render(
    <Lobby/>
, document.getElementById("root"))
