interface Props {
    inverted?: boolean;
    content?: string;
  }
  
  export default function LoadingComponent({ inverted = true, content = 'Loading...' }: Props) {
    return (
      <div className={`flex flex-col justify-center items-center bg-white h-screen ${inverted ? 'dark:invert' : ''}`}>
        <div className="flex space-x-2 mb-4">
          <div className="h-8 w-8 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-8 w-8 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-8 w-8 bg-blue-300 rounded-full animate-bounce"></div>
        </div>
        <span className="text-blue-600 text-lg font-medium">{content}</span>
      </div>
    );
  }
  