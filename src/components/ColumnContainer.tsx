import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id:Id) => void;  //we are going to receive it from kanbanBoard as a property
}

function ColumnContainer(props: Props) {

  const { column, deleteColumn } = props;
  return (
    <div className="bg-[#161C22] w-[300px] h-[500px] max-h-[400px] rounded-md flex flex-col">
      <div className=" flex items-center justify-between bg-[#0D1117] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-3">
        <div className="flex">
          <div className="flex justify-center items-center bg-[#161C22] px-2 py-1 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        <button 
        onClick={() => deleteColumn(column.id)}
        className="cursor-pointer stroke-gray-500 hover:stroke-white hover:bg-[#161C22] rounded px-1 py-2"><TrashIcon /></button>
      </div>
      <div className="flex flex-grow">Content</div>
      <div>Footer</div>
    </div>
  );
}

export default ColumnContainer;
