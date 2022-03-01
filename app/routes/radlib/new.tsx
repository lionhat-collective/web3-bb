function NewRadlibRoute() {
    return (
        <div>
            Create radlib game
            <form method="post">
                <div>
                    <label>Question Set: 
                        <select>
                            <option>NFTs</option>
                            <option>Pop Culture</option>
                        </select>
                    </label>
                </div>
                <div>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

export default NewRadlibRoute;