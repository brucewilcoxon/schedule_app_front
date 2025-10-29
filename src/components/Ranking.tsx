import React from "react";

const Ranking = () => {
  return (
    <div>
      <table className="w-full">
        <thead className="bg-cream-white">
          <tr className="border-custom-gray border-y-2">
            <th className=" text-center">順位</th>
            <th className=" text-center">名前</th>
            <th className=" text-center">回数</th>
          </tr>
        </thead>
        <tbody className=" text-center">
          <tr className="border-custom-gray border-y-2  ">
            <td className=" text-center p-2">1位</td>
            <td className=" text-center p-2">山田脩太</td>
            <td className=" text-center p-2">11回</td>
          </tr>
          <tr className="border-custom-gray border-y-2  ">
            <td className=" text-center p-2">2位</td>
            <td className=" text-center p-2">副島朝水</td>
            <td className=" text-center p-2">8回</td>
          </tr>
          <tr className="border-custom-gray border-y-2  ">
            <td className=" text-center p-2">3位</td>
            <td className=" text-center p-2">福岡裕輝</td>
            <td className=" text-center p-2">5回</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
