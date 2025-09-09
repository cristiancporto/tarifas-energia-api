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

Body JSON:
{
  "consumoKwh": 100,
  "distribuidoraSlug": "neoenergia-braslia"
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