import "./SearchBox.css";

interface Props{

    value:string;

    onChange:(value:string)=>void;

}

export default function SearchBox({

    value,

    onChange,

}:Props){

    return(

        <input

            className="search-box"

            placeholder="🔍 Search..."

            value={value}

            onChange={e=>onChange(e.target.value)}

        />

    );

}
