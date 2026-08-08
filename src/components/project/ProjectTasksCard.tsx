import { useState } from "react";

import "./ProjectTasksCard.css";

interface Props{

    tasks:{
        id:string;
        title:string;
        completed:boolean;
    }[];

    onAdd(title:string):void;

    onToggle(id:string,value:boolean):void;

    onDelete(id:string):void;

}

export default function ProjectTasksCard({

    tasks,

    onAdd,

    onToggle,

    onDelete,

}:Props){

    const[newTask,setNewTask]=
        useState("");

    return(

        <div className="project-tasks-card">

            <h3>

                Project Tasks

            </h3>

            <div className="project-task-add">

                <input

                    value={newTask}

                    placeholder="New Task..."

                    onChange={e=>

                        setNewTask(e.target.value)

                    }

                />

                <button

                    onClick={()=>{

                        if(!newTask.trim()) return;

                        onAdd(newTask);

                        setNewTask("");

                    }}

                >

                    Add

                </button>

            </div>

            {tasks.length===0&&(

<div
style={{
    color:"#888",
    padding:"20px 0",
}}
>

No tasks added yet.

</div>

            )}

            {tasks.map(task=>(

                <div

                    key={task.id}

                    className="project-task"

                >

                    <input

                        type="checkbox"

                        checked={task.completed}

                        onChange={e=>

                            onToggle(

                                task.id,

                                e.target.checked

                            )

                        }

                    />

                    <span>

                        {task.title}

                    </span>

                    <button

                        onClick={()=>

                            onDelete(task.id)

                        }

                    >

                        ✕

                    </button>

                </div>

            ))}

        </div>

    );

}