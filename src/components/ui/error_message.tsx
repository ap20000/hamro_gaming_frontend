type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="p-3 bg-red-700 border border-red-200 rounded-lg">
    <p className="text-gaming-white text-sm font-sans">{message}</p>
  </div>
);

export default ErrorMessage;
