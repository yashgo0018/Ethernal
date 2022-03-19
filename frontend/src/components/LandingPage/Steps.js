import './Step.css';

const steps_content = [
    {
        id: 1,
        content: "Go to Register/Connect.",
    },
    {
        id: 2,
        content: "Fill in the details, then when the user clicks on the register button.",
    },
    {
        id: 3,
        content: "Now, Fancrypt will connect to metamask to access user's ethereum address.",
    },
    {
        id: 4,
        content: "Now, Fancrypt will send the address to server in the 'get nonce message' endpoint, the server will return a nonce message.",
    },
    {
        id: 5,
        content: "Fancrypt will use this message on the metamask signature api, the user will sign the nonce message using metamask, then the site will get the signature.",
    },
    {
        id: 6,
        content: "Now, Fancrypt will send the user filled form data with the signature and the user's eth address to the 'register' endpoint",
    },
]

const Steps = () => {
    return (
        <div className='steps_wrapper my-3'>
            {
                steps_content.map((step) => {
                    return (
                        <div key={step.id}>
                            <div className="step_count">
                                <span className='span_num d-inline'>{step.id}</span>
                                <div className="span_content">{step.content}</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Steps