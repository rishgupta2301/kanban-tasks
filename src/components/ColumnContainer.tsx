import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void; //we are going to receive it from kanbanBoard as a property
  updateColumn: (id: Id, title:string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks } = props;
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
      disabled: editMode,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if(isDragging){
    return <div ref={setNodeRef} style={style}  className="bg-[#161C22] w-[300px] h-[500px] max-h-[400px] rounded-md flex flex-col opacity-40 border-2 border-rose-500 " >
        
    </div>
  }



  return (
    <div ref={setNodeRef} style={style} className="bg-[#161C22] w-[300px] h-[500px] max-h-[400px] rounded-md flex flex-col">
      <div {...attributes} {...listeners} onClick={() => setEditMode(true)}  className=" flex items-center justify-between bg-[#0D1117] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-3">
        <div className="flex">
          <div className="flex justify-center items-center bg-[#161C22] px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && <input className="bg-black focus:border-rose-500 border rounded outline-none px-2"
          value={column.title}
          onChange={e => updateColumn(column.id, e.target.value)}
          autoFocus onBlur={() => {
            setEditMode(false)
          }}  
          onKeyDown={e => {
            if(e.key !== 'Enter')return;
            setEditMode(false);
          }}

          />}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="cursor-pointer stroke-gray-500 hover:stroke-white hover:bg-[#161C22] rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto overflow-x-hidden">{tasks.map((task) => {
        return (
            <TaskCard key={task.id} task={task} />
        )
      })}</div>
      <button className="flex gap-2 items-center border-[#161C22] border-2 rounded-md p-4 border-x-[#161C22] hover:text-rose-500 active:bg-black"
      onClick={() => createTask(column.id)}
      >  
        <PlusIcon /> 
         Add task
         </button>
    </div>
  );
}

export default ColumnContainer;
