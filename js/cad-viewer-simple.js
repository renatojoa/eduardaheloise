// Variáveis globais
let viewer;
let currentUrn = '';
let currentProjectName = 'eduardaview';
let currentProjectFile = '';

// Mapeamento de projetos
const projectFiles = {
    'apartamento_contemporaneo': {
        name: 'Apartamento Contemporâneo',
        file: 'assets/project/cad/FabioeCecilia.dwg',
        // Em um ambiente real, você teria o URN do modelo convertido
        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAyLTIzLTE5LTM3LTQ2LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL2xhZHkucGRm'
    },
    'escritorio_corporativo': {
        name: 'Escritório Corporativo',
        file: 'assets/project/cad/escritorio_corporativo.dwg',
        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAyLTIzLTE5LTM3LTQ2LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL2xhZHkucGRm'
    },
    'casa_praia': {
        name: 'Casa de Praia',
        file: 'assets/project/cad/casa_praia.dwg',
        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAyLTIzLTE5LTM3LTQ2LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL2xhZHkucGRm'
    },
    'cafe_boutique': {
        name: 'Café Boutique',
        file: 'assets/project/cad/cafe_boutique.dwg',
        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAyLTIzLTE5LTM3LTQ2LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL2xhZHkucGRm'
    },
    'loft_industrial': {
        name: 'Loft Industrial',
        file: 'assets/project/cad/loft_industrial.dwg',
        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAyLTIzLTE5LTM3LTQ2LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL2xhZHkucGRm'
    },
    'clinica_estetica': {
        name: 'Clínica Estética',
        file: 'assets/project/cad/clinica_estetica.dwg',
        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAyLTIzLTE5LTM3LTQ2LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL2xhZHkucGRm'
    }
};

// Elementos DOM
const forgeViewer = document.getElementById('forgeViewer');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const currentProjectNameElement = document.getElementById('current-project-name');
const projectListItems = document.querySelectorAll('#project-list a');
const downloadButton = document.getElementById('download-cad');
const uploadForm = document.getElementById('upload-form');
const uploadStatus = document.getElementById('upload-status');

// Botões de controle
const homeViewButton = document.getElementById('home-view');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const orbitModeButton = document.getElementById('orbit-mode');
const panModeButton = document.getElementById('pan-mode');
const toggleWireframeCheckbox = document.getElementById('toggle-wireframe');
const toggleGridCheckbox = document.getElementById('toggle-grid');

// Inicializar o visualizador quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeViewer();
    setupEventListeners();
});

// Inicializar o visualizador Autodesk
function initializeViewer() {
    // Mostrar carregando
    showLoading(true);
    hideError();
    
    // Opções do visualizador
    const options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2',
        getAccessToken: function(onTokenReady) {
            // Em um ambiente real, você obteria o token do seu servidor
            fetch('/api/forge/token')
                .then(response => response.json())
                .then(data => {
                    onTokenReady(data.access_token, data.expires_in);
                })
                .catch(error => {
                    console.error('Erro ao obter token:', error);
                    // Para demonstração, use um token fictício
                    const token = {
                        access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJidWNrZXQ6cmVhZCIsImJ1Y2tldDpjcmVhdGUiXSwiY2xpZW50X2lkIjoiWW91ckNsaWVudElkIiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiUmFuZG9tSWQiLCJleHAiOjE3MTcwMDAwMDB9.Yx-E4JXb0JBwZvEYYJ_lfA9ZYGgNi-suGhJMEZPQUmA',
                        expires_in: 3600
                    };
                    onTokenReady(token.access_token, token.expires_in);
                    showError('Usando token de demonstração. Para uso real, configure o servidor de autenticação.');
                });
        }
    };
    
    // Inicializar o visualizador
    Autodesk.Viewing.Initializer(options, function() {
        // Criar o visualizador
        viewer = new Autodesk.Viewing.GuiViewer3D(forgeViewer, { 
            extensions: ['Autodesk.DocumentBrowser']
        });
        
        // Iniciar o visualizador
        viewer.start();
        
        // Verificar parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const projectParam = urlParams.get('project');
        
        if (projectParam && projectFiles[projectParam]) {
            loadProject(projectParam);
        } else {
            // Carregar o primeiro projeto como padrão
            const firstProject = Object.keys(projectFiles)[0];
            loadProject(firstProject);
        }
        
        // Configurar eventos do visualizador
        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded);
        viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionChanged);
    });
}

// Carregar um projeto específico
function loadProject(projectKey) {
    if (!projectFiles[projectKey]) {
        showError('Projeto não encontrado.');
        return;
    }
    
    // Atualizar variáveis globais
    currentProjectName = projectFiles[projectKey].name;
    currentProjectFile = projectFiles[projectKey].file;
    currentUrn = projectFiles[projectKey].urn;
    
    // Atualizar a interface
    currentProjectNameElement.textContent = currentProjectName;
    
    // Mostrar carregando
    showLoading(true);
    hideError();
    
    // Carregar o modelo
    loadModelByUrn(currentUrn);
}

// Carregar modelo pelo URN
function loadModelByUrn(urn) {
    if (!viewer) {
        showError('Visualizador não inicializado.');
        return;
    }
    
    const documentId = 'urn:' + urn;
    
    Autodesk.Viewing.Document.load(
        documentId,
        function(doc) {
            // Sucesso
            const viewables = doc.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(doc, viewables);
        },
        function(error) {
            // Erro
            console.error('Erro ao carregar documento:', error);
            showError('Falha ao carregar o modelo: ' + error.toString());
            showLoading(false);
        }
    );
}

// Evento quando o modelo é carregado
function onModelLoaded() {
    console.log('Modelo carregado com sucesso');
    showLoading(false);
    
    // Ativar controles
    enableControls(true);
}

// Evento quando a seleção muda
function onSelectionChanged() {
    const selection = viewer.getSelection();
    console.log('Seleção alterada:', selection);
}

// Configurar event listeners
function setupEventListeners() {
    // Eventos para seleção de projeto
    projectListItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const projectKey = this.getAttribute('data-project');
            loadProject(projectKey);
        });
    });
    
    // Evento de download
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            if (currentProjectFile) {
                // Em um ambiente real, você redirecionaria para o arquivo real
                alert('Em uma implementação real, este botão faria o download do arquivo ' + currentProjectFile);
            }
        });
    }
    
    // Eventos dos botões de controle
    if (homeViewButton) {
        homeViewButton.addEventListener('click', function() {
            if (viewer) viewer.setViewMode(Autodesk.Viewing.ViewHelper.ViewMode.HOME);
        });
    }
    
    if (zoomInButton) {
        zoomInButton.addEventListener('click', function() {
            if (viewer) viewer.navigation.setZoomDelta(25);
        });
    }
    
    if (zoomOutButton) {
        zoomOutButton.addEventListener('click', function() {
            if (viewer) viewer.navigation.setZoomDelta(-25);
        });
    }
    
    if (orbitModeButton) {
        orbitModeButton.addEventListener('click', function() {
            if (viewer) viewer.setNavigationMode(Autodesk.Viewing.NavigationMode.ORBIT);
        });
    }
    
    if (panModeButton) {
        panModeButton.addEventListener('click', function() {
            if (viewer) viewer.setNavigationMode(Autodesk.Viewing.NavigationMode.PAN);
        });
    }
    
    if (toggleWireframeCheckbox) {
        toggleWireframeCheckbox.addEventListener('change', function() {
            if (viewer) {
                if (this.checked) {
                    viewer.setDisplayStyle(Autodesk.Viewing.DisplayStyle.WIREFRAME);
                } else {
                    viewer.setDisplayStyle(Autodesk.Viewing.DisplayStyle.SHADED);
                }
            }
        });
    }
    
    if (toggleGridCheckbox) {
        toggleGridCheckbox.addEventListener('change', function() {
            if (viewer) {
                viewer.setGroundShadow(this.checked);
                viewer.setGroundReflection(this.checked);
            }
        });
    }
    
    // Evento de upload de arquivo
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('file-upload');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Por favor, selecione um arquivo.');
                return;
            }
            
            // Mostrar status
            uploadStatus.innerHTML = `
                <div class="alert alert-info">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Enviando arquivo e iniciando conversão...
                </div>
            `;
            uploadStatus.style.display = 'block';
            
            // Criar FormData
            const formData = new FormData();
            formData.append('fileToUpload', file);
            
            try {
                // Enviar arquivo
                const response = await fetch('/api/forge/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Erro ao enviar arquivo');
                }
                
                // Mostrar sucesso
                uploadStatus.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Sucesso!</strong> Arquivo enviado e conversão iniciada.
                        <div class="mt-2">URN: ${data.urn}</div>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-primary check-status" data-urn="${data.urn}">
                                Verificar Status da Conversão
                            </button>
                        </div>
                    </div>
                `;
                
                // Adicionar evento para verificar status
                document.querySelector('.check-status').addEventListener('click', function() {
                    const urn = this.getAttribute('data-urn');
                    checkConversionStatus(urn);
                });
            } catch (error) {
                console.error('Erro:', error);
                uploadStatus.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>Erro!</strong> ${error.message}
                    </div>
                `;
            }
        });
    }
}

// Função para verificar status da conversão
async function checkConversionStatus(urn) {
    try {
        const statusElement = document.getElementById('upload-status');
        
        statusElement.innerHTML = `
            <div class="alert alert-info">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Verificando status da conversão...
            </div>
        `;
        
        const response = await fetch(`/api/forge/status/${urn}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao verificar status');
        }
        
        // Verificar status
        if (data.status === 'success') {
            statusElement.innerHTML = `
                <div class="alert alert-success">
                    <strong>Sucesso!</strong> Conversão concluída.
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary load-model" data-urn="${urn}">
                            Carregar Modelo
                        </button>
                    </div>
                </div>
            `;
            
            // Adicionar evento para carregar modelo
            document.querySelector('.load-model').addEventListener('click', function() {
                const urn = this.getAttribute('data-urn');
                loadModelByUrn(urn);
            });
        } else if (data.status === 'pending' || data.status === 'inprogress') {
            statusElement.innerHTML = `
                <div class="alert alert-warning">
                    <strong>Em andamento!</strong> A conversão ainda está em andamento.
                    <div class="progress mt-2">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary check-status" data-urn="${urn}">
                            Verificar Novamente
                        </button>
                    </div>
                </div>
            `;
            
            // Adicionar evento para verificar status novamente
            document.querySelector('.check-status').addEventListener('click', function() {
                const urn = this.getAttribute('data-urn');
                checkConversionStatus(urn);
            });
        } else {
            statusElement.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Erro!</strong> Falha na conversão.
                    <div class="mt-2">Status: ${data.status}</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('upload-status').innerHTML = `
            <div class="alert alert-danger">
                <strong>Erro!</strong> ${error.message}
            </div>
        `;
    }
}

// Habilitar/desabilitar controles
function enableControls(enable) {
    const buttons = [
        homeViewButton, zoomInButton, zoomOutButton, 
        orbitModeButton, panModeButton
    ];
    
    buttons.forEach(button => {
        if (button) button.disabled = !enable;
    });
    
    if (toggleWireframeCheckbox) toggleWireframeCheckbox.disabled = !enable;
    if (toggleGridCheckbox) toggleGridCheckbox.disabled = !enable;
}

// Mostrar/ocultar indicador de carregamento
function showLoading(show) {
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// Mostrar mensagem de erro
function showError(message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    showLoading(false);
}

// Ocultar mensagem de erro
function hideError() {
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}