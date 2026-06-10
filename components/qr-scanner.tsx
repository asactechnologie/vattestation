"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Html5Qrcode, type CameraDevice } from "html5-qrcode"
import { Camera, RefreshCw, AlertCircle, Video, Info } from "lucide-react"

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (errorMessage: string) => void
}

export function QrScanner({ onScanSuccess, onScanError }: QrScannerProps) {
  const { t } = useTranslation()
  const [cameras, setCameras] = useState<CameraDevice[]>([])
  const [activeCameraId, setActiveCameraId] = useState<string>("")
  const [scannerError, setScannerError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const elementId = "qr-reader-element"

  // Load cameras on mount
  useEffect(() => {
    let isMounted = true

    async function initializeCameras() {
      try {
        setIsInitializing(true)
        setScannerError(null)

        // Try to get cameras (triggers browser permission request)
        const devices = await Html5Qrcode.getCameras()
        
        if (!isMounted) return

        if (devices && devices.length > 0) {
          setCameras(devices)
          // Default to environment (back) camera if available, otherwise first camera
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes("back") || 
            device.label.toLowerCase().includes("environment") ||
            device.label.toLowerCase().includes("arrière")
          )
          const defaultCameraId = backCamera ? backCamera.id : devices[0].id
          setActiveCameraId(defaultCameraId)
          setPermissionDenied(false)
        } else {
          setScannerError("No cameras found.")
        }
      } catch (err: any) {
        console.error("Error getting cameras:", err)
        if (isMounted) {
          // Typically means permission was denied
          setPermissionDenied(true)
          setScannerError(t("scanner.permissionInfo"))
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false)
        }
      }
    }

    // Delay camera initialization slightly to allow the DOM node to fully mount
    const timer = setTimeout(() => {
      initializeCameras()
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(timer)
      // Camera stop is handled in the scanner-active effect cleanup below to avoid concurrent stops
    }
  }, [t])

  // Manage starting and stopping scanner based on active camera
  useEffect(() => {
    if (isInitializing || permissionDenied || !activeCameraId) return

    let isMounted = true
    let scannerInstance: Html5Qrcode | null = null

    async function startScanning() {
      try {
        setScannerError(null)
        setIsScanning(false)

        // Create or reuse scanner
        if (!scannerRef.current) {
          scannerInstance = new Html5Qrcode(elementId)
          scannerRef.current = scannerInstance
        } else {
          scannerInstance = scannerRef.current
        }

        // If it is already scanning, stop it first
        if (scannerInstance.isScanning) {
          try {
            await scannerInstance.stop()
          } catch (stopErr: any) {
            console.warn("Pre-start camera stop warning:", stopErr)
          }
        }

        if (!isMounted) return

        await scannerInstance.start(
          activeCameraId,
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.7
              return { width: Math.max(200, size), height: Math.max(200, size) }
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isMounted) {
              onScanSuccess(decodedText)
            }
          },
          (errorMessage) => {
            // Ignore frame scan errors
          }
        )

        if (isMounted) {
          setIsScanning(true)
        }
      } catch (err: any) {
        console.error("Failed to start scanning:", err)
        const errMsg = err?.toString() || ""
        if (isMounted) {
          // If it is transition related, ignore it as it will resolve
          if (!errMsg.includes("already under transition") && !errMsg.includes("is transitioning")) {
            setScannerError(err.message || t("scanner.scanError"))
            setIsScanning(false)
          }
        }
      }
    }

    startScanning()

    return () => {
      isMounted = false
      if (scannerInstance && scannerInstance.isScanning) {
        scannerInstance.stop()
          .then(() => {
            if (scannerRef.current === scannerInstance) {
              setIsScanning(false)
            }
          })
          .catch(err => {
            const errMsg = err?.toString() || ""
            if (!errMsg.includes("already under transition") && !errMsg.includes("is transitioning")) {
              console.error("Failed to stop scanning in cleanup:", err)
            }
          })
      }
    }
  }, [activeCameraId, isInitializing, permissionDenied, onScanSuccess, onScanError, t])

  // Switch camera handle
  const handleCameraChange = (cameraId: string) => {
    setActiveCameraId(cameraId)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4">
      {/* Header Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          {t("scanner.title")}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 px-4">
          {t("scanner.description")}
        </p>
      </div>

      {/* Camera Viewport Wrapper */}
      <div className="relative w-full aspect-square max-w-[340px] rounded-2xl overflow-hidden bg-slate-950/90 dark:bg-black border-2 border-primary/20 shadow-inner flex items-center justify-center group">
        {/* Scanner Viewport Div for html5-qrcode */}
        <div id={elementId} className="w-full h-full object-cover [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />

        {/* Custom Overlays when scanning */}
        {isScanning && (
          <>
            {/* Pulsing Scanning Box Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[70%] h-[70%] border-2 border-dashed border-primary/60 rounded-xl relative shadow-[0_0_20px_rgba(10,86,140,0.15)]">
                {/* Scanner corners */}
                <div className="absolute -top-[2px] -left-[2px] w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-md" />
                <div className="absolute -top-[2px] -right-[2px] w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-md" />
                <div className="absolute -bottom-[2px] -left-[2px] w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-md" />
                <div className="absolute -bottom-[2px] -right-[2px] w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-md" />

                {/* Laser Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_#0a568c] animate-scan-laser" />
              </div>
            </div>
          </>
        )}

        {/* Loading / Error States overlay */}
        {(isInitializing || !isScanning || scannerError) && (
          <div className="absolute inset-0 bg-slate-950/80 dark:bg-black/80 flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-10">
            {isInitializing ? (
              <>
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium">{t("scanner.initializing")}</p>
              </>
            ) : permissionDenied ? (
              <>
                <AlertCircle className="w-10 h-10 text-destructive animate-pulse" />
                <p className="text-sm font-semibold text-destructive">{t("scanner.requestPermission")}</p>
                <p className="text-xs text-slate-300 max-w-[240px] leading-relaxed">
                  {t("scanner.permissionInfo")}
                </p>
              </>
            ) : scannerError ? (
              <>
                <AlertCircle className="w-10 h-10 text-yellow-500" />
                <p className="text-sm font-medium text-yellow-500">Camera Status</p>
                <p className="text-xs text-slate-300 max-w-[240px] leading-relaxed">
                  {scannerError}
                </p>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Controls & Camera Switcher */}
      {cameras.length > 1 && isScanning && (
        <div className="flex items-center justify-center gap-2 w-full px-4">
          <label htmlFor="camera-select" className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 font-medium">
            <Video className="w-3.5 h-3.5" />
            {t("scanner.selectCamera")}:
          </label>
          <select
            id="camera-select"
            className="text-xs bg-card text-card-foreground border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-[200px] shadow-sm cursor-pointer"
            value={activeCameraId}
            onChange={(e) => handleCameraChange(e.target.value)}
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Small info notice */}
      <div className="flex items-start gap-2 bg-slate-500/5 dark:bg-slate-400/5 border border-border p-3 rounded-xl max-w-[340px] w-full">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-normal">
          {t("scanner.fallbackManual")}
        </p>
      </div>
    </div>
  )
}
