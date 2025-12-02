import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsEncryptService } from '../../services/js-encrypt.service';

@Component({
  selector: 'app-encrypt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.scss']
})
export class EncryptComponent implements OnInit {
  // Variables para el formulario
  textToEncrypt: string = '';
  encryptedText: string = '';
  publicKey: string = '';
  privateKey: string = '';
  
  // Estado de la aplicación
  isLoading: boolean = false;
  error: string = '';
  showCopiedMessage: boolean = false;
  
  // Referencia al temporizador del mensaje
  private copyMessageTimeout: any;

  constructor(private encryptService: JsEncryptService) {}

  ngOnInit(): void {
    this.generateNewKeys();
  }

  /**
   * Genera un nuevo par de claves
   */
  generateNewKeys(): void {
    this.isLoading = true;
    this.error = '';
    
    try {
      const keyPair = this.encryptService.generateKeyPair();
      this.publicKey = keyPair.publicKey;
      this.privateKey = keyPair.privateKey;
      
      // Limpiar el texto encriptado al generar nuevas claves
      this.encryptedText = '';
      
      // Guardar las claves en el almacenamiento local (solo para desarrollo)
      localStorage.setItem('rsa_keys', JSON.stringify(keyPair));
      
    } catch (error) {
      this.error = 'Error al generar las claves: ' + (error as Error).message;
      console.error('Error al generar claves:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Encripta el texto ingresado
   */
  encryptText(): void {
    if (!this.textToEncrypt.trim()) {
      this.error = 'Por favor ingresa un texto para encriptar';
      return;
    }

    if (!this.publicKey) {
      this.error = 'No se ha generado una clave pública';
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    try {
      this.encryptedText = this.encryptService.encrypt(this.textToEncrypt, this.publicKey);
    } catch (error) {
      this.error = 'Error al encriptar: ' + (error as Error).message;
      console.error('Error al encriptar:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Copia el texto encriptado al portapapeles
   */
  copyToClipboard(): void {
    if (!this.encryptedText) return;
    
    navigator.clipboard.writeText(this.encryptedText).then(() => {
      this.showCopiedMessage = true;
      
      // Ocultar el mensaje después de 2 segundos
      if (this.copyMessageTimeout) {
        clearTimeout(this.copyMessageTimeout);
      }
      
      this.copyMessageTimeout = setTimeout(() => {
        this.showCopiedMessage = false;
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
      this.error = 'No se pudo copiar al portapapeles';
    });
  }

  /**
   * Limpia el formulario
   */
  clearForm(): void {
    this.textToEncrypt = '';
    this.encryptedText = '';
    this.error = '';
  }
  
  /**
   * Descarga la clave privada como archivo
   */
  downloadPrivateKey(): void {
    if (!this.privateKey) return;
    
    const element = document.createElement('a');
    const file = new Blob([this.privateKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'clave_privada.pem';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
