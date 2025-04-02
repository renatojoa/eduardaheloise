// CAD Viewer JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Variáveis globais
    let viewer = null
    let currentProjectName = ""
    let currentProjectFile = ""
  
    // Elementos DOM
    const cadContainer = document.getElementById("cad-container")
    const cadLoading = document.getElementById("cad-loading")
    const cadError = document.getElementById("cad-error")
    const cadErrorMessage = document.getElementById("cad-error-message")
    const currentProjectNameElement = document.getElementById("current-project-name")
    const projectListItems = document.querySelectorAll("#project-list a")
    const downloadButton = document.getElementById("download-cad")
    const layerSelector = document.getElementById("layer-selector")
    const toggleGrid = document.getElementById("toggle-grid")
  
    // Botões de navegação
    const zoomInButton = document.getElementById("zoom-in-cad")
    const zoomOutButton = document.getElementById("zoom-out-cad")
    const panButton = document.getElementById("pan-cad")
    const fitToViewButton = document.getElementById("fit-to-view-cad")
    const resetViewButton = document.getElementById("reset-view-cad")
  
    // Mapeamento de nomes de projetos para arquivos
    const projectFiles = {
      apartamento_contemporaneo: {
        name: "Apartamento Contemporâneo",
        file: "assets/project/cad/FabioeCecilia.dwg",
      },
      escritorio_corporativo: {
        name: "Escritório Corporativo",
        file: "assets/project/cad/escritorio_corporativo.dwg",
      },
      casa_praia: {
        name: "Casa de Praia",
        file: "assets/project/cad/casa_praia.dwg",
      },
      cafe_boutique: {
        name: "Café Boutique",
        file: "assets/project/cad/cafe_boutique.dwg",
      },
      loft_industrial: {
        name: "Loft Industrial",
        file: "assets/project/cad/loft_industrial.dwg",
      },
      clinica_estetica: {
        name: "Clínica Estética",
        file: "assets/project/cad/clinica_estetica.dwg",
      },
    }
  
    // Inicializar o visualizador
    function initializeViewer() {
      // Verificar se a API do Forge Viewer está disponível
      if (!window.Autodesk) {
        showError("A biblioteca do visualizador CAD não foi carregada corretamente. Por favor, recarregue a página.")
        return
      }
  
      // Opções do visualizador
      const options = {
        env: "Local",
        api: "derivativeV2",
        getAccessToken: (onTokenReady) => {
          // Para uma implementação completa, você precisaria de um servidor para gerar tokens
          // Esta é uma implementação simplificada para demonstração
          const token = {
            access_token: "dummy_token",
            expires_in: 3600,
          }
          onTokenReady(token)
        },
      }
  
      // Inicializar o visualizador
      Autodesk.Viewing.Initializer(options, () => {
        const config = {
          extensions: ["Autodesk.CADViewer"],
        }
  
        // Criar o visualizador
        viewer = new Autodesk.Viewing.GuiViewer3D(cadContainer, config)
  
        // Iniciar o visualizador
        viewer.start()
  
        // Carregar o modelo padrão
        loadDefaultProject()
  
        // Mostrar o container do visualizador
        cadContainer.classList.remove("d-none")
        cadLoading.classList.add("d-none")
  
        // Configurar eventos do visualizador
        setupViewerEvents()
      })
    }
  
    // Carregar o projeto padrão
    function loadDefaultProject() {
      // Carregar o primeiro projeto da lista
      const firstProject = projectListItems[0].getAttribute("data-project")
      loadProject(firstProject)
    }
  
    // Carregar um projeto específico
    function loadProject(projectKey) {
      if (!projectFiles[projectKey]) {
        showError("Projeto não encontrado.")
        return
      }
  
      // Atualizar variáveis globais
      currentProjectName = projectFiles[projectKey].name
      currentProjectFile = projectFiles[projectKey].file
  
      // Atualizar a interface
      currentProjectNameElement.textContent = currentProjectName
  
      // Mostrar carregando
      cadContainer.classList.add("d-none")
      cadLoading.classList.remove("d-none")
      cadError.classList.add("d-none")
  
      // Em uma implementação real, você carregaria o arquivo DWG aqui
      // Para esta demonstração, vamos simular o carregamento
      simulateLoadingDWG(currentProjectFile)
    }
  
    // Simular o carregamento de um arquivo DWG
    // Em uma implementação real, você usaria a API do Forge para converter e carregar o DWG
    function simulateLoadingDWG(filePath) {
      // Simular um tempo de carregamento
      setTimeout(() => {
        // Simular um modelo carregado
        const dummyUrn = "urn:dummy:" + filePath
  
        // Em uma implementação real, você carregaria o modelo com:
        // viewer.loadModel(documentId);
  
        // Para esta demonstração, vamos apenas mostrar o visualizador vazio
        cadContainer.classList.remove("d-none")
        cadLoading.classList.add("d-none")
  
        // Simular camadas disponíveis
        populateLayerSelector(["Paredes", "Portas", "Janelas", "Mobiliário", "Cotas", "Textos"])
  
        // Mostrar mensagem informativa
        showNotification(
          "Para uma implementação completa, você precisaria configurar o Autodesk APS (antigo Forge) para converter e visualizar arquivos DWG.",
        )
      }, 2000)
    }
  
    // Mostrar erro
    function showError(message) {
      cadLoading.classList.add("d-none")
      cadError.classList.remove("d-none")
      cadErrorMessage.textContent = message
    }
  
    // Mostrar notificação
    function showNotification(message) {
      // Criar elemento de notificação
      const notification = document.createElement("div")
      notification.className = "alert alert-info alert-dismissible fade show"
      notification.innerHTML = `
              <i class="bi bi-info-circle me-2"></i>
              ${message}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          `
  
      // Adicionar ao container
      const container = document.querySelector(".container")
      container.insertBefore(notification, container.firstChild)
  
      // Auto-remover após 10 segundos
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          notification.remove()
        }, 150)
      }, 10000)
    }
  
    // Configurar eventos do visualizador
    function setupViewerEvents() {
      // Eventos dos botões de navegação
      if (zoomInButton) {
        zoomInButton.addEventListener("click", () => {
          if (viewer) {
            viewer.navigation.setZoomDelta(25)
          }
        })
      }
  
      if (zoomOutButton) {
        zoomOutButton.addEventListener("click", () => {
          if (viewer) {
            viewer.navigation.setZoomDelta(-25)
          }
        })
      }
  
      if (panButton) {
        panButton.addEventListener("click", () => {
          if (viewer) {
            viewer.setNavigationMode(1) // Pan mode
          }
        })
      }
  
      if (fitToViewButton) {
        fitToViewButton.addEventListener("click", () => {
          if (viewer) {
            viewer.fitToView()
          }
        })
      }
  
      if (resetViewButton) {
        resetViewButton.addEventListener("click", () => {
          if (viewer) {
            viewer.navigation.setPosition(new Autodesk.Viewing.THREE.Vector3(0, 0, 0))
            viewer.navigation.setTarget(new Autodesk.Viewing.THREE.Vector3(0, 0, 0))
          }
        })
      }
  
      // Evento de toggle grid
      if (toggleGrid) {
        toggleGrid.addEventListener("change", function () {
          if (viewer) {
            viewer.setGroundShadow(this.checked)
            viewer.setGroundReflection(this.checked)
          }
        })
      }
    }
  
    // Preencher o seletor de camadas
    function populateLayerSelector(layers) {
      if (!layerSelector) return
  
      // Limpar opções existentes
      layerSelector.innerHTML = ""
  
      // Adicionar novas opções
      layers.forEach((layer) => {
        const option = document.createElement("option")
        option.value = layer
        option.textContent = layer
        option.selected = true
        layerSelector.appendChild(option)
      })
  
      // Adicionar evento de alteração
      layerSelector.addEventListener("change", function () {
        // Em uma implementação real, você alteraria a visibilidade das camadas aqui
        console.log(
          "Camadas selecionadas:",
          Array.from(this.selectedOptions).map((opt) => opt.value),
        )
      })
    }
  
    // Configurar eventos de clique para seleção de projeto
    projectListItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault()
        const projectKey = this.getAttribute("data-project")
        loadProject(projectKey)
      })
    })
  
    // Configurar evento de download
    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        if (currentProjectFile) {
          // Em uma implementação real, você redirecionaria para o arquivo real
          // Para esta demonstração, apenas mostramos uma mensagem
          showNotification("Em uma implementação real, este botão faria o download do arquivo " + currentProjectFile)
        }
      })
    }
  
    // Inicializar o visualizador quando a página carregar
    initializeViewer()
  })
  
  