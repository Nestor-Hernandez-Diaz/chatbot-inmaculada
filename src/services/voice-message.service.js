// src/services/voice-message.service.js
// Servicio de procesamiento de mensajes de voz usando Gemini Audio
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class VoiceMessageService {
  constructor() {
    this.enabled = !!process.env.GOOGLE_API_KEY;
    
    if (this.enabled) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      // Gemini 2.0 Flash soporta audio de forma nativa
      this.audioModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      console.log('🎙️ Servicio de mensajes de voz activado (Gemini Audio)');
    } else {
      console.log('⚠️ Mensajes de voz no disponible - falta GOOGLE_API_KEY');
    }
  }

  /**
   * Transcribe un mensaje de voz a texto
   * @param {Buffer} audioBuffer - Buffer del audio
   * @param {string} mimeType - Tipo MIME del audio (audio/ogg, audio/mp4, etc.)
   * @returns {Promise<Object>} - Resultado de la transcripción
   */
  async transcribeVoiceMessage(audioBuffer, mimeType = 'audio/ogg') {
    if (!this.enabled) {
      return {
        success: false,
        text: null,
        error: 'Servicio de voz no disponible'
      };
    }

    try {
      console.log(`🎙️ Transcribiendo audio: ${Math.round(audioBuffer.length / 1024)}KB, tipo: ${mimeType}`);
      
      // Convertir buffer a base64
      const base64Audio = audioBuffer.toString('base64');
      
      // Prompt para transcripción
      const prompt = `
Transcribe este mensaje de voz en español.

INSTRUCCIONES:
1. Transcribe EXACTAMENTE lo que dice el audio, en español
2. Si el audio menciona productos o precios, inclúyelos tal cual
3. Ignora ruidos de fondo, solo transcribe la voz
4. Si no puedes entender alguna parte, indica "[inaudible]"
5. Mantén la puntuación natural del habla

IMPORTANTE:
- Responde SOLO con el texto transcrito, sin explicaciones
- Si el audio está vacío o es solo ruido, responde: "[audio vacío]"
- Si el audio está en otro idioma, transcríbelo igual e indica el idioma

Transcripción:`;

      // Enviar a Gemini
      const result = await this.audioModel.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: this.normalizeAudioMimeType(mimeType),
            data: base64Audio
          }
        }
      ]);
      
      const transcription = result.response.text().trim();
      
      console.log(`📝 Transcripción: "${transcription.substring(0, 100)}..."`);
      
      // Validar que la transcripción sea útil
      if (this.isEmptyTranscription(transcription)) {
        return {
          success: false,
          text: null,
          error: 'No se pudo entender el audio',
          rawTranscription: transcription
        };
      }
      
      return {
        success: true,
        text: transcription,
        confidence: this.estimateConfidence(transcription),
        duration: this.estimateDuration(audioBuffer.length, mimeType)
      };
      
    } catch (error) {
      console.error('❌ Error en transcripción:', error.message);
      return {
        success: false,
        text: null,
        error: error.message
      };
    }
  }

  /**
   * Normaliza el tipo MIME del audio para Gemini
   * WhatsApp envía audio/ogg; codecs=opus
   */
  normalizeAudioMimeType(mimeType) {
    // Gemini soporta: audio/wav, audio/mp3, audio/aiff, audio/aac, audio/ogg, audio/flac
    if (mimeType.includes('ogg') || mimeType.includes('opus')) {
      return 'audio/ogg';
    }
    if (mimeType.includes('mp4') || mimeType.includes('m4a')) {
      return 'audio/aac';
    }
    if (mimeType.includes('webm')) {
      return 'audio/webm';
    }
    if (mimeType.includes('wav')) {
      return 'audio/wav';
    }
    if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
      return 'audio/mp3';
    }
    // Por defecto, asumir OGG (común en WhatsApp)
    return 'audio/ogg';
  }

  /**
   * Verifica si la transcripción está vacía o es inútil
   */
  isEmptyTranscription(text) {
    if (!text) return true;
    
    const emptyPatterns = [
      '[audio vacío]',
      '[inaudible]',
      '[sin audio]',
      '[ruido]',
      'no hay audio',
      'audio vacío',
      'no se escucha'
    ];
    
    const lowerText = text.toLowerCase().trim();
    
    // Si es muy corto y solo tiene marcadores
    if (lowerText.length < 5) return true;
    
    // Si coincide con patrones vacíos
    return emptyPatterns.some(pattern => lowerText.includes(pattern));
  }

  /**
   * Estima la confianza basada en la transcripción
   */
  estimateConfidence(text) {
    if (!text) return 0;
    
    let confidence = 0.85; // Base
    
    // Penalizar si tiene marcadores de inaudible
    if (text.includes('[inaudible]')) {
      confidence -= 0.15;
    }
    
    // Penalizar si es muy corto
    if (text.length < 10) {
      confidence -= 0.10;
    }
    
    // Bonus si tiene signos de puntuación (transcripción completa)
    if (text.includes('.') || text.includes('?') || text.includes('!')) {
      confidence += 0.05;
    }
    
    return Math.max(0.1, Math.min(1, confidence));
  }

  /**
   * Estima la duración del audio basado en el tamaño
   */
  estimateDuration(bytes, mimeType) {
    // Estimación aproximada basada en bitrate típico
    // OGG Opus en WhatsApp: ~16kbps = 2KB/s
    // MP3 típico: ~128kbps = 16KB/s
    
    const kb = bytes / 1024;
    
    if (mimeType.includes('ogg') || mimeType.includes('opus')) {
      return Math.round(kb / 2); // ~2KB por segundo
    }
    
    return Math.round(kb / 10); // Estimación genérica
  }

  /**
   * Formatea la respuesta para el usuario después de transcribir
   * @param {Object} transcription - Resultado de transcripción
   * @returns {string} - Mensaje formateado
   */
  formatTranscriptionConfirmation(transcription) {
    if (!transcription.success) {
      return `🎙️ *¡Asu, ñaño!* No pude entender bien tu audio.\n\n` +
             `💡 Puede ser que:\n` +
             `• El audio estaba muy bajo o con ruido\n` +
             `• La grabación fue muy corta\n` +
             `• Hubo problemas técnicos\n\n` +
             `¿Puedes enviarme otro audio o escribirme tu consulta? 🦜`;
    }
    
    // Mostrar lo que entendimos antes de procesar
    return `🎙️ *Entendí:* "${transcription.text}"\n\n` +
           `🔍 Procesando tu consulta...`;
  }

  /**
   * Procesa un mensaje de voz completo
   * @param {Buffer} audioBuffer - Buffer del audio
   * @param {string} mimeType - Tipo MIME
   * @param {string} customerPhone - Teléfono del cliente
   * @returns {Promise<Object>} - Resultado con transcripción
   */
  async processVoiceMessage(audioBuffer, mimeType, customerPhone) {
    try {
      // 1. Transcribir el audio
      const transcription = await this.transcribeVoiceMessage(audioBuffer, mimeType);
      
      if (!transcription.success) {
        return {
          success: false,
          transcription: null,
          response: this.formatTranscriptionConfirmation(transcription),
          shouldProcessAsText: false
        };
      }
      
      // 2. Retornar transcripción para que se procese como texto
      return {
        success: true,
        transcription: transcription.text,
        confidence: transcription.confidence,
        duration: transcription.duration,
        confirmationMessage: `🎙️ *Te escuché, ñaño:* "${transcription.text}"`,
        shouldProcessAsText: true
      };
      
    } catch (error) {
      console.error('❌ Error procesando mensaje de voz:', error);
      return {
        success: false,
        transcription: null,
        response: `🎙️ *¡Uy, parcero!* Hubo un error al procesar tu audio. ` +
                  `¿Puedes intentar de nuevo o escribirme? 🦜`,
        shouldProcessAsText: false,
        error: error.message
      };
    }
  }
}

// Exportar instancia única
const voiceMessageService = new VoiceMessageService();

module.exports = {
  voiceMessageService,
  transcribeVoiceMessage: voiceMessageService.transcribeVoiceMessage.bind(voiceMessageService),
  processVoiceMessage: voiceMessageService.processVoiceMessage.bind(voiceMessageService),
  formatTranscriptionConfirmation: voiceMessageService.formatTranscriptionConfirmation.bind(voiceMessageService)
};
