import {
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

function SimilarityChart({ score }) {

  const data = [
    {
      name: "Similar",
      value: score,
    },
    {
      name: "Different",
      value: 100 - score,
    },
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        outerRadius={100}
      >
        <Cell />
        <Cell />
      </Pie>

      <Tooltip />
    </PieChart>
  );
}

export default SimilarityChart;