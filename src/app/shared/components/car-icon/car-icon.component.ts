import { Component, input } from '@angular/core';

@Component({
  selector: 'app-car-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size() * 0.5"
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- shadow -->
      <ellipse cx="100" cy="88" rx="80" ry="6" fill="rgba(0,0,0,0.1)" />

      <!-- body (dynamic color) -->
      <path
        [attr.fill]="color()"
        d="M10 70 Q12 50 35 48 Q50 30 90 30 Q120 30 135 48 L180 52 Q190 54 190 64 L190 72 Q190 76 184 76 L16 76 Q10 76 10 70 Z"
      />

      <!-- fender highlight (darker shade of body) -->
      <path [attr.fill]="color()" fill-opacity="0.85" d="M35 76 Q35 56 55 56 Q75 56 75 76 Z" />

      <!-- window -->
      <path fill="#cdeaea" d="M58 48 Q62 36 88 36 Q110 36 122 48 Z" />

      <!-- headlight -->
      <circle cx="184" cy="60" r="4" fill="#ffd54a" />

      <!-- wheels -->
      <circle cx="55" cy="76" r="15" fill="#3a3a3a" />
      <circle cx="55" cy="76" r="7" fill="#c8c8c8" />
      <circle cx="150" cy="76" r="15" fill="#3a3a3a" />
      <circle cx="150" cy="76" r="7" fill="#c8c8c8" />
    </svg>
  `,
})
export class CarIconComponent {
  readonly color = input<string>('#000000');

  readonly size = input<number>(60);
}
