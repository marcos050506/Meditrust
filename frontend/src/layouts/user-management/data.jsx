
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";


// Images
import team2 from "assets/images/team-4.jpg";
import team3 from "assets/images/team-3.jpg";


export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Usuario", accessor: "user", width: "45%", align: "left" },
      { Header: "Correo", accessor: "email", align: "left" },
      { Header: "role", accessor: "role", align: "left" },
      { Header: "Fecha", accessor: "creationdate", align: "center" },
      { Header: "accion", accessor: "action", align: "center" },
    ],

    rows: [
      {
        user: <Author image={team2} name="Carlos Enrique Moreno" email="" />,
        role: <Job title="Admin" description="" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            admin@jsonapi.com
          </MDTypography>
        ),
        creationdate: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            22/11/2025
          </MDTypography>
        ),
        action: (
            <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" mr={2}>
                Editar
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                Eliminar
                </MDTypography>
            </MDBox>
        ),
      },
      {
        user: <Author image={team3} name="Yaisel Turcas Matos" email="" />,
        role: <Job title="Admin" description="" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            creator@material.com
          </MDTypography>
        ),
        creationdate: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
           22/11/2025
          </MDTypography>
        ),
        action: (
            <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" mr={2}>
                Editar
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                Eliminar
                </MDTypography>
            </MDBox>
        ),
      },
      
    ],
  };
}
