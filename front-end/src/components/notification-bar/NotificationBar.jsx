const NotificationBar = ({ message, type, onClose }) => {
    return (
      <div className={`fixed top-0 left-0 w-full p-4 ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white text-center`}>
        {message}
        <button onClick={onClose} className="absolute top-4  right-4 text-white">
          &times;
        </button>
      </div>
    );
  };
  
  export default NotificationBar;
  