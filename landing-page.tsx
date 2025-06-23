"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Shield,
  Heart,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock,
  MessageCircle,
  Eye,
  Smartphone,
  Users,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react"

// Declaração de tipos para UTMify
declare global {
  interface Window {
    utmify: any
  }
}

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState<"landing" | "form" | "questions" | "analysis" | "checkout">("landing")
  const [formData, setFormData] = useState({
    userName: "",
    partnerName: "",
    partnerWhatsApp: "",
    partnerInstagram: "",
    partnerPhoto: null as File | null,
    answers: [] as string[],
  })

  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [currentVerification, setCurrentVerification] = useState("")

  const [showFinalAlertPopup, setShowFinalAlertPopup] = useState(false)
  const [finalAlertProgress, setFinalAlertProgress] = useState(0)

  const [showFinalCheckoutPopup, setShowFinalCheckoutPopup] = useState(false)

  // Adicionar UTMify tracking
  useEffect(() => {
    // Script do UTMify brasileiro
    const script = document.createElement("script")
    script.src = "https://cdn.utmify.com.br/scripts/utms/latest.js"
    script.setAttribute("data-utmify-prevent-xcod-sck", "")
    script.setAttribute("data-utmify-prevent-subids", "")
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Aguardar o script carregar e inicializar
    script.onload = () => {
      console.log("UTMify carregado com sucesso!")
      // O UTMify brasileiro funciona automaticamente, não precisa de init manual
    }

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Função helper para rastrear eventos
  const trackEvent = (eventName: string, properties: any = {}) => {
    try {
      if (window.utmify && typeof window.utmify.track === 'function') {
        window.utmify.track(eventName, properties)
        console.log(`Evento rastreado: ${eventName}`, properties)
      } else {
        console.log(`UTMify não disponível. Evento: ${eventName}`, properties)
      }
    } catch (error) {
      console.error("Erro ao rastrear evento:", error)
    }
  }

  const questions = [
    "Ele(a) começou a esconder o celular de você?",
    "Você percebeu mudanças na rotina dele(a)? (Ex: está saindo mais, fica mais tempo no trabalho, evita responder mensagens perto de você)",
    "Ele(a) já apagou mensagens de WhatsApp ou redes sociais?",
    "Você já percebeu que ele(a) mudou a senha ou bloqueio do celular?",
    "Vocês brigam mais que antes sem motivo claro?",
    "Ele(a) ficou mais distante ou menos carinhoso(a) ultimamente?",
    "Algum(a) amigo(a) já deu indiretas ou avisou algo estranho?",
    "Você sente no seu coração que tem algo errado?",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, partnerPhoto: file }))
      
      // Rastrear upload de foto
      trackEvent("photo_uploaded", {
        file_size: file.size,
        file_type: file.type,
      })
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.userName && formData.partnerName && formData.partnerWhatsApp) {
      // Rastrear evento de formulário preenchido
      trackEvent("form_completed", {
        step: "basic_info",
        partner_name: formData.partnerName,
        has_instagram: !!formData.partnerInstagram,
        has_photo: !!formData.partnerPhoto,
      })
      
      setCurrentStep("questions")
    }
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...formData.answers, answer]
    setFormData((prev) => ({ ...prev, answers: newAnswers }))

    // Rastrear resposta
    trackEvent("question_answered", {
      question_number: formData.answers.length + 1,
      answer: answer,
      total_questions: questions.length,
      progress_percentage: Math.round(((formData.answers.length + 1) / questions.length) * 100),
    })

    if (formData.answers.length < questions.length - 1) {
      // Continue para próxima pergunta
    } else {
      // Rastrear questionário completo
      const yesAnswers = newAnswers.filter((a) => a === "sim").length
      trackEvent("quiz_completed", {
        total_yes_answers: yesAnswers,
        total_no_answers: newAnswers.length - yesAnswers,
        suspicion_level: yesAnswers >= 6 ? "high" : yesAnswers >= 4 ? "medium" : yesAnswers >= 2 ? "low" : "minimal",
      })
      
      setShowVerificationPopup(true)
      startVerificationProcess()
    }
  }

  const startVerificationProcess = () => {
    // Rastrear início da análise
    trackEvent("analysis_started", {
      partner_name: formData.partnerName,
      partner_whatsapp: formData.partnerWhatsApp,
      partner_instagram: formData.partnerInstagram,
    })

    const verificationSteps = [
      "🔍 Conectando aos servidores de análise...",
      "📱 Acessando dados do WhatsApp " + formData.partnerWhatsApp + "...",
      "⚠️ Detectando atividade suspeita...",
      "💕 Verificando perfil no Tinder...",
      "🚨 ALERTA: Encontradas conversas ocultas",
      formData.partnerInstagram
        ? "📷 Analisando Instagram @" + formData.partnerInstagram.replace("@", "") + "..."
        : "📷 Analisando fotos do Instagram...",
      "🕵️ Cruzando dados comportamentais...",
      formData.partnerPhoto ? "🖼️ Processando foto de perfil..." : "📧 Verificando e-mails e mensagens...",
      "⏰ Analisando horários de atividade...",
      "🔐 Desbloqueando dados criptografados...",
      "📊 Gerando relatório de infidelidade...",
      "🎯 Identificando padrões de traição...",
      "✅ Análise completa - Resultados prontos",
    ]

    let step = 0
    let progress = 0

    const interval = setInterval(() => {
      if (step < verificationSteps.length) {
        setCurrentVerification(verificationSteps[step])
        step++
      }

      progress += 100 / 15 // 15 segundos total
      setVerificationProgress(Math.min(progress, 100))

      if (progress >= 100) {
        clearInterval(interval)
        
        // Rastrear análise completa
        trackEvent("analysis_completed", {
          duration_seconds: 15,
          alert_signals: alertSignals,
        })
        
        setTimeout(() => {
          setShowVerificationPopup(false)
          setShowFinalAlertPopup(true)
          startFinalAlertProcess()
        }, 1000)
      }
    }, 1150)
  }

  const startFinalAlertProcess = () => {
    let progress = 0

    const interval = setInterval(() => {
      progress += 100 / 6 // 6 segundos total
      setFinalAlertProgress(Math.min(progress, 100))

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setShowFinalAlertPopup(false)
          setCurrentStep("checkout")
        }, 500)
      }
    }, 1000)
  }

  const scrollToForm = () => {
    // Rastrear clique no CTA
    trackEvent("cta_clicked", {
      cta_location: "hero_section",
      cta_text: "Quero desbloquear meu relatório agora",
    })
    
    setCurrentStep("form")
    setTimeout(() => {
      document.getElementById("quiz-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleCheckoutClick = () => {
    // Rastrear clique no checkout
    trackEvent("checkout_initiated", {
      alert_signals: alertSignals,
      partner_name: formData.partnerName,
      suspicion_level: alertSignals >= 6 ? "high" : alertSignals >= 4 ? "medium" : alertSignals >= 2 ? "low" : "minimal",
      price: 19.90,
      currency: "BRL",
    })
    
    setShowFinalCheckoutPopup(true)
  }

  const handleAcceptTerms = () => {
    // Rastrear conversão
    trackEvent("conversion", {
      value: 19.9,
      currency: "BRL",
      alert_signals: alertSignals,
      partner_name: formData.partnerName,
      conversion_step: "payment_redirect",
    })
    
    // Rastrear evento de compra (purchase)
    trackEvent("purchase", {
      transaction_id: `REL_${Date.now()}`,
      value: 19.9,
      currency: "BRL",
      items: [{
        item_id: "relationship_report",
        item_name: "Relatório Digital de Relacionamento",
        category: "Digital Report",
        quantity: 1,
        price: 19.9,
      }],
    })
    
    window.open("https://link.zyonpay.com/YtkFKWkeAW", "_blank")
  }

  // Calcular sinais de alerta baseado nas respostas "sim"
  const alertSignals = formData.answers.filter((answer) => answer === "sim").length

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {currentStep === "landing" && (
        <>
          {/* Hero Section - Mobile First */}
          <section className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 py-8 sm:py-12 lg:py-16 px-4 relative overflow-hidden">
            {/* Background decorativo - Simplificado para mobile */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-red-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-20 h-20 sm:w-40 sm:h-40 bg-pink-500 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 sm:w-24 sm:h-24 bg-red-400 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Texto do Hero */}
                <div className="text-center lg:text-left order-2 lg:order-1">
                  <Badge className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-pulse">
                    🚨 ALERTA DE RELACIONAMENTO
                  </Badge>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                    ⚠️ Desconfia de traição?
                    <br />
                    <span className="text-red-600">Descubra a verdade agora</span>
                  </h1>

                  <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                    Responda 8 perguntas rápidas e receba um <strong>relatório confidencial</strong> com sinais de
                    alerta no relacionamento.
                    <br className="hidden sm:block" />
                    <span className="text-red-600 font-semibold"> Entrega imediata, 100% sigiloso.</span>
                  </p>

                  <Button
                    onClick={scrollToForm}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  >
                    🔓 Quero desbloquear meu relatório agora
                  </Button>

                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span>Resultado em 2 minutos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span>100% Confidencial</span>
                    </div>
                  </div>
                </div>

                {/* Visual do Hero - Mobile Optimized */}
                <div className="relative order-1 lg:order-2 flex justify-center">
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-xs sm:max-w-sm">
                    {/* Simulação de tela de celular */}
                    <div className="bg-black rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 mx-auto w-48 h-72 sm:w-56 sm:h-80 lg:w-64 lg:h-96 relative">
                      <div className="bg-white rounded-xl sm:rounded-2xl h-full p-3 sm:p-4 relative overflow-hidden">
                        {/* Header do WhatsApp */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs sm:text-sm">WhatsApp</p>
                            <p className="text-xs text-gray-500">Online agora</p>
                          </div>
                        </div>

                        {/* Mensagens simuladas */}
                        <div className="space-y-2 sm:space-y-3">
                          <div className="bg-red-100 p-2 rounded-lg border-l-4 border-red-500">
                            <p className="text-xs text-red-700 font-medium">🚨 3 conversas ocultas</p>
                          </div>
                          <div className="bg-yellow-100 p-2 rounded-lg border-l-4 border-yellow-500">
                            <p className="text-xs text-yellow-700 font-medium">⚠️ Atividade suspeita</p>
                          </div>
                          <div className="bg-orange-100 p-2 rounded-lg border-l-4 border-orange-500">
                            <p className="text-xs text-orange-700 font-medium">📱 Mensagens apagadas</p>
                          </div>
                        </div>

                        {/* Overlay de análise */}
                        <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center rounded-xl sm:rounded-2xl">
                          <div className="text-center text-white">
                            <Eye className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 animate-pulse" />
                            <p className="font-bold text-xs sm:text-sm">ANÁLISE DETECTADA</p>
                            <p className="text-xs opacity-90">Comportamento suspeito</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elementos flutuantes - Mobile Adjusted */}
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-red-500 text-white p-2 sm:p-3 rounded-full shadow-lg animate-bounce">
                    <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>

                  <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-white p-2 sm:p-4 rounded-lg shadow-lg border-2 border-red-200">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Análise em tempo real</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section - Mobile Optimized */}
          <section className="py-8 sm:py-12 lg:py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
                Por que milhares confiam no nosso método?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <Card className="text-center p-4 sm:p-6 border-2 hover:border-red-200 transition-all duration-300 hover:shadow-lg group">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="relative mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Shield className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-4 sm:-bottom-2 sm:-right-8 bg-green-100 p-1.5 sm:p-2 rounded-full">
                        <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">100% Anônimo</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Seus dados são protegidos e o relatório é totalmente confidencial. Ninguém saberá que você fez o
                      teste.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-4 sm:p-6 border-2 hover:border-red-200 transition-all duration-300 hover:shadow-lg group">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="relative mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-4 sm:-bottom-2 sm:-right-8 bg-blue-100 p-1.5 sm:p-2 rounded-full">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Relatório Imediato</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Receba seu relatório personalizado em menos de 2 minutos. Sem espera, sem complicação.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-4 sm:p-6 border-2 hover:border-red-200 transition-all duration-300 hover:shadow-lg group sm:col-span-2 lg:col-span-1">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="relative mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-4 sm:-bottom-2 sm:-right-8 bg-purple-100 p-1.5 sm:p-2 rounded-full">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Baseado em Psicologia</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Desenvolvido por especialistas em relacionamentos usando técnicas comprovadas da psicologia
                      comportamental.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Testimonials Section - Mobile Optimized */}
          <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
                O que dizem quem já descobriu a verdade
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <Card className="p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">
                      "Eu tinha dúvidas, agora sei a verdade! Valeu cada centavo! O relatório foi muito detalhado e me
                      ajudou a tomar a decisão certa."
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-lg">C</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">Camila S.</p>
                        <p className="text-xs sm:text-sm text-gray-500">São Paulo, SP</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">
                      "Descobri o que ele estava escondendo. Recomendo! Finalmente consegui ter certeza e não ficar mais
                      na dúvida."
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-lg">J</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">Joana M.</p>
                        <p className="text-xs sm:text-sm text-gray-500">Rio de Janeiro, RJ</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">
                      "Achei muito profissional e sigiloso, adorei! O relatório veio com dicas práticas de como lidar
                      com a situação."
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-lg">C</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">Carla R.</p>
                        <p className="text-xs sm:text-sm text-gray-500">Belo Horizonte, MG</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Final CTA Section - Mobile Optimized */}
          <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-red-600 to-red-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-20 h-20 sm:w-40 sm:h-40 bg-yellow-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full blur-2xl"></div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-yellow-300 animate-pulse" />

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 px-4">
                ⚠️ Não ignore os sinais
              </h2>

              <p className="text-xl sm:text-2xl lg:text-2xl mb-6 sm:mb-8 opacity-90 px-4 leading-relaxed">
                Descubra o que está por trás das atitudes do seu parceiro.
                <br />
                <strong>Sua paz de espírito vale mais que a dúvida.</strong>
              </p>

              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-md mx-auto"
              >
                🔓 Ver meu relatório agora
              </Button>

              <div className="mt-6 sm:mt-8 text-xs sm:text-sm opacity-75 space-y-1">
                <p>✅ Mais de 50.000 pessoas já descobriram a verdade</p>
                <p>✅ Garantia de satisfação ou seu dinheiro de volta</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-6 sm:py-8 px-4 bg-gray-900 text-white text-center">
            <p className="text-xs sm:text-sm opacity-75">
              © 2024 Detetive Digital de Relacionamento. Todos os direitos reservados.
            </p>
          </footer>
        </>
      )}

      {/* Quiz Form Section - Mobile Optimized */}
      {currentStep === "form" && (
        <section id="quiz-form" className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Formulário */}
              <div className="order-2 lg:order-1">
                <div className="text-center lg:text-left mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                    🕵️ Vamos começar
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600">Precisamos de algumas informações básicas</p>
                </div>

                <Card className="p-6 sm:p-8 shadow-xl border-2 border-red-100">
                  <CardContent>
                    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="userName" className="text-base sm:text-lg font-medium">
                            👤 Seu nome
                          </Label>
                          <Input
                            id="userName"
                            type="text"
                            placeholder="Digite seu nome"
                            value={formData.userName}
                            onChange={(e) => handleInputChange("userName", e.target.value)}
                            className="p-3 text-base sm:text-lg"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerName" className="text-base sm:text-lg font-medium">
                            💕 Nome do(a) parceiro(a)
                          </Label>
                          <Input
                            id="partnerName"
                            type="text"
                            placeholder="Nome do(a) parceiro(a)"
                            value={formData.partnerName}
                            onChange={(e) => handleInputChange("partnerName", e.target.value)}
                            className="p-3 text-base sm:text-lg"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerWhatsApp" className="text-base sm:text-lg font-medium">
                            📱 WhatsApp do(a) parceiro(a)
                          </Label>
                          <Input
                            id="partnerWhatsApp"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={formData.partnerWhatsApp}
                            onChange={(e) => handleInputChange("partnerWhatsApp", e.target.value)}
                            className="p-3 text-base sm:text-lg"
                            required
                          />
                          <p className="text-xs sm:text-sm text-gray-500">
                            ℹ️ Necessário para análise de atividade digital
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerInstagram" className="text-base sm:text-lg font-medium">
                            📷 Instagram do(a) parceiro(a) <span className="text-gray-500">(opcional)</span>
                          </Label>
                          <Input
                            id="partnerInstagram"
                            type="text"
                            placeholder="@usuario_instagram"
                            value={formData.partnerInstagram}
                            onChange={(e) => handleInputChange("partnerInstagram", e.target.value)}
                            className="p-3 text-base sm:text-lg"
                          />
                          <p className="text-xs sm:text-sm text-gray-500">
                            ℹ️ Ajuda na análise de comportamento nas redes sociais
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerPhoto" className="text-base sm:text-lg font-medium">
                            🖼️ Foto de perfil do(a) parceiro(a) <span className="text-gray-500">(opcional)</span>
                          </Label>
                          <div className="relative">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-red-400 transition-colors duration-300">
                              {formData.partnerPhoto ? (
                                <div className="space-y-3">
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm sm:text-base font-medium text-green-700">
                                      Foto carregada com sucesso!
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                                      {formData.partnerPhoto.name}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData((prev) => ({ ...prev, partnerPhoto: null }))}
                                    className="text-xs sm:text-sm"
                                  >
                                    Remover foto
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                    <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm sm:text-base font-medium text-gray-700">
                                      Clique para anexar uma foto
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">PNG, JPG até 10MB</p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs sm:text-sm"
                                    onClick={() => document.getElementById("partnerPhoto")?.click()}
                                  >
                                    📎 Escolher arquivo
                                  </Button>
                                </div>
                              )}
                              <Input
                                id="partnerPhoto"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                            ℹ️ Facilita a identificação em redes sociais e apps de relacionamento
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm text-blue-800 font-medium">
                              🔒 <strong>Dados 100% Seguros:</strong> Todas as informações são criptografadas e
                              utilizadas apenas para gerar seu relatório confidencial.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🔓 Gerar relatório completo
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Visual lateral - Hidden on Mobile */}
              <div className="relative order-1 lg:order-2 hidden lg:block">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
                  {/* Simulação de dashboard */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-900">Análise Segura</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Dados protegidos</p>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          <span className="text-xs sm:text-sm font-medium">Criptografia SSL</span>
                        </div>
                        <span className="text-xs text-green-600">✓</span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                          <span className="text-xs sm:text-sm font-medium">Dados anônimos</span>
                        </div>
                        <span className="text-xs text-blue-600">✓</span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                          <span className="text-xs sm:text-sm font-medium">100% confidencial</span>
                        </div>
                        <span className="text-xs text-purple-600">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos - Desktop Only */}
                <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-red-100 p-3 sm:p-4 rounded-full animate-pulse">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>

                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-lg border-2 border-green-200">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Dados seguros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Questions Section - Mobile Optimized */}
      {currentStep === "questions" && (
        <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-red-50 to-pink-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Pergunta */}
              <div className="order-2 lg:order-1">
                <div className="text-center lg:text-left mb-6 sm:mb-8">
                  <Badge className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                    Pergunta {formData.answers.length + 1} de {questions.length}
                  </Badge>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4 sm:mb-6">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(formData.answers.length / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Card className="p-6 sm:p-8 shadow-xl border-2 border-red-100">
                  <CardContent>
                    <div className="text-center lg:text-left mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {questions[formData.answers.length]}
                      </h2>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <Button
                        onClick={() => handleAnswer("sim")}
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        ✅ Sim
                      </Button>

                      <Button
                        onClick={() => handleAnswer("nao")}
                        variant="outline"
                        size="lg"
                        className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg transform hover:scale-105 transition-all duration-300"
                      >
                        ❌ Não
                      </Button>
                    </div>

                    <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
                      Analisando o comportamento de {formData.partnerName}...
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visual lateral - Hidden on Mobile */}
              <div className="relative order-1 lg:order-2 hidden lg:block">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
                  {/* Simulação de análise */}
                  <div className="bg-white rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-900">Análise Comportamental</h3>
                        <p className="text-xs sm:text-sm text-gray-500">IA Avançada</p>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Padrões detectados</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs sm:text-sm font-medium text-red-600">{formData.answers.length}</span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(formData.answers.length / questions.length) * 100}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg text-center">
                          <Target className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 text-yellow-600" />
                          <p className="text-xs font-medium text-yellow-700">Sinais</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-red-50 rounded-lg text-center">
                          <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 text-red-600" />
                          <p className="text-xs font-medium text-red-700">Alertas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elementos flutuantes - Desktop Only */}
                <div className="absolute top-4 right-4 bg-white p-2 sm:p-3 rounded-lg shadow-lg animate-pulse">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Analisando...</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-yellow-100 p-2 sm:p-3 rounded-lg shadow-lg border-2 border-yellow-300">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-800">Sinais detectados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Checkout Section - Mobile Optimized */}
      {currentStep === "checkout" && (
        <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* Header com urgência */}
            <div className="text-center mb-6 sm:mb-8">
              <Badge className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-pulse">
                🔍 ANÁLISE FINALIZADA
              </Badge>
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-orange-600 mb-3 sm:mb-4">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium text-center">
                  Este relatório ficará disponível apenas pelas próximas 10 horas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Conteúdo principal */}
              <div className="order-2 lg:order-1">
                <Card className="p-6 sm:p-8 shadow-2xl border-2 border-red-200 bg-white">
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6">
                      {/* Gancho emocional */}
                      <div className="text-center">
                        <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-red-600" />
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                          Com base nas suas respostas, identificamos comportamentos suspeitos sérios no seu
                          relacionamento com <span className="text-red-600">{formData.partnerName}</span>.
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                          Você está a um clique de descobrir o que pode mudar completamente sua visão sobre essa
                          relação.
                        </p>
                      </div>

                      {/* Sinais detectados */}
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-start sm:items-center mb-3 sm:mb-4">
                          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                          <h3 className="text-base sm:text-lg font-bold text-red-800 leading-tight">
                            Nosso relatório detectou {alertSignals} {alertSignals === 1 ? "sinal" : "sinais"} de alerta{" "}
                            {alertSignals >= 3 ? "sérios" : alertSignals >= 2 ? "importantes" : "preocupante"}.
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base text-red-700 font-medium">
                          🛑 Ignorar isso pode te custar mais do que imagina.
                        </p>
                      </div>

                      {/* Valor e oferta */}
                      <div className="text-center bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 sm:p-6 rounded-lg">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-2">Por apenas R$19,90</h3>
                        <p className="text-lg sm:text-xl mb-2 sm:mb-4">
                          É menos do que um lanche. Mas pode te livrar de uma grande decepção.
                        </p>
                      </div>

                      {/* CTA Principal */}
                      <div className="text-center space-y-3 sm:space-y-4">
                        <p className="text-lg sm:text-xl font-medium text-gray-700">
                          👇 Desbloqueie agora mesmo e descubra a verdade:
                        </p>

                        <Button
                          onClick={handleCheckoutClick}
                          size="lg"
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 sm:py-6 text-lg sm:text-2xl font-bold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
                        >
                          🔓 Ver Relatório Agora — R$19,90
                        </Button>

                        <p className="text-xs sm:text-sm text-gray-600">Apenas 1x • Sigiloso • Acesso imediato</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visualizações de evidências - Mobile Optimized */}
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                <div className="relative bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold animate-pulse">
                    EVIDÊNCIAS
                  </div>

                  <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-0">
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex\
