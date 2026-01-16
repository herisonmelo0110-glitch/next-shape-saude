'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, X, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScannedFood } from '@/lib/types';
import { analyzeFoodImage } from '@/app/actions-food';

interface FoodScannerProps {
  onFoodScanned: (food: ScannedFood) => void;
  onClose: () => void;
}

export default function FoodScanner({ onFoodScanned, onClose }: FoodScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzedFood, setAnalyzedFood] = useState<ScannedFood | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPortion, setCustomPortion] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Iniciar câmera
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }, []);

  // Parar câmera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Capturar foto
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
      analyzeImage(imageData);
    }
  }, [stopCamera]);

  // Analisar imagem com IA
  const analyzeImage = async (imageData: string) => {
    setIsScanning(true);
    setError(null);

    try {
      const result = await analyzeFoodImage(imageData);
      setAnalyzedFood(result);
      setCustomPortion(result.portion);
    } catch (err) {
      console.error('Erro ao analisar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao analisar alimento');
    } finally {
      setIsScanning(false);
    }
  };

  // Confirmar e adicionar alimento
  const confirmFood = () => {
    if (!analyzedFood) return;

    // Recalcular valores se porção foi alterada
    let finalFood = analyzedFood;
    if (customPortion && customPortion !== analyzedFood.portion) {
      const ratio = customPortion / analyzedFood.portion;
      finalFood = {
        ...analyzedFood,
        portion: customPortion,
        calories: Math.round(analyzedFood.calories * ratio),
        protein: Math.round(analyzedFood.protein * ratio),
        carbs: Math.round(analyzedFood.carbs * ratio),
        fats: Math.round(analyzedFood.fats * ratio),
        fiber: analyzedFood.fiber ? Math.round(analyzedFood.fiber * ratio) : undefined,
        sugar: analyzedFood.sugar ? Math.round(analyzedFood.sugar * ratio) : undefined,
        sodium: analyzedFood.sodium ? Math.round(analyzedFood.sodium * ratio) : undefined,
      };
    }

    onFoodScanned(finalFood);
    onClose();
  };

  // Tentar novamente
  const retry = () => {
    setCapturedImage(null);
    setAnalyzedFood(null);
    setError(null);
    setCustomPortion(null);
    startCamera();
  };

  // Upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setCapturedImage(imageData);
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  // Obter cor do nível calórico
  const getCalorieLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Obter cor da qualidade nutricional
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scanner de Alimentos</h2>
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      {!capturedImage ? (
        <div className="relative w-full h-full">
          {/* Vídeo da câmera */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onLoadedMetadata={startCamera}
          />

          {/* Overlay de guia */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 border-4 border-white/50 rounded-3xl shadow-2xl">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
            </div>
          </div>

          {/* Instruções */}
          <div className="absolute bottom-32 left-0 right-0 text-center px-4">
            <p className="text-white text-lg font-semibold mb-2">
              Posicione o alimento no centro
            </p>
            <p className="text-white/80 text-sm">
              Certifique-se de que o alimento está bem iluminado
            </p>
          </div>

          {/* Botões de ação */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              variant="secondary"
              className="rounded-full w-16 h-16"
            >
              📁
            </Button>
            <Button
              onClick={capturePhoto}
              size="lg"
              className="rounded-full w-20 h-20 bg-white text-black hover:bg-gray-200"
            >
              <Camera className="w-10 h-10" />
            </Button>
          </div>

          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800">
          {/* Imagem capturada */}
          <div className="relative w-full h-64">
            <img
              src={capturedImage}
              alt="Alimento capturado"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
          </div>

          {/* Conteúdo de análise */}
          <div className="p-6 space-y-6">
            {isScanning && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4 animate-pulse">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-lg font-semibold">Analisando alimento...</p>
                <p className="text-white/60 text-sm mt-2">Nossa IA está identificando o alimento</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">Erro ao analisar</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {analyzedFood && (
              <div className="space-y-6">
                {/* Nome do alimento */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-2">{analyzedFood.name}</h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCalorieLevelColor(analyzedFood.calorieLevel)}`}>
                      {analyzedFood.calorieLevel === 'low' && '🟢 Baixa Caloria'}
                      {analyzedFood.calorieLevel === 'medium' && '🟡 Média Caloria'}
                      {analyzedFood.calorieLevel === 'high' && '🔴 Alta Caloria'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getQualityColor(analyzedFood.nutritionalQuality)}`}>
                      {analyzedFood.nutritionalQuality === 'excellent' && '⭐ Excelente'}
                      {analyzedFood.nutritionalQuality === 'good' && '👍 Boa'}
                      {analyzedFood.nutritionalQuality === 'moderate' && '⚠️ Moderada'}
                      {analyzedFood.nutritionalQuality === 'poor' && '❌ Pobre'}
                    </span>
                  </div>
                </div>

                {/* Controle de porção */}
                <div className="bg-white/10 rounded-xl p-4">
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Porção (gramas)
                  </label>
                  <input
                    type="number"
                    value={customPortion || analyzedFood.portion}
                    onChange={(e) => setCustomPortion(Number(e.target.value))}
                    className="w-full bg-white/20 text-white text-lg font-bold rounded-lg px-4 py-3 border-2 border-white/30 focus:border-indigo-400 focus:outline-none"
                    min="1"
                  />
                  <p className="text-white/60 text-xs mt-2">
                    Ajuste a quantidade para recalcular os valores
                  </p>
                </div>

                {/* Informações nutricionais */}
                <div className="bg-white/10 rounded-xl p-6 space-y-4">
                  <h4 className="text-white font-bold text-lg mb-4">Informações Nutricionais</h4>
                  
                  {/* Calorias destaque */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-center">
                    <p className="text-white/80 text-sm">Calorias</p>
                    <p className="text-white text-4xl font-bold">{Math.round(analyzedFood.calories * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}</p>
                    <p className="text-white/60 text-xs">kcal</p>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white/60 text-xs mb-1">Proteínas</p>
                      <p className="text-white text-xl font-bold">{Math.round(analyzedFood.protein * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}g</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white/60 text-xs mb-1">Carboidratos</p>
                      <p className="text-white text-xl font-bold">{Math.round(analyzedFood.carbs * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}g</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white/60 text-xs mb-1">Gorduras</p>
                      <p className="text-white text-xl font-bold">{Math.round(analyzedFood.fats * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}g</p>
                    </div>
                  </div>

                  {/* Outros nutrientes */}
                  {(analyzedFood.fiber || analyzedFood.sugar || analyzedFood.sodium) && (
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                      {analyzedFood.fiber && (
                        <div className="text-center">
                          <p className="text-white/60 text-xs">Fibras</p>
                          <p className="text-white text-sm font-semibold">{Math.round(analyzedFood.fiber * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}g</p>
                        </div>
                      )}
                      {analyzedFood.sugar && (
                        <div className="text-center">
                          <p className="text-white/60 text-xs">Açúcares</p>
                          <p className="text-white text-sm font-semibold">{Math.round(analyzedFood.sugar * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}g</p>
                        </div>
                      )}
                      {analyzedFood.sodium && (
                        <div className="text-center">
                          <p className="text-white/60 text-xs">Sódio</p>
                          <p className="text-white text-sm font-semibold">{Math.round(analyzedFood.sodium * ((customPortion || analyzedFood.portion) / analyzedFood.portion))}mg</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Recomendação */}
                <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-xl p-4">
                  <p className="text-indigo-300 text-sm font-semibold mb-1">Indicado para:</p>
                  <p className="text-white text-lg">
                    {analyzedFood.recommendation === 'weight-loss' && '🎯 Emagrecimento'}
                    {analyzedFood.recommendation === 'maintenance' && '⚖️ Manutenção'}
                    {analyzedFood.recommendation === 'muscle-gain' && '💪 Ganho de Massa'}
                    {analyzedFood.recommendation === 'all' && '✅ Todos os Objetivos'}
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={retry}
                    variant="outline"
                    className="flex-1 h-14 text-white border-white/30 hover:bg-white/10"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Tentar Novamente
                  </Button>
                  <Button
                    onClick={confirmFood}
                    className="flex-1 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
