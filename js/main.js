// Initialize Bootstrap components
document.addEventListener("DOMContentLoaded", () => {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
  
    // Initialize 3D Model Viewer
    initModelViewer()
  
    // Initialize Contact Form
    initContactForm()
  
    // Activate scrollspy
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
      target: "#navbar",
    })
  
    // Add active class to nav links based on scroll position
    updateNavActiveState()
    window.addEventListener("scroll", updateNavActiveState)
  
    // Initialize project file loading
    initProjectFileLoading()
  })
  
  // Update active state in navigation
  function updateNavActiveState() {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-link")
  
    let currentSection = ""
  
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
  
      if (window.pageYOffset >= sectionTop - 200) {
        currentSection = section.getAttribute("id")
      }
    })
  
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }
  
  // Modificar a função initProjectFileLoading para abrir o visualizador CAD
  function initProjectFileLoading() {
    // Get all project file buttons
    const projectFileButtons = document.querySelectorAll(".project-file-btn")
  
    projectFileButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
  
        const fileType = this.getAttribute("data-file-type")
        const filePath = this.getAttribute("data-file-path")
  
        if (fileType === "cad") {
          // Para arquivos CAD, redirecionamos para o visualizador CAD
          const projectName = filePath.split("/").pop().replace(".dwg", "")
          window.location.href = "cad-viewer.html?project=" + projectName
        } else if (fileType === "sketchup") {
          // Para arquivos SketchUp, mostramos uma mensagem no visualizador 3D
          loadProjectFile(filePath, fileType)
  
          // Scroll to model viewer
          document.querySelector("#model-viewer").scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        } else {
          // Para outros tipos de arquivo, podemos abrir em uma nova aba
          window.open(filePath, "_blank")
        }
      })
    })
  }
  
  // Load project file into 3D viewer
  function loadProjectFile(filePath, fileType) {
    // Show a message in the model viewer about the file
    const modelPlaceholder = document.getElementById("model-placeholder")
    const modelError = document.getElementById("model-error")
  
    if (modelPlaceholder) {
      modelPlaceholder.innerHTML = `
              <div class="text-center p-4">
                  <i class="bi bi-file-earmark-${fileType === "cad" ? "richtext" : "ruled"} fs-1 mb-3"></i>
                  <h5>Arquivo ${fileType === "cad" ? "CAD (.dwg)" : "SketchUp (.skp)"} selecionado</h5>
                  <p class="mb-3">Arquivo: ${filePath.split("/").pop()}</p>
                  <div class="alert alert-info">
                      <i class="bi bi-info-circle me-2"></i>
                      Para visualizar este arquivo, faça o download e abra-o no 
                      ${fileType === "cad" ? "AutoCAD" : "SketchUp"}.
                  </div>
                  <a href="${filePath}" download class="btn btn-primary mt-2">
                      <i class="bi bi-download me-2"></i>
                      Download do Arquivo
                  </a>
              </div>
          `
    }
  
    if (modelError) {
      modelError.textContent = ""
    }
  
    // You could also implement conversion to glTF for viewing in the 3D viewer
    // but that would require server-side processing which is beyond the scope here
  }
  
  // 3D Model Viewer
  function initModelViewer() {
    // DOM Elements
    const modelUpload = document.getElementById("model-upload")
    const modelContainer = document.getElementById("model-container")
    const modelPlaceholder = document.getElementById("model-placeholder")
    const modelLoading = document.getElementById("model-loading")
    const modelError = document.getElementById("model-error")
    const resetCameraBtn = document.getElementById("reset-camera")
    const zoomInBtn = document.getElementById("zoom-in")
    const zoomOutBtn = document.getElementById("zoom-out")
    const moveModelBtn = document.getElementById("move-model")
  
    // Three.js variables
    let scene, camera, renderer, controls, model
  
    // Check if Three.js is available
    if (!THREE) {
      console.error("Three.js is not loaded")
      return
    }
  
    // Initialize Three.js scene
    function initThreeJS() {
      // Create scene
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf5f5f5)
  
      // Create camera
      camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000)
      camera.position.z = 5
  
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight)
  
      // Add renderer to DOM
      modelContainer.appendChild(renderer.domElement)
  
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)
  
      // Add grid helper
      const gridHelper = new THREE.GridHelper(10, 10)
      scene.add(gridHelper)
  
      // Add orbit controls
      controls = new THREE.OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
  
      // Animation loop
      function animate() {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()
  
      // Handle window resize
      window.addEventListener("resize", onWindowResize)
    }
  
    // Handle window resize
    function onWindowResize() {
      if (!camera || !renderer || !modelContainer) return
  
      camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight)
    }
  
    // Handle file upload
    if (modelUpload) {
      modelUpload.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (!file) return
  
        const validTypes = [".glb", ".gltf", ".obj"]
        const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
  
        if (!validTypes.includes(fileExtension)) {
          modelError.textContent = "Formato de arquivo não suportado. Por favor, envie um arquivo .glb, .gltf ou .obj"
          return
        }
  
        // Initialize Three.js if not already initialized
        if (!scene) {
          initThreeJS()
        }
  
        loadModel(file)
      })
    }
  
    // Load 3D model
    function loadModel(file) {
      if (!scene) return
  
      // Show loading spinner
      modelPlaceholder.classList.add("d-none")
      modelLoading.classList.remove("d-none")
      modelError.textContent = ""
  
      // Clear previous model
      if (model) {
        scene.remove(model)
      }
  
      const fileURL = URL.createObjectURL(file)
      const loader = new THREE.GLTFLoader()
  
      loader.load(
        fileURL,
        (gltf) => {
          model = gltf.scene
  
          // Center model
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          model.position.sub(center)
  
          // Scale model to fit view
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          if (maxDim > 0) {
            const scale = 3 / maxDim
            model.scale.multiplyScalar(scale)
          }
  
          scene.add(model)
  
          // Enable controls
          resetCameraBtn.disabled = false
          zoomInBtn.disabled = false
          zoomOutBtn.disabled = false
          moveModelBtn.disabled = false
  
          // Hide loading spinner
          modelLoading.classList.add("d-none")
        },
        (xhr) => {
          // Progress
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
        },
        (error) => {
          console.error("Error loading model:", error)
          modelError.textContent = "Erro ao carregar o modelo. Verifique se o arquivo é válido."
          modelLoading.classList.add("d-none")
          modelPlaceholder.classList.remove("d-none")
        },
      )
    }
  
    // Reset camera position
    if (resetCameraBtn) {
      resetCameraBtn.addEventListener("click", () => {
        if (!camera || !controls) return
  
        camera.position.set(0, 0, 5)
        controls.reset()
      })
    }
  
    // Zoom in
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        if (!camera) return
  
        camera.position.z -= 0.5
      })
    }
  
    // Zoom out
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        if (!camera) return
  
        camera.position.z += 0.5
      })
    }
  
    // Toggle move mode
    if (moveModelBtn) {
      moveModelBtn.addEventListener("click", () => {
        if (!controls) return
  
        controls.enablePan = !controls.enablePan
        moveModelBtn.classList.toggle("active")
      })
    }
  }
  
  // Contact Form
  function initContactForm() {
    const contactForm = document.getElementById("contact-form")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form data
        const formData = new FormData(contactForm)
        const formValues = Object.fromEntries(formData.entries())
  
        // Here you would typically send the form data to a server
        // For this example, we'll just log it to the console
        console.log("Form submitted:", formValues)
  
        // Show success message (in a real application)
        alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
  
        // Reset form
        contactForm.reset()
      })
    }
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
  
      const targetId = this.getAttribute("href")
      if (targetId === "#") return
  
      const targetElement = document.querySelector(targetId)
  
      if (targetElement) {
        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse")
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse)
          bsCollapse.hide()
        }
  
        // Scroll to target with offset for fixed navbar
        const navbarHeight = document.querySelector(".navbar").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight
  
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
  
  // Adicionar código para verificar parâmetros de URL na página do visualizador CAD
  document.addEventListener("DOMContentLoaded", () => {
    // Verificar se estamos na página do visualizador CAD
    if (window.location.pathname.includes("cad-viewer.html")) {
      // Obter o parâmetro de projeto da URL
      const urlParams = new URLSearchParams(window.location.search)
      const projectParam = urlParams.get("project")
  
      // Se temos um parâmetro de projeto, podemos usá-lo para carregar o projeto específico
      if (projectParam) {
        console.log("Projeto a ser carregado:", projectParam)
        // O código em cad-viewer.js lidará com o carregamento do projeto
      }
    }
  })
  
  