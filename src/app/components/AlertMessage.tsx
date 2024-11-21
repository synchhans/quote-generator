interface AlertMessageProps {
  message: string | null;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-blue-500 text-white p-4 rounded-md mb-4 shadow-md animate__animated animate__fadeIn">
      {message}
    </div>
  );
};

export default AlertMessage;
