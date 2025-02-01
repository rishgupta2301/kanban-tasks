import TrashIcon from "../icons/TrashIcon"
import { Task } from "../types"

interface Props{
    task: Task,
}

function TaskCard({task}: Props) {
  return (
    <div className="bg-[#0D1117] p-2 h-[70px] min-h-[70px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500  cursor-grab relative">
      {task.content}
      <button className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-[#161C22] p-2 rounded "><TrashIcon /></button>
    </div>
  )
}

export default TaskCard
