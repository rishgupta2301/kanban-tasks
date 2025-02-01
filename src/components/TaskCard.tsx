import { useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { Id, Task } from "../types"

interface Props{
    task: Task,
    deleteTask: (id: Id) => void,
    updateTask: (id:Id, content:string) => void,

}

function TaskCard({task, deleteTask, updateTask}: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setMouseIsOver(false); // delete icon not be shown while editing
    }

    if(editMode){
        return <div className="bg-[#0D1117] p-2 h-[70px] min-h-[70px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500  cursor-grab relative" >
        <textarea className="bg-[#0D1117] h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none" value={task.content} autoFocus placeholder="Task content here.." onBlur={toggleEditMode}
        onKeyDown={(e) => {
            if(e.key === 'Enter' && e.shiftKey){
                toggleEditMode();
            }
        }}
        onChange={(e) => updateTask(task.id, e.target.value ) }
        name="" id=""></textarea>
      </div>
    }

  return (
    <div onClick={toggleEditMode} className="bg-[#0D1117] p-2 h-[70px] min-h-[70px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500  cursor-grab relative" onMouseEnter={() => setMouseIsOver(true)} onMouseLeave={() => setMouseIsOver(false)} >
      {task.content}
      {mouseIsOver && <button onClick={() => deleteTask(task.id)} className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-[#161C22] p-2 rounded opacity-60 hover:opacity-100"><TrashIcon /></button>}
    </div>
  )
}

export default TaskCard
