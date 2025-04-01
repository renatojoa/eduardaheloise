"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, RotateCw, ZoomIn, ZoomOut, Move } from "lucide-react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export function ModelViewer() {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

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
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controlsRef.current = controls

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const validTypes = [".glb", ".gltf", ".obj"]
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase()

    if (!validTypes.includes(fileExtension)) {
      setError("Formato de arquivo não suportado. Por favor, envie um arquivo .glb, .gltf ou .obj")
      return
    }

    setFile(selectedFile)
    loadModel(selectedFile)
  }

  // Load 3D model
  const loadModel = (file) => {
    if (!sceneRef.current) return

    setIsLoading(true)
    setError("")

    // Clear previous model
    sceneRef.current.children.forEach((child) => {
      if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
        sceneRef.current.remove(child)
      }
    })

    const fileURL = URL.createObjectURL(file)
    const loader = new GLTFLoader()

    loader.load(
      fileURL,
      (gltf) => {
        const model = gltf.scene

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

        sceneRef.current.add(model)
        setIsLoading(false)
      },
      (xhr) => {
        // Progress
      },
      (error) => {
        console.error("Error loading model:", error)
        setError("Erro ao carregar o modelo. Verifique se o arquivo é válido.")
        setIsLoading(false)
      },
    )
  }

  // Reset camera position
  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return

    cameraRef.current.position.set(0, 0, 5)
    controlsRef.current.reset()
  }

  return (
    <section id="model-viewer" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Visualizador de Projetos 3D</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Faça upload de seus arquivos AutoCAD ou SketchUp para visualizar seus projetos em 3D.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="model-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-gray-500">Formatos suportados: GLB, GLTF, OBJ</p>
                  </div>
                  <input
                    id="model-upload"
                    type="file"
                    className="hidden"
                    accept=".glb,.gltf,.obj"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <div ref={containerRef} className="w-full h-[400px] bg-gray-100 rounded-lg relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}

              {!file && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Faça upload de um modelo 3D para visualizá-lo aqui</p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-4 gap-2">
              <Button variant="outline" size="sm" onClick={resetCamera} disabled={!file}>
                <RotateCw className="w-4 h-4 mr-2" />
                Resetar Câmera
              </Button>
              <Button variant="outline" size="sm" disabled={!file}>
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm" disabled={!file}>
                <ZoomOut className="w-4 h-4 mr-2" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm" disabled={!file}>
                <Move className="w-4 h-4 mr-2" />
                Mover
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

