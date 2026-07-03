import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

function CompareForm({
  setProgress,
  setResult,
}) {

  const [video1,setVideo1]=useState("");
  const [video2,setVideo2]=useState("");

  const [loading,setLoading]=
  useState(false);

  const listenProgress =
  (jobId)=>{

    const eventSource =
      new EventSource(
        `${BASE_URL}/${jobId}/progress`
      );

    eventSource.onmessage =
    (event)=>{

      const data =
      JSON.parse(event.data);

      setProgress(
        data.progress
      );

      if(
        data.progress===100
      ){
        eventSource.close();
      }
    };
  };

  const handleCompare =
  async()=>{

    try{

      setLoading(true);

      const res =
      await axios.post(
        `${BASE_URL}/comparision`,
        {
          video1,
          video2,
        },
        {
          withCredentials:true
        }
      );

      if(res.data.jobId){
        listenProgress(
          res.data.jobId
        );
      }

      setResult(
        res.data.result ||
        res.data
      );

    }
    catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-6">
        Compare Videos
      </h2>

      <input
        placeholder="Video 1 URL"
        value={video1}
        onChange={(e)=>
          setVideo1(
            e.target.value
          )
        }
        className="w-full border p-3 rounded mb-4"
      />

      <input
        placeholder="Video 2 URL"
        value={video2}
        onChange={(e)=>
          setVideo2(
            e.target.value
          )
        }
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleCompare}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        {
          loading
          ? "Comparing..."
          : "Compare Videos"
        }
      </button>

    </div>
  );
}

export default CompareForm;