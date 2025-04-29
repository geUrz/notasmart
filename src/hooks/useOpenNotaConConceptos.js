import { useState } from 'react'
import axios from 'axios'

export function useOpenNotaConConceptos() {
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)
  const [showDetalles, setShowDetalles] = useState(false)

  const onOpenDetalles = async (nota) => {
    if (!nota || !nota.id) {
      setShowDetalles(false)
      return;
    }

    try {
      const response = await axios.get(`/api/notas/conceptos?nota_id=${nota.id}`)
      nota.conceptos = response.data
      setNotaSeleccionada(nota)
      setShowDetalles(true)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
      setShowDetalles(false)
    }
  }

  const onCloseDetalles = () => {
    setNotaSeleccionada(null)
    setShowDetalles(false)
  }

  return {
    notaSeleccionada,
    showDetalles,
    onOpenDetalles,
    onCloseDetalles,
    setNotaSeleccionada,
  }
}
