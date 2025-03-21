// src/components/ErrorFallback.jsx
export default function ErrorFallback({ error, resetErrorBoundary }) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold">දෝෂයක් සිදුවී ඇත!</h2>
        <pre className="whitespace-pre-wrap">{error.message}</pre>
        <button 
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          නැවත උත්සහ කරන්න
        </button>
      </div>
    );
  }