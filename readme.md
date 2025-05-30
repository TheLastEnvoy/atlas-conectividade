# Disponível em :<https://thelastenvoy.github.io/atlas-conectividade/>

# Atlas de Conectividade

🚨 Este repositório não possui atualmente um mantenedor. Entre em contato com [@developmentseed](https://github.com/developmentseed/) se tiver alguma dúvida.

### Contribuindo:

Por favor, consulte [contributing.md](https://github.com/developmentseed/connectivity-atlas/blob/develop/contributing.md) para diretrizes sobre como contribuir. Todos os Pull Requests devem ser feitos contra o branch `develop`.

### Instalação:

- Instale o [Bundler](http://bundler.io/)
- `$ bundle install` (isso instalará o Jekyll e outras bibliotecas necessárias para o site)

### Servindo o site localmente:

`$ bundle exec jekyll serve --baseurl '' -w` -- isso reconstrói o site sempre que uma alteração é feita, você precisará recarregar

### Implantação:

O site é servido via GitHub Pages com base no conteúdo do branch `gh-pages`.


### Fontes de dados:

Os mapas são servidos via [mapbox-gl.js](https://github.com/mapbox/mapbox-gl-js/). Fontes de dados adicionais podem ser adicionadas criando um item na coleção Sources e atualizando o front matter [YAML](http://jekyllrb.com/docs/frontmatter/).
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
