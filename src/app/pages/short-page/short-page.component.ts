import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// componentes 
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-short-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './short-page.component.html',
  styleUrls: ['./short-page.component.scss']
})
export class ShortPageComponent implements OnInit, OnDestroy {
  private prevBodyOverflow: string = '';
  private prevHtmlOverflow: string = '';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const htmlEl = this.document.documentElement as HTMLElement;
    const bodyEl = this.document.body as HTMLElement;
    this.prevBodyOverflow = bodyEl.style.overflow;
    this.prevHtmlOverflow = htmlEl.style.overflow;
    bodyEl.style.overflow = 'hidden';
    htmlEl.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    const htmlEl = this.document.documentElement as HTMLElement;
    const bodyEl = this.document.body as HTMLElement;
    bodyEl.style.overflow = this.prevBodyOverflow;
    htmlEl.style.overflow = this.prevHtmlOverflow;
  }
  
  shorts = 
    {
      title: 'Gran Turismo',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjA0N2YyNmYtZDk4Ny00ODE2LThmZWQtNGJiMDk0YzhiNzE5XkEyXkFqcGc@._V1_SX300.jpg',
      description: 'Un juego de coches increíble',
      user: 'NTV',
    }

  onPrev(): void {
    console.log('Prev short');
  }

  onNext(): void {
    console.log('Next short');
  }
}
