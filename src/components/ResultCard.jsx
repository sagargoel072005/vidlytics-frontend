
import { motion } from "framer-motion";

<motion.div
  initial={{
    opacity: 0,
    y: 40,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.4,
  }}
></motion.div>

function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">

      <h2 className="text-2xl font-bold mb-6">
        Comparison Result
      </h2>

      <div className="mb-6">

        <h3 className="font-bold">
          Similarity Score
        </h3>

        <p className="text-4xl text-green-600">
          {result.similarityScore}%
        </p>

      </div>

      <div className="mb-6">

        <h3 className="font-bold mb-2">
          Common Topics
        </h3>

        {
          result.commonTopics?.map(
            (topic,index)=>(
              <div
                key={index}
                className="bg-green-100 px-3 py-2 rounded mb-2"
              >
                {topic}
              </div>
            )
          )
        }

      </div>

      <div className="mb-6">

        <h3 className="font-bold mb-2">
          Differences
        </h3>

        {
          result.differences?.map(
            (diff,index)=>(
              <div
                key={index}
                className="bg-red-100 px-3 py-2 rounded mb-2"
              >
                {diff}
              </div>
            )
          )
        }

      </div>

      <div>

        <h3 className="font-bold mb-2">
          Summary
        </h3>

        <p>
          {result.summary}
        </p>

      </div>

    </div>
  );
}

export default ResultCard;