"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Trophy, AlertTriangle, Shield } from "lucide-react"

type GameStep = "intro" | "questions" | "results"
type SuspicionLevel = "baixo" | "medio" | "alto" | "critico"

export default function GamifiedRelationshipDetective() {
  const [gameStep, setGameStep] = useState<GameStep>("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    userName: "",
    partnerName: "",
    answers: [] as string[],
  })
  const [showResult, setShowResult] = useState(false)
  const [animateScore, setAnimateScore] = useState(false)

  const questions = [
    {
      id: 1,
      text: "Ele(a) passou a esconder o celular?",
      icon: "📱",
      suspicionPoints: 20,
    },
    {
      id: 2,
      text: "Mudou a rotina de horários?",
      icon: "⏰",
      suspicionPoints: 15,
    },
    {
      id: 3,
      text: "Já sumiu sem explicação?",
      icon: "👻",
      suspicionPoints: 25,
    },
    {
      id: 4,
      text: "Apaga mensagens ou redes sociais?",
      icon: "🗑️",
      suspicionPoints: 20,
    },
    {
      id: 5,
      text: "Você sente que ele(a) esconde algo?",
      icon: "🤔",
      suspicionPoints: 20,
    },
  ]

  const getSuspicionLevel = (score: number): SuspicionLevel => {
    if (score <= 20) return "baixo"
    if (score <= 40) return "medio"
    if (score <= 70) return "alto"
    return "critico"
  }

  const getSuspicionData = (level: SuspicionLevel) => {
    const data = {
      baixo: {
        title: "🟢 Nível Baixo de Suspeita",
        message: "Seu relacionamento parece estar nos trilhos! Continue cultivando a confiança.",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: <Shield className="h-8 w-8 text-green-600" />,
      },
      medio: {
        title: "🟡 Nível Médio de Suspeita",
        message: "Alguns sinais merecem atenção. Que tal uma conversa franca?",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
      },
      alto: {
        title: "🟠 Nível Alto de Suspeita",
        message: "Vários sinais de alerta detectados. É hora de investigar mais a fundo.",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        icon: <Search className="h-8 w-8 text-orange-600" />,
      },
      critico: {
        title: "🔴 Nível Crítico de Suspeita",
        message: "Muitos sinais preocupantes! Considere uma conversa séria ou ajuda profissional.",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      },
    }
    return data[level]
  }

  const startGame = () => {
    if (formData.userName && formData.partnerName) {
      setGameStep("questions")
      setProgress(0)
    }
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...formData.answers, answer]
    setFormData((prev) => ({ ...prev, answers: newAnswers }))

    if (answer === "sim") {
      const newScore = score + questions[currentQuestion].suspicionPoints
      setScore(newScore)
      setAnimateScore(true)
      setTimeout(() => setAnimateScore(false), 500)
    }

    const newProgress = ((currentQuestion + 1) / questions.length) * 100
    setProgress(newProgress)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 800)
    } else {
      setTimeout(() => {
        setGameStep("results")
        setShowResult(true)
      }, 1000)
    }
  }

  const resetGame = () => {
    setGameStep("intro")
    setCurrentQuestion(0)
    setScore(0)
    setProgress(0)
    setFormData({ userName: "", partnerName: "", answers: [] })
    setShowResult(false)
  }

  if (gameStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <Search className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">🔍 Detetive Digital de Relacionamento</CardTitle>
            <p className="text-gray-700 text-sm">
              Descubra o nível de suspeita no seu relacionamento através do nosso jogo investigativo!
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">👤 Seu nome de detetive</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Digite seu nome"
                value={formData.userName}
                onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))}
                className="transition-all duration-300 focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerName">💕 Nome do(a) investigado(a)</Label>
              <Input
                id="partnerName"
                type="text"
                placeholder="Nome do(a) parceiro(a)"
                value={formData.partnerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, partnerName: e.target.value }))}
                className="transition-all duration-300 focus:ring-2 focus:ring-red-300"
              />
            </div>

            <Button
              onClick={startGame}
              disabled={!formData.userName || !formData.partnerName}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 text-lg mt-6 transform transition-all duration-300 hover:scale-105"
            >
              🚀 Iniciar Investigação
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameStep === "questions") {
    const question = questions[currentQuestion]

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-red-600 border-red-600">
                Pergunta {currentQuestion + 1}/5
              </Badge>
              <div
                className={`flex items-center gap-2 ${animateScore ? "animate-pulse scale-110" : ""} transition-all duration-300`}
              >
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-lg">{score} pts</span>
              </div>
            </div>

            <Progress value={progress} className="mb-4" />

            <div className="text-center">
              <div className="text-4xl mb-2">{question.icon}</div>
              <CardTitle className="text-xl font-bold text-gray-800">{question.text}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => handleAnswer("sim")}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg transform transition-all duration-300 hover:scale-105"
              >
                ✅ Sim (+{question.suspicionPoints} pts)
              </Button>

              <Button
                onClick={() => handleAnswer("nao")}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 py-4 text-lg transform transition-all duration-300 hover:scale-105"
              >
                ❌ Não (0 pts)
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">Investigando {formData.partnerName}... 🕵️‍♀️</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameStep === "results") {
    const suspicionLevel = getSuspicionLevel(score)
    const suspicionData = getSuspicionData(suspicionLevel)

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className={`w-full max-w-md ${showResult ? "animate-in slide-in-from-bottom duration-500" : ""}`}>
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 p-4 rounded-full w-fit ${suspicionData.bgColor}`}>{suspicionData.icon}</div>

            <CardTitle className={`text-xl font-bold ${suspicionData.color}`}>{suspicionData.title}</CardTitle>

            <div className="flex items-center justify-center gap-4 my-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{score}</div>
                <div className="text-sm text-gray-500">Pontos de Suspeita</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">🏆</div>
                <div className="text-sm text-gray-500">Investigação Completa</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg ${suspicionData.bgColor}`}>
              <p className="text-center text-gray-700">
                <strong>Detetive {formData.userName}</strong>, sua investigação sobre{" "}
                <strong>{formData.partnerName}</strong> foi concluída!
              </p>
              <p className="text-center text-sm mt-2 text-gray-600">{suspicionData.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span>{q.icon}</span>
                  <span className={formData.answers[index] === "sim" ? "text-red-600 font-medium" : "text-green-600"}>
                    {formData.answers[index] === "sim" ? "Sim" : "Não"}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                🔄 Nova Investigação
              </Button>

              <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                📊 Relatório Detalhado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
