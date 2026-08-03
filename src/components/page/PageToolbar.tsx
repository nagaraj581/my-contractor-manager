import "./PageToolbar.css";

export default function PageToolbar({
    children,
}:{
    children:React.ReactNode;
}){

    return(

        <div className="page-toolbar">

            {children}

        </div>

    );

}
