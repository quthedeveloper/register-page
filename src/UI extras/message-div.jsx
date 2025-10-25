import './message.css'

export function Message({ Message, show }){
    return(
<div id="message" className={show ? "message show" : "message"} >
 {Message}
</div>
    )
}

