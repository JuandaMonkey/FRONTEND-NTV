import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsEncryptService } from '../../services/js-encrypt.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-decrypt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.scss']
})
export class DecryptComponent {
  privateKey: string = '';
  textToDecrypt: string = '';
  decryptedText: string = '';
  error: string = '';
  showPrivateKey: boolean = false;

  constructor(
    private encryptService: JsEncryptService,
    private authService: AuthService
  ) {}

  decryptText() {
    if (!this.textToDecrypt) {
      this.error = 'Por favor ingresa el texto encriptado';
      return;
    }

    if (!this.privateKey) {
      this.error = 'Por favor ingresa tu clave privada';
      return;
    }

    try {
      this.decryptedText = this.encryptService.decrypt(this.textToDecrypt, this.privateKey);
      this.error = '';
    } catch (error) {
      this.error = 'Error al desencriptar el texto. Verifica la clave privada.';
      console.error(error);
    }
  }

  togglePrivateKeyVisibility() {
    this.showPrivateKey = !this.showPrivateKey;
  }

  clear() {
    this.textToDecrypt = '';
    this.decryptedText = '';
    this.error = '';
  }
}
