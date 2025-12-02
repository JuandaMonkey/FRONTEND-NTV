import { Injectable } from '@angular/core';
import * as JSEncrypt from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})
export class JsEncryptService {
  /**
   * Genera un par de claves RSA
   * @returns Objeto con clave pública y privada
   */
  generateKeyPair(): { publicKey: string; privateKey: string } {
    try {
      const encrypt = new JSEncrypt.JSEncrypt({ default_key_size: '2048' });
      
      // Forzar la generación de claves
      encrypt.getKey();
      
      const publicKey = encrypt.getPublicKey() || '';
      const privateKey = encrypt.getPrivateKey() || '';
      
      if (!publicKey || !privateKey) {
        throw new Error('No se pudieron generar las claves');
      }
      
      return {
        publicKey: this.formatKey(publicKey, 'PUBLIC'),
        privateKey: this.formatKey(privateKey, 'PRIVATE')
      };
    } catch (error) {
      console.error('Error al generar claves:', error);
      throw new Error('Error al generar el par de claves: ' + (error as Error).message);
    }
  }

  /**
   * Formatea una clave para asegurar el formato correcto
   */
  private formatKey(key: string, type: 'PUBLIC' | 'PRIVATE'): string {
    if (!key) return key;
    
    // Eliminar espacios en blanco y saltos de línea
    const cleanKey = key.trim();
    
    // Si ya tiene el formato correcto, retornar tal cual
    if (type === 'PUBLIC' && cleanKey.includes('-----BEGIN PUBLIC KEY-----')) {
      return cleanKey;
    }
    
    if (type === 'PRIVATE' && cleanKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      return cleanKey;
    }
    
    // Si no tiene el formato, agregar los encabezados correspondientes
    if (type === 'PUBLIC') {
      return `-----BEGIN PUBLIC KEY-----\n${cleanKey}\n-----END PUBLIC KEY-----`;
    } else {
      return `-----BEGIN RSA PRIVATE KEY-----\n${cleanKey}\n-----END RSA PRIVATE KEY-----`;
    }
  }

  /**
   * Encripta un texto usando una clave pública
   * @param text Texto a encriptar
   * @param publicKey Clave pública en formato PEM
   * @returns Texto encriptado en base64
   */
  encrypt(text: string, publicKey: string): string {
    try {
      if (!text || !publicKey) {
        throw new Error('Texto y clave pública son requeridos');
      }

      const encrypt = new JSEncrypt.JSEncrypt();
      const formattedPublicKey = this.formatKey(publicKey, 'PUBLIC');
      
      encrypt.setPublicKey(formattedPublicKey);
      
      const encrypted = encrypt.encrypt(text);
      
      if (!encrypted) {
        throw new Error('No se pudo encriptar el texto. La clave pública podría ser inválida.');
      }

      return encrypted;
    } catch (error) {
      console.error('Error en encrypt:', error);
      throw new Error('Error al encriptar el texto: ' + (error as Error).message);
    }
  }

  /**
   * Desencripta un texto usando una clave privada
   * @param encryptedText Texto encriptado en base64
   * @param privateKey Clave privada en formato PEM
   * @returns Texto desencriptado
   */
  decrypt(encryptedText: string, privateKey: string): string {
    try {
      if (!encryptedText || !privateKey) {
        throw new Error('Texto encriptado y clave privada son requeridos');
      }

      const decrypt = new JSEncrypt.JSEncrypt();
      const formattedPrivateKey = this.formatKey(privateKey, 'PRIVATE');
      
      decrypt.setPrivateKey(formattedPrivateKey);
      
      const decrypted = decrypt.decrypt(encryptedText);
      
      if (!decrypted) {
        throw new Error('No se pudo desencriptar el texto. La clave privada podría ser inválida.');
      }

      return decrypted;
    } catch (error) {
      console.error('Error en decrypt:', error);
      throw new Error('Error al desencriptar el texto: ' + (error as Error).message);
    }
  }
}
