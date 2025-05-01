// AppHeader component
export default function AppHeader() {

    const reloadPage = () => {
        window.location.reload();
    }

    return (
        <div className='title' onClick={reloadPage}>
            <img src="/bot.png" alt="DevBot" />
            <h2>GenAIBot</h2>
        </div>
    )
}
