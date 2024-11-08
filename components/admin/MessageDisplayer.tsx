const MessageDisplayer = ({message}: {message: string}) => {
    return (
      <div className="container mx-auto p-6">
          <p className='text-lg font-bold'>{message}</p>
      </div>
    )
  }
  
  export default MessageDisplayer