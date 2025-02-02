import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  console.log(columns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 300px
      },
    })
  );

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function createColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((t) => t.columnId !== id)); // deleting tasks of this column
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }

  function createTask(columnId: Id) {
    const newTask:Task = {
        id: generateId(),
        columnId,
        content: `Task ${tasks.length + 1}`
    }
    setTasks([...tasks, newTask]);
  }
  
  function deleteTask(id: Id){
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function updateTask(id: Id, content:string){
    const newTasks = tasks.map((task) => {
        if(task.id !== id)return task;
        return {...task, content }
    })
    setTasks(newTasks);
  }

  function onDragStart(event: DragStartEvent) {
    console.log("DRAG START", event);
    if (event.active.data.current?.column) {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.task) {
      setActiveTask(event.active.data.current.task);
      return;
    }
}

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return; // this means we are not over the valid element/column

    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent){
    const { active, over } = event;
    if (!over) return; // this means we are not over the valid element/column

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task'; // checking if the current active is task or column
    const isOverATask = over.data.current?.type === 'Task';  //// checking if the over is task or column

    if(!isActiveATask)return;

    // dropping a task over another task
    if(isActiveATask && isOverATask){
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            tasks[activeIndex].columnId = tasks[overIndex].columnId // if dragging the task over another column

            return arrayMove(tasks, activeIndex, overIndex);
        })
    }

    const isOverAColumn = over.data.current?.type === "Column";
    // dropping a task over a column
    if(isActiveATask && isOverAColumn){
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);

            tasks[activeIndex].columnId = overId// if dragging the task over another column

            return arrayMove(tasks, activeIndex, activeIndex); //triggering re-rendering as i am creating a new array
        })
    }
  }

  return (
    <div className="flex min-h-screen m-auto w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <div>
                  <ColumnContainer
                    key={col.id}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    column={col}
                    tasks = {tasks.filter((task) => task.columnId === col.id)}
                  />
                </div>
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createColumn()}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-[#0D1117] border-2 border-[#161C22] p-4 ring-rose-400 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks = {tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
