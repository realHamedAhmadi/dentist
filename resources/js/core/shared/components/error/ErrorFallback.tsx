export default function ({error,resetErrorBoundary}){
    return(
        <div role="alert"  style={{padding:20}}>
            <h2>خطایی رخ داد</h2>
            <p>{error.message}</p>
            <button onClick={resetErrorBoundary}>تلاش دوباره</button>
        </div>
    )
}
