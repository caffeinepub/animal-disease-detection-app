import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, X, RefreshCw, Loader2, AlertCircle, SwitchCamera } from 'lucide-react';
import { useCamera } from '../camera/useCamera';

interface CameraCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  capturedPhoto?: string;
}

export default function CameraCapture({ onCapture, capturedPhoto }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1280,
    height: 720,
    quality: 0.85,
    format: 'image/jpeg',
  });

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const handleOpenCamera = async () => {
    setIsOpen(true);
    await startCamera();
  };

  const handleCloseCamera = async () => {
    await stopCamera();
    setIsOpen(false);
  };

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onCapture(dataUrl);
        handleCloseCamera();
      };
      reader.readAsDataURL(photo);
    }
  };

  const handleRetry = async () => {
    await retry();
  };

  const handleSwitchCamera = async () => {
    await switchCamera();
  };

  const getErrorMessage = () => {
    if (!error) return null;
    
    switch (error.type) {
      case 'permission':
        return 'Camera access was denied. Please allow camera permissions in your browser settings and try again.';
      case 'not-supported':
        return 'Camera is not supported on this device or browser. Please try a different browser or device.';
      case 'not-found':
        return 'No camera was found on this device. Please ensure your device has a camera.';
      case 'unknown':
        return 'An error occurred while accessing the camera. Please try again.';
      default:
        return 'An error occurred while accessing the camera. Please try again.';
    }
  };

  if (isSupported === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Camera is not supported on this device or browser.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenCamera}
          className="w-full"
          disabled={!isSupported}
        >
          <img 
            src="/assets/generated/camera-icon.dim_64x64.png" 
            alt="Camera" 
            className="w-5 h-5 mr-2"
          />
          {capturedPhoto ? 'Retake Photo' : 'Take Photo (Optional)'}
        </Button>
        
        {capturedPhoto && (
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
            <img 
              src={capturedPhoto} 
              alt="Captured animal" 
              className="w-full h-32 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => onCapture('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseCamera()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Capture Animal Photo</DialogTitle>
            <DialogDescription>
              Position your animal in the frame and click capture when ready
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {getErrorMessage()}
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="relative w-full bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {isLoading && !isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Initializing camera...</p>
                  </div>
                </div>
              )}
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isActive ? 'block' : 'none' }}
              />
              
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </div>

            <div className="flex gap-2">
              {error ? (
                <Button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCapture}
                    disabled={!isActive || isLoading}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                  
                  {isMobile && (
                    <Button
                      onClick={handleSwitchCamera}
                      disabled={!isActive || isLoading}
                      variant="outline"
                      size="icon"
                    >
                      <SwitchCamera className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              
              <Button
                onClick={handleCloseCamera}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
