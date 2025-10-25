import './messageDiv.css'

export function MessageDiv({ Message, show }){
    return(
<div id="messageDiv" className={show ? "messageDiv showDiv" : "messageDiv"} >
 {Message}
</div>
    )
}

