function ProgressBar({ progress }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">

      <div className="flex justify-between mb-2">

        <span className="font-semibold">
          Processing...
        </span>

        <span>
          {progress}%
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">

        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ProgressBar;