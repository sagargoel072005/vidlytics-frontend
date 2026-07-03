import axios from "axios";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

function ComparisonDetails(){

  const { id } = useParams();

  const [data,setData] =
  useState(null);

  const fetchComparison =
  async()=>{

    try{

      const res =
      await axios.get(
        `${BASE_URL}/history/${id}`,
        {
          withCredentials:true
        }
      );

      setData(res.data);

    }
    catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchComparison();
  },[]);

  if(!data){
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">

      <div className="bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Comparison Details
        </h1>

        <p>
          Similarity:
          {" "}
          {data.similarityScore}%
        </p>

        <h2 className="font-bold mt-5">
          Summary
        </h2>

        <p>
          {data.summary}
        </p>

      </div>

    </div>
  );
}

export default ComparisonDetails;