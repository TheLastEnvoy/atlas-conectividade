#Diretrizes de contribuição

## Contribuindo com Dados
Este é um projeto de dados colaborativo. Contamos com contribuições de dados abertos para sermos mais completos e atualizados.

### Adicionando Fontes de Dados
Se você conhece bem o GitHub e o Mapbox, pode contribuir com dados adicionais diretamente. Os mapas são servidos via [mapbox-gl.js](https://github.com/mapbox/mapbox-gl-js/). Fontes de dados adicionais podem ser adicionadas criando um item na coleção Sources e atualizando o front matter [YAML](http://jekyllrb.com/docs/frontmatter/).
- Os nomes dos arquivos de origem devem corresponder ao ID da fonte.
- Estilos vetoriais específicos para a fonte devem ser incluídos.
- A source-url deve ser a localização do conjunto de tiles vetoriais.

```
title: US Natural Gas
attribution: EIA
attribution-url: http://www.eia.gov/maps/layer_info-m.cfm
id: NaturalGas_InterIntrastate_Pipelines_US
source-url: mapbox://mappingfuture.b2hs38fr
layer: NaturalGas_InterIntrastate_Pipelines_US
tags:
  - line
themes: oil
line-color: '#c7125a'
line-width: 0.8
```

### Sugerindo fontes de dados
Se você tem dados para contribuir, mas não pode adicioná-los diretamente, [crie uma issue](https://github.com/developmentseed/connectivity-atlas/issues) no repositório do projeto com um link para o conjunto de dados e o máximo de descrição possível. Por favor, rotule as issues como `data sources`.

## Outras formas de contribuir
Existem muitas outras maneiras de contribuir para um projeto, abaixo estão alguns exemplos:

- Relate bugs, ideias, solicitações de recursos [criando issues](https://github.com/developmentseed/connectivity-atlas/issues) no repositório do projeto.
- Faça um fork do código e experimente-o, independentemente de você optar por fazer um pull request posteriormente ou não.
- Crie pull requests de alterações que você acha que são louváveis. De erros de digitação a grandes falhas de design, você encontrará um ambiente rico em oportunidades para melhorias.

## Estilo
Não há um estilo definido para este projeto, mas tente combinar os estilos de codificação existentes o mais próximo possível.
