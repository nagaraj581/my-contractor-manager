import type { ProjectMaterial }
from "../../models/ProjectMaterial";

import "./ProjectMaterialsCard.css";

interface Props {
    materials: ProjectMaterial[];
    onEdit?: (item: ProjectMaterial) => void;
    onDelete?: (id: string) => void;
}



export default function ProjectMaterialsCard({
    materials,
    onEdit,
    onDelete,
}: Props) {

    const total = materials.reduce(

        (sum, item) => sum + item.amount,

        0

    );

    return (

        <div className="project-material-card">

            <div className="section-header">

                <h2>Materials</h2>

                <strong>

                    Rs. {total.toFixed(2)}

                </strong>

            </div>

            {materials.length === 0 ? (

                <div className="empty-state">

                    No materials added.

                </div>

            ) : (

                <table>

                    <thead>

                        <tr>

                            <th>Description</th>

                            <th>Qty</th>

                            <th>Rate</th>

                            <th>Supplier</th>

                            <th>Amount</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {materials.map(item => (

                            <tr key={item.id}>

                                <td>{item.description}</td>

                                <td>{item.quantity}</td>

                                <td>Rs. {item.rate}</td>

                                <td>{item.supplier}</td>

                                <td>
    Rs. {item.amount}
</td>

<td
    style={{
        whiteSpace: "nowrap",
    }}
>
    <button
        type="button"
        style={{
            marginRight: 8,
            cursor: "pointer",
        }}
        onClick={() => onEdit?.(item)}
    >
        ✏️
    </button>

    <button
        type="button"
        style={{
            cursor: "pointer",
        }}
        onClick={() => onDelete?.(item.id)}
    >
        🗑
    </button>
</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>

    );

}