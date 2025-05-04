# ⚡ API Brasileira de Tarifas de Energia Elétrica

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)

API pública, simples e funcional, desenvolvida para permitir que cidadãos e empresas possam consultar dados reais sobre tarifas de energia elétrica no Brasil, de forma confiável e direta.

## 🚀 Visão Geral
Esta API consulta dados da ANEEL (Agência Nacional de Energia Elétrica), realiza projeções de consumo, aplica bandeiras tarifárias vigentes e permite buscas inteligentes por distribuidoras.

## 🔗 Base de dados
- **Fonte**: CSV oficial da ANEEL
- **Atualização**: leitura direta do link oficial da ANEEL
- **Bandeiras tarifárias**: atualizadas mensalmente via tabela interna

## 🧪 Endpoints disponíveis

### `GET /distribuidoras/status`
Retorna status da API.
```json
{
  "sucesso": true,
  "dados": {
    "status": "ok",
    "versao": "1.0.0"
  }
}
```

### `GET /distribuidoras/cache`
Lista distribuidoras residenciais (filtradas da ANEEL).

### `GET /distribuidoras/slugs`
Lista todos os slugs válidos para consulta.

### `GET /distribuidoras/buscar?nome=CEB`
Busca por nome aproximado.

### `GET /distribuidoras/bandeira/atual`
Retorna a bandeira tarifária vigente no mês atual.

### `GET /distribuidoras/estado/:uf`
Filtra distribuidoras por estado (UF).

### `GET /distribuidoras/selecionaveis`
Retorna nomes e slugs ideais para seleção em interfaces.

### `GET /distribuidoras/dinamico`
Consulta dados em tempo real via CSV da ANEEL (uso avançado).

### `GET /distribuidoras/atualizar/csv-url`
Retorna o link direto do CSV da ANEEL.

### `POST /distribuidoras/projecao`
Projeção de custo com base no consumo informado.

**Body:**
```json
{
  "consumo_kwh": 100,
  "distribuidora_slug": "neoenergia-braslia"
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "distribuidora": "NEOENERGIA BRASILIA",
    "consumo_kwh": 100,
    "tarifa_kwh": 0.784,
    "bandeira": "amarela",
    "adicional_bandeira": 0.01874,
    "valor_estimado": 80.27
  }
}
```

---

## ⚙️ Como rodar localmente

```bash
npm install
npm start
```

A API rodará por padrão em:
```
http://localhost:3000
```

## 🛡️ Licença

Este projeto está licenciado sob a licença MIT. Sinta-se livre para usar, contribuir e compartilhar.

## 🤝 Contribuição

Pull requests são bem-vindos! Sugestões de melhoria, correções e novos recursos que mantenham a simplicidade do projeto são bem-vindos.

---

© 2025 - API Brasileira de Tarifas de Energia Elétrica
