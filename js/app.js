/* global mapboxgl, _, utils, themes, sourceID */
'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
    const debugInfo = document.getElementById('debug-info');

    mapboxgl.accessToken = 'pk.eyJ1IjoiZG1jY2FyZXkiLCJhIjoiRl9FV3ZXNCJ9.l1rdsm-F9Vwzcimtf1qMHg';
    
    // Exibir informações de depuração
    function showDebugInfo(message) {
        if (debugInfo) {
            debugInfo.style.display = 'block';
            debugInfo.innerHTML += message + '<br>';
        }
        console.log(message);
    }
    
    // Depurar para fins de desenvolvimento
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
    
    if (isDev) {
        showDebugInfo('Modo de depuração ativado');
    }
    
    // Carregar o estilo
    fetch('/js/style_hard.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o estilo: ' + response.status);
            }
            return response.json();
        })
        .then(style => {
            loader.style.display = 'none';
            
            if (isDev) {
                showDebugInfo(`Estilo carregado. Camadas: ${style.layers ? style.layers.length : 0}`);
            }
            
            // Filtrar estilo se necessário
            if (typeof themes !== 'undefined') {
                style = utils.generateStyleFromTags(style, themes);
                if (isDev) {
                    showDebugInfo(`Estilo filtrado por temas: ${themes}`);
                }
            } else if (typeof sourceID !== 'undefined') {
                style = utils.generateStyleFromSourceID(style, sourceID);
                if (isDev) {
                    showDebugInfo(`Estilo filtrado por fonte: ${sourceID}`);
                }
            }

            if (isDev) {
                showDebugInfo(`Camadas após filtro: ${style.layers ? style.layers.length : 0}`);
            }

            const activeLayers = [];
            let featureHover = true;
            const menuSources = document.querySelector('.menu-sources');

            // Adicionar camadas ao menu
            style.layers.forEach(function(layer) {
                if (!layer.title) {
                    layer.title = layer.id; // Garantir que todas as camadas tenham um título
                }
                const menuItem = document.createElement('li');
                menuItem.innerHTML = `<a class="dropdown-item active" href="${layer.id}">${layer.title}</a>`;
                menuSources.appendChild(menuItem);
                activeLayers.push(layer.id);
                
                if (isDev) {
                    showDebugInfo(`Camada adicionada ao menu: ${layer.id}`);
                }
            });

            // Inicializar o mapa
            const map = new mapboxgl.Map({
                container: 'map',
                style: style,
                center: [20, -20],
                zoom: 2
            });

            // Adicionar controles de navegação
            map.addControl(new mapboxgl.NavigationControl());

            // Verificar se todas as camadas foram carregadas corretamente
            map.on('load', function() {
                if (isDev) {
                    showDebugInfo('Mapa carregado');
                }
                
                // Filtrar apenas as camadas que realmente existem no mapa
                const existingLayers = activeLayers.filter(layerId => {
                    try {
                        const exists = map.getLayer(layerId) !== undefined;
                        if (!exists && isDev) {
                            showDebugInfo(`Camada ausente: ${layerId}`);
                        }
                        return exists;
                    } catch (e) {
                        console.warn(`Camada ${layerId} não está disponível no mapa.`);
                        if (isDev) {
                            showDebugInfo(`Erro na camada ${layerId}: ${e.message}`);
                        }
                        return false;
                    }
                });
                
                // Atualizar a lista de camadas ativas
                activeLayers.length = 0;
                existingLayers.forEach(layer => activeLayers.push(layer));
                
                if (isDev) {
                    showDebugInfo(`Camadas ativas após verificação: ${activeLayers.length}`);
                    activeLayers.forEach(layer => {
                        showDebugInfo(`- ${layer}`);
                    });
                }
            });

            // Mostrar informações ao passar o mouse
            map.on('mousemove', function(e) {
                const features = document.getElementById('features');
                features.style.display = 'none';

                // Verificar quais camadas realmente existem no mapa antes de consultar
                const validLayers = activeLayers.filter(layerId => {
                    try {
                        return map.getLayer(layerId) !== undefined;
                    } catch (e) {
                        return false;
                    }
                });

                // Só consulta features se houver camadas válidas
                if (validLayers.length > 0) {
                    const targetFeatures = map.queryRenderedFeatures(e.point, {
                        layers: validLayers
                    });

                    // Verificar se existem features
                    if (targetFeatures && targetFeatures.length > 0) {
                        const feature = targetFeatures[0];
                        const layerId = feature.layer.id;
                        let title = layerId;

                        // Encontrar o título da camada
                        style.layers.forEach(function(layer) {
                            if (layer.id === layerId) {
                                title = layer.title || layer.id;
                            }
                        });

                        if (layerId) {
                            features.style.display = 'block';
                            features.innerHTML = title + '<br><a class="btn btn-primary btn-sm" href="/' + layerId + '">Ver fonte</a>';
                        }
                    }
                }
            });

            // Atualizar posição do balão de informações
            document.getElementById('map').addEventListener('mousemove', function(e) {
                if (featureHover) {
                    const features = document.getElementById('features');
                    features.style.left = e.pageX + 'px';
                    features.style.top = e.pageY + 'px';
                }
            });

            // Travar/destravar o balão de informações
            map.on('click', function() {
                featureHover = !featureHover;
            });

            // Alternar camadas
            document.addEventListener('click', function(e) {
                if (e.target.closest('.menu-sources a')) {
                    e.preventDefault();
                    const link = e.target.closest('.menu-sources a');
                    const id = link.getAttribute('href');
                    const index = activeLayers.indexOf(id);

                    if (index > -1) {
                        try {
                            // Verificar se a camada existe antes de tentar ocultá-la
                            if (map.getLayer(id)) {
                                map.setLayoutProperty(id, 'visibility', 'none');
                            }
                            activeLayers.splice(index, 1);
                            link.classList.remove('active');
                        } catch (e) {
                            console.warn(`Erro ao ocultar a camada ${id}:`, e);
                        }
                    } else {
                        style.layers.forEach(function(layer) {
                            if (layer.id === id) {
                                try {
                                    if (!map.getLayer(id)) {
                                        map.addLayer(layer);
                                    } else {
                                        map.setLayoutProperty(id, 'visibility', 'visible');
                                    }
                                    activeLayers.push(id);
                                    link.classList.add('active');
                                } catch (e) {
                                    console.error(`Erro ao adicionar a camada ${id}:`, e);
                                }
                            }
                        });
                    }
                }
            });

            // Evento para alternar depuração
            if (isDev) {
                document.addEventListener('keydown', function(e) {
                    // Pressionar 'D' para limpar e alternar exibição de depuração
                    if (e.key === 'd' || e.key === 'D') {
                        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
                        if (debugInfo.style.display === 'block') {
                            debugInfo.innerHTML = 'Depuração reativada<br>';
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o estilo:', error);
            loader.style.display = 'none';
            alert('Erro ao carregar o mapa. Por favor, tente novamente mais tarde.');
            if (isDev) {
                showDebugInfo(`ERRO: ${error.message}`);
            }
        });
});
