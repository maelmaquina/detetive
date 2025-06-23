"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function RelationshipDetectiveForm() {
  const [formData, setFormData] = useState({
    userName: "",
    partnerName: "",
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form data:", formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
            <Search className="h-6 w-6" />
            Detetive Digital de Relacionamento
          </CardTitle>
          <p className="text-gray-700 text-sm">
            Desconfia que ele(a) está te escondendo algo? Responda 5 perguntas e receba um relatório com sinais de
            alerta no seu relacionamento.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Seu nome</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Seu nome"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerName">Nome do(a) parceiro(a)</Label>
              <Input
                id="partnerName"
                type="text"
                placeholder="Nome do(a) parceiro(a)"
                value={formData.partnerName}
                onChange={(e) => handleInputChange("partnerName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">1. Ele(a) passou a esconder o celular?</Label>
              <Select onValueChange={(value) => handleInputChange("question1", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">2. Mudou a rotina de horários?</Label>
              <Select onValueChange={(value) => handleInputChange("question2", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">3. Já sumiu sem explicação?</Label>
              <Select onValueChange={(value) => handleInputChange("question3", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">4. Apaga mensagens ou redes sociais?</Label>
              <Select onValueChange={(value) => handleInputChange("question4", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">5. Você sente que ele(a) esconde algo?</Label>
              <Select onValueChange={(value) => handleInputChange("question5", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg mt-6">
              🔓 Gerar Relatório
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
