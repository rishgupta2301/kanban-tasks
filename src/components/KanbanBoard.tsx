import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {

    const [columns, setColumns] = useState<Column[]>([])
    console.log(columns)

    function generateId(){
        return Math.floor(Math.random() * 10001);
    }


    function createColumn(){
        const columnToAdd:Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }

        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id:Id){
        setColumns(columns.filter((col) => col.id !== id));
    }

  return (
    <div className="flex min-h-screen m-auto w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">
                {columns.map((col) => (
                        <div><ColumnContainer deleteColumn={deleteColumn} column={col} /></div>
                ))}
            </div>
      <button onClick={() => createColumn()} className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-[#0D1117] border-2 border-[#161C22] p-4 ring-rose-400 hover:ring-2 flex gap-2">
        <PlusIcon />
        Add Column
      </button>
        </div>
    </div>
  );
}

export default KanbanBoard;
