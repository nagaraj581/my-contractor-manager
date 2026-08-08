import "./ProjectStatsCard.css";

interface Props{

    title:string;

    value:string|number;

}

export default function ProjectStatsCard({

    title,

    value,

}:Props){

    return(

        <div className="project-stats-card">

            <small>

                {title}

            </small>

            <h2>

                {value}

            </h2>

        </div>

    );

}