import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function History() {

  const [history,setHistory]=useState([]);
  const [loading,setLoading]=useState(true);

  const fetchHistory = async()=>{

    try{

      const res = await axios.get(
        `${BASE_URL}/history`,
        {
          withCredentials:true
        }
      );

      setHistory(res.data);

    }
    catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  };

  const deleteComparison =
  async(id)=>{

    try{

      await axios.delete(
        `${BASE_URL}/history/${id}`,
        {
          withCredentials:true
        }
      );

      setHistory(prev =>
        prev.filter(
          item => item._id !== id
        )
      );

      toast.success(
        "Deleted Successfully"
      );

    }
    catch(err){
      console.log(err);
      toast.error("Delete Failed");
    }
  };

  useEffect(()=>{
    fetchHistory();
  },[]);

  if(loading){
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Comparison History
      </h1>

      {
        history.length===0
        ?(
          <div className="bg-white p-10 rounded-xl shadow text-center">

            <h2 className="text-xl">
              No Comparisons Found
            </h2>

          </div>
        )
        :
        (
          <div className="grid gap-5">

            {
              history.map(item=>(
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-xl shadow flex justify-between"
                >

                  <div>

                    <h2 className="font-bold text-lg">
                      {item.title || "Comparison"}
                    </h2>

                    <p className="text-gray-500">
                      Similarity :
                      {" "}
                      {item.similarityScore}%
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <Link
                      to={`/history/${item._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      View
                    </Link>

                    <button
                      onClick={()=>
                        deleteComparison(
                          item._id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            }

          </div>
        )
      }

    </div>
  );
}

export default History;