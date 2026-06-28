import React, { useState } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Grid, Card, Divider, CircularProgress, Switch, FormControlLabel, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function SmartwatchView() {
  const [isManual, setIsManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({ nombre: "", edad: "" });
  const [metrics, setMetrics] = useState({ oxigeno: "", frecuencia: "", presion: "" });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in userData) setUserData({ ...userData, [name]: value });
    else setMetrics({ ...metrics, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      setError(null);
    }
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const processAnalysis = async () => {
    if (!isManual && selectedFiles.length === 0) {
      setError("Sube al menos una imagen o usa el modo manual.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const ahora = new Date();
    const displayTime = `${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`;
    const isoString = ahora.toISOString();

    const formData = new FormData();
    
    // Campos EXACTOS que pide tu backend
    formData.append("user_id", userData.nombre || "Desconocido");
    formData.append("timestamp", isoString);

    if (isManual) {
      formData.append("command", "ANALISIS_MANUAL");
      formData.append("description", `Modo Manual. Oxígeno: ${metrics.oxigeno}%, Frecuencia: ${metrics.frecuencia} BPM, Presión: ${metrics.presion}`);
      // Archivo señuelo para que FastAPI no lance error 422
      const fakeImage = new File(["dummy_pixel"], "manual.png", { type: "image/png" });
      formData.append("image", fakeImage);
    } else {
      formData.append("command", "EXTRAER_DATOS_VISION");
      formData.append("description", `Análisis de imagen. Paciente de ${userData.edad} años.`);
      formData.append("image", selectedFiles[0]); // El backend solo procesa uno en la función actual
    }

    try {
      // CAMBIO: Ahora apuntamos a /extract-vision en lugar de /process
const response = await axios.post("http://localhost:8001/process", formData);

      setResult({
        ...response.data,
        fecha_mostrada: displayTime
      });
    } catch (err) {
      console.error("Error en petición:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") setError(detail);
      else if (Array.isArray(detail)) setError(`Falta el campo: ${detail[0].loc[1]}`);
      else setError("Error de conexión. Asegúrate de que el backend FastAPI esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* PANEL IZQUIERDO: FORMULARIO */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h5" fontWeight="medium">Panel Médico</MDTypography>
              <MDBox mt={2} display="flex" flexDirection="column" gap={2}>
                <MDInput label="Paciente" name="nombre" value={userData.nombre} onChange={handleInputChange} fullWidth />
                <MDInput label="Edad" name="edad" type="number" onChange={handleInputChange} fullWidth />
              </MDBox>

              <Divider sx={{ my: 3 }} />

              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h6">Captura de Datos</MDTypography>
                <FormControlLabel
                  control={<Switch checked={isManual} onChange={() => setIsManual(!isManual)} />}
                  label="Modo Manual"
                />
              </MDBox>

              {isManual ? (
                <MDBox display="flex" flexDirection="column" gap={2}>
                  <MDInput label="Oxígeno (%)" name="oxigeno" onChange={handleInputChange} fullWidth />
                  <MDInput label="Frecuencia (BPM)" name="frecuencia" onChange={handleInputChange} fullWidth />
                  <MDInput label="Presión Arterial" name="presion" onChange={handleInputChange} fullWidth />
                </MDBox>
              ) : (
                <MDBox>
                  <MDBox 
                    sx={{ border: "2px dashed #ccc", borderRadius: "10px", p: 3, textAlign: "center", cursor: "pointer", bgcolor: "#fafafa" }}
                    onClick={() => document.getElementById("multiInput").click()}
                  >
                    <MDTypography variant="button" color="secondary">Clic para subir imagen del reloj</MDTypography>
                    <input id="multiInput" type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
                  </MDBox>
                  
                  <Grid container spacing={1} mt={2}>
                    {previews.map((src, index) => (
                      <Grid item xs={4} key={`img-${index}`} position="relative">
                        <img src={src} alt="preview" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                        <IconButton 
                          size="small" 
                          sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        >
                          <DeleteIcon fontSize="inherit" color="error" />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
              )}

              <MDBox mt={4}>
                <MDButton variant="gradient" color="info" fullWidth onClick={processAnalysis} disabled={loading}>
                  {loading ? <CircularProgress color="inherit" size={20} /> : "Analizar Datos"}
                </MDButton>
                {error && <MDAlert color="error" sx={{ mt: 2 }}>{error}</MDAlert>}
              </MDBox>
            </Card>
          </Grid>

          {/* PANEL DERECHO: RESULTADO */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, height: "100%" }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h5" fontWeight="medium">Informe de Riesgo</MDTypography>
                {result && <MDTypography variant="caption" color="text">{result.fecha_mostrada}</MDTypography>}
              </MDBox>
              <Divider />
              {result ? (
                <MDBox>
                  <MDAlert color={result.success ? "success" : "warning"}>
                    {result.success ? "Procesamiento completado" : "Hubo un problema al procesar"}
                  </MDAlert>
                  <MDBox p={2} mt={2} bgcolor="#f8f9fa" borderRadius="lg">
                    <MDTypography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {typeof result.extracted_data === 'object' 
                        ? JSON.stringify(result.extracted_data, null, 2) 
                        : result.extracted_data}
                    </MDTypography>
                  </MDBox>
                  {result.inference_time_ms > 0 && (
                    <MDTypography variant="caption" color="text" display="block" mt={2}>
                      Tiempo de procesamiento: {result.inference_time_ms} ms
                    </MDTypography>
                  )}
                </MDBox>
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
                  <MDTypography color="text" variant="h6" sx={{ opacity: 0.5 }}>Esperando envío de datos...</MDTypography>
                </MDBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SmartwatchView;