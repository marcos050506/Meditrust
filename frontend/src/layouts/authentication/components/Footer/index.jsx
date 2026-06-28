// Librería para validación de tipos de props
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;
  const { pathname } = useLocation();

  return (
    // Footer vacío, sin enlaces ni componentes visuales
    <footer
      style={{
        width: "100%",
        position: pathname !== "/auth/login" ? "absolute" : "relative",
        bottom: 0,
        padding: "1rem",
        textAlign: "center",
        fontSize: size.sm,
        color: light ? "white" : "#333",
      }}
    >
      {/* Aquí puedes agregar texto si deseas */}
      © {new Date().getFullYear()} Sistema Médico — Todos los derechos reservados
    </footer>
  );
}

// Props por defecto
Footer.defaultProps = {
  light: false,
};

// Validación de tipos
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
