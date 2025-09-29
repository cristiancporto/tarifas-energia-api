[![Deploy Render](https://img.shields.io/badge/online-tarifas__energia__api-4caf50?style=flat-square)](https://tarifas-energia-api.onrender.com)

# ⚡️ API de Tarifas de Energia Elétrica - Brasil (Versão Pública)

API pública voltada para consumidores comuns e integração com sensores de medição (ESP32, SCT-013, Shelly, Sonoff etc.) para estimar o consumo em R$ com base em tarifas, bandeiras e impostos regionais.

---

## 🔗 Endpoints disponíveis (uso comum)

### ✅ Status da API
GET /distribuidoras/status

### ✅ Bandeira tarifária vigente
GET /distribuidoras/bandeira/atual

### ✅ Lista de distribuidoras (cache ANEEL)
GET /distribuidoras/cache

### ✅ Lista de distribuidoras por filtros (case insensitive, busca igualdade dos valores)
GET /distribuidoras/filtro
Query:
- somenteVigentes - `true` ou `false` (opcional, padrão `false`), filtra somente tarifas vigentes no momento se `true`
- nome - nome da distribuidora
- modalidade - modalidade da tarifa (`Convencional`, `Convencional pré-pagamento`, `Branca`...)
- subgrupo - `B1`, `B2`, `A4`...
- subclasse - `Baixa renda`, `Residencial`...
- detalhe - Campo vazio em maioria, mas indica por exemplo se for tarifa de SCEE (Sistema de Compensação de Energia Elétrica) se estiver como `SCEE`.

### ✅ Lista de slugs válidos
GET /distribuidoras/slugs

### ✅ Lista selecionável (nome + slug)
GET /distribuidoras/selecionaveis

### ✅ Buscar por nome (ex: ?nome=neoenergia)
GET /distribuidoras/buscar?nome=XXX

### ✅ Buscar por estado (UF)
GET /distribuidoras/estado/DF

### ✅ Projeção de custo em R$
POST /distribuidoras/projecao

### ✅ Projeção de custo em R$

Body JSON:
{
  "consumo_kwh": 100,
  "distribuidora_slug": "neoenergia-braslia"
}

### ✅ Carregar cache manualmente
GET /carregar-cache

---

## ⚙️ Requisitos para rodar localmente

git clone https://github.com/mpfarias/tarifas-energia-api.git
cd tarifas-energia-api
npm install
node index.js

---

## 📌 Observações

- Essa versão não acessa o CSV da ANEEL em tempo real por questões de estabilidade
- Para empresas ou usos técnicos, uma versão empresarial será lançada em breve com recursos extras

---

## 📄 Licença

MIT — Livre para uso e modificação com créditos.

---

Feito com 💡 por @mpfarias