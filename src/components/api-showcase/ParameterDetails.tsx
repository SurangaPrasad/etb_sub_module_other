// ParameterDetails.js
import { AiOutlineControl } from "react-icons/ai";

const ParameterDetails = ({
  params,
}: {
  params: { name: string; type: string; description: string }[];
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <AiOutlineControl className="text-brand" size={20} />
        <h3 className="font-bold text-lg">Parameters</h3>
      </div>
      <table className="table-auto w-full align-top">
        <tbody>
          {params.map((param) => (
            <Row param={param} key={param.name} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParameterDetails;

const Row = ({
  param,
}: {
  param: { name: string; type: string; description: string };
}) => {
  return (
    <tr className="hover:bg-black-200/50 transition-colors duration-200">
      <td className="p-4 align-top">
        <code className="border border-black-100 rounded px-2 py-1.5 text-black-900 text-sm">
          {param.name}
        </code>
      </td>
      <td className="p-4 text-primary-gray align-top">{param.type}</td>
      <td className="p-4 text-black-900 align-top">{param.description}</td>
    </tr>
  );
};
