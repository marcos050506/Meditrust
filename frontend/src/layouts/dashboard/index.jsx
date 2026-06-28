import { useEffect, useState } from "react";
import { fetchDashboardData } from "services/dashboardService";

// @mui material components
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

// Material Dashboard 2 React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };
    loadData();
  }, []);

  // 1. Obtener configuración de gráficos (Eje X = Meses)
  const getChartConfig = (conceptName) => {
    if (!dashboardData || !dashboardData[conceptName]) {
      return { labels: [], datasets: { label: conceptName, data: [] } };
    }
    const records = dashboardData[conceptName];
    return {
      // Mapea los meses directamente desde Neo4j para el eje X
      labels: records.map((r) => r.mes), 
      datasets: { 
        label: "Cantidad", 
        data: records.map((r) => r.valor) 
      },
    };
  };

  // 2. Obtener datos detallados para las tarjetas (Valor + Mes/Año)
  const getCardInfo = (conceptName) => {
    if (!dashboardData || !dashboardData[conceptName] || dashboardData[conceptName].length === 0) {
      return { value: "0", date: "Sin datos" };
    }
    
    // Obtenemos el último registro (el más reciente según el ORDER BY de Python)
    const records = dashboardData[conceptName];
    const lastRecord = records[records.length - 1];
    
    return {
      value: lastRecord.valor.toString(),
      // Formateamos el mes y año para la tarjeta
      date: `${lastRecord.mes} ${lastRecord.anio}`
    };
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* TARJETAS CON MES ACTUALIZABLE */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Consultas Médicas"
                count={getCardInfo("CONSULTA MEDICINA").value}
                percentage={{ 
                  color: "success", 
                  amount: "", 
                  label: `Mes: ${getCardInfo("CONSULTA MEDICINA").date}` 
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Consultorios (CMF)"
                count={getCardInfo("CMF").value}
                percentage={{ 
                  color: "success", 
                  label: `Cierre: ${getCardInfo("CMF").date}` 
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Altas Hogar"
                count={getCardInfo("ALTA INGRESO  HOGAR").value}
                percentage={{ 
                  color: "success", 
                  label: `Mes: ${getCardInfo("ALTA INGRESO  HOGAR").date}` 
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Ingresos Hogar"
                count={getCardInfo("INGRESO HOGAR").value}
                percentage={{ 
                  color: "success", 
                  label: `Mes: ${getCardInfo("INGRESO HOGAR").date}` 
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* GRÁFICOS CON EJES DE MESES DINÁMICOS */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="SÍNDROME FEBRIL"
                  description="Evolución de casos por mes"
                  date={`Último reporte: ${getCardInfo("SÍNDROME FEBRIL").date}`}
                  chart={getChartConfig("SÍNDROME FEBRIL")}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="RIESGO PRECONCEPCIONAL"
                  description="Seguimiento mensual"
                  date={`Último reporte: ${getCardInfo("RIESGO PRECONCEPCIONAL").date}`}
                  chart={getChartConfig("RIESGO PRECONCEPCIONAL")}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="MUJER EDAD FERTIL"
                  description="Control de población"
                  date={`Último reporte: ${getCardInfo("MUJER EDAD FERTIL").date}`}
                  chart={getChartConfig("MUJER EDAD FERTIL")}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;