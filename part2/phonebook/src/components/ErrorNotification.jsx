const SuccessNotification = ({message}) => {
      if(message === null){
        return null
    }

    const successStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
    }

    return (
        <div style={successStyle}>
            {message}
        </div>
    )
}

export default SuccessNotification