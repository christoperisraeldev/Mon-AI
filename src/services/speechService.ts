
export interface SpeechServiceConfig {
  elevenLabsApiKey?: string;
}

class SpeechService {
  private elevenLabsApiKey: string | null = null;
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    this.initializeSpeechRecognition();
  }

  setElevenLabsApiKey(apiKey: string) {
    this.elevenLabsApiKey = apiKey;
    localStorage.setItem('elevenlabs-api-key', apiKey);
  }

  getElevenLabsApiKey(): string | null {
    if (!this.elevenLabsApiKey) {
      this.elevenLabsApiKey = localStorage.getItem('elevenlabs-api-key');
    }
    return this.elevenLabsApiKey;
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition!.continuous = false;
      this.recognition!.interimResults = false;
      this.recognition!.lang = 'en-US';
    }
  }

  // Speech-to-Text functionality using Deepgram
  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        reject(new Error('Media recording not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;
      let mediaRecorder: MediaRecorder;
      const audioChunks: Blob[] = [];

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          
          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            this.isListening = false;
            stream.getTracks().forEach(track => track.stop());
            
            try {
              const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
              const base64Audio = await this.blobToBase64(audioBlob);
              
              const { supabase } = await import('@/integrations/supabase/client');
              const { data, error } = await supabase.functions.invoke('deepgram-transcription', {
                body: { audio: base64Audio }
              });

              if (error) throw error;
              
              const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
              resolve(transcript);
            } catch (error) {
              reject(new Error(`Transcription failed: ${error}`));
            }
          };

          mediaRecorder.start();

          // Auto-stop after 10 seconds
          setTimeout(() => {
            if (this.isListening) {
              mediaRecorder.stop();
            }
          }, 10000);
        })
        .catch(error => {
          this.isListening = false;
          reject(new Error(`Media access denied: ${error.message}`));
        });
    });
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  stopListening() {
    this.isListening = false;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  // Text-to-Speech functionality using ElevenLabs
  async speakText(text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB'): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text,
          voiceId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }
      });

      if (error) {
        throw new Error(`ElevenLabs API error: ${error.message}`);
      }

      // Convert base64 audio to playable audio
      const audioData = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioData);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play();
      });
    } catch (error) {
      console.error('ElevenLabs TTS failed, falling back to browser TTS:', error);
      return this.speakWithBrowserTTS(text);
    }
  }

  // Fallback browser TTS
  private speakWithBrowserTTS(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        reject(new Error('Text-to-speech not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));

      speechSynthesis.speak(utterance);
    });
  }

  // Stop any ongoing speech
  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Check if TTS is available
  isTTSAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Check if STT is available
  isSTTAvailable(): boolean {
    return !!(typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia);
  }
}

export const speechService = new SpeechService();
