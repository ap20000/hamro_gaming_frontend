type SuccessMessageProps = {
  message: string;
};

const SuccessMessage = ({ message }: SuccessMessageProps) => (
  <div className="p-3 bg-green-700 border border-green-200 rounded-lg">
    <p className="text-gaming-white text-sm font-sans">{message}</p>
  </div>
);

export default SuccessMessage;
