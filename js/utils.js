/* global _ */
const utils = {};

(function() {
  'use strict';

  /**
   * Constrói um novo estilo a partir de tags
   * @param {Object} style Objeto de estilo original
   * @param {String} themes String de temas separados por vírgula
   * @return {Object} Novo objeto de estilo filtrado
   */
  utils.generateStyleFromTags = function(style, themes) {
    // Converter temas em array
    const themesArray = utils.getThemesArray(themes);
    
    // Clonar o estilo original
    const newStyle = {...style};
    
    // Filtrar fontes
    const filteredSources = {};
    Object.entries(style.sources).forEach(([key, source]) => {
      if (source.themes && utils.getThemesArray(source.themes).some(theme => themesArray.includes(theme))) {
        filteredSources[key] = {...source};
      }
    });
    newStyle.sources = filteredSources;
    
    // Filtrar camadas
    newStyle.layers = style.layers.filter(layer => {
      return layer.themes && utils.getThemesArray(layer.themes).some(theme => themesArray.includes(theme));
    });
    
    return newStyle;
  };

  /**
   * Constrói um novo estilo a partir de uma fonte específica
   * @param {Object} style Objeto de estilo original
   * @param {String} sourceID ID da fonte
   * @return {Object} Novo objeto de estilo filtrado
   */
  utils.generateStyleFromSourceID = function(style, sourceID) {
    // Clonar o estilo original
    const newStyle = {...style};
    
    // Filtrar fontes
    if (style.sources[sourceID]) {
      newStyle.sources = {
        [sourceID]: {...style.sources[sourceID]}
      };
    } else {
      newStyle.sources = {};
    }
    
    // Filtrar camadas
    newStyle.layers = style.layers.filter(layer => layer.id === sourceID);
    
    return newStyle;
  };

  /**
   * Converte uma string de temas em um array
   * @param {String} themes String de temas separados por vírgula
   * @return {Array} Array de temas
   */
  utils.getThemesArray = function(themes) {
    if (!themes) return [];
    return themes.split(',').map(theme => theme.trim());
  };
})();
