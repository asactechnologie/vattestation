"use client"

import { useState } from "react"

export interface HistoryItem {
  id: string
  query: string
  timestamp: number
  status: boolean
  message: string
  numeroAttestation?: string
  nomAssure?: string
  numeroImmatriculation?: string
  marqueVehicule?: string
  modeleVehicule?: string
  nomCompagnie?: string
}

const STORAGE_KEY = "asac_attestation_history"

export function useLocalStorageHistory() {
  // Lazy state initialization reads localStorage synchronously on client-side render
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error("Failed to load history from localStorage:", error)
      }
    }
    return []
  })

  // Helper to save history to state and storage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error("Failed to save history to localStorage:", error)
    }
  }

  const addToHistory = (
    query: string,
    status: boolean,
    message: string,
    responseData?: any
  ) => {
    // Generate a simple unique ID
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Extract useful fields if response succeeded
    let details: Partial<HistoryItem> = {}
    if (status && responseData && Array.isArray(responseData) && responseData.length > 0) {
      const item = responseData[0]
      details = {
        numeroAttestation: item.numero_attestation,
        nomAssure: item.nom_assure,
        numeroImmatriculation: item.numero_immatriculation,
        marqueVehicule: item.marque_vehicule,
        modeleVehicule: item.modele_vehicule,
        nomCompagnie: item.nom_compagnie,
      }
    }

    const newItem: HistoryItem = {
      id,
      query,
      timestamp: Date.now(),
      status,
      message,
      ...details,
    }

    // Put newer items at the top of the history list, limit to 50 items
    const updatedHistory = [newItem, ...history.filter(item => item.query !== query)].slice(0, 50)
    saveHistory(updatedHistory)
  }

  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    saveHistory(updatedHistory)
  }

  const clearHistory = () => {
    saveHistory([])
  }

  return {
    history,
    historyReady: true, // Always ready as it initializes synchronously on client render
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
