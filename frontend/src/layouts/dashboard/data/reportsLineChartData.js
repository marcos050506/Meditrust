export const buildLineChartData = (dashboardData, concepto) => {
  if (!dashboardData[concepto]) return null;

  const labels = dashboardData[concepto].map(
    (item) => ${item.mes}/${item.anio}
  );

  const values = dashboardData[concepto].map(
    (item) => item.valor
  );

  return {
    labels,
    datasets: { label: concepto, data: values },
  };
};