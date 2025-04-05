import axios from "axios";
import getConfig from "../../utils/getConfig";

export const getDepartments = (setDepartments) => {
    axios
        .get(
            `${import.meta.env.VITE_API_SERVER}/api/v1/departments`,
            getConfig()
        )
        .then((response) => {
            setDepartments(response.data);
            checkDefaultDepartment(response.data);
        })
        .catch((error) =>
            console.error("Error cargando los departamentos:", error)
        );
};

const checkDefaultDepartment = (departments) => {
    const defaultDepartment = JSON.parse(
        localStorage.getItem("defaultDepartment")
    );

    if (!defaultDepartment) {
        showDepartmentSelectionAlert(departments);
    }
};
