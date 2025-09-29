export const listarBandeirasPorFiltro = (req, res) => {
  const somenteVigentes = req.query.somenteVigentes?.toLowerCase().trim() === "true" ? true : false;
  const bandeira = req.query.bandeira?.toLowerCase().trim();

  const resultados = global.cachedBandeiras.filter((b => {
    let isMatch = true;

    if (somenteVigentes) {
      let dateParts = b.competencia.split("-");
      let anoCompetencia = dateParts[0];
      let mesCompetencia = dateParts[1];

      let now = new Date();
      let anoAgora = now.getFullYear();
      let mesAgora = now.getMonth() + 1;

      isMatch &&= anoAgora == anoCompetencia && mesAgora == mesCompetencia;
    }

    if (bandeira)
      isMatch &&= b.bandeira.toLowerCase() == bandeira;

    return isMatch;
  })).sort((a, b) => {
    if(a.competencia < b.competencia)
      return 1;
    if(a.competencia > b.competencia)
      return -1;
    return 0;
  });

  if (!resultados.length) {
    return res.status(404).json({ sucesso: false, erro: 'Nenhuma bandeira encontrada.' });
  }

  res.json({ sucesso: true, dados: resultados });
};