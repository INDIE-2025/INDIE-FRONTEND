
import { Component, Input, Output, EventEmitter, forwardRef, SecurityContext, signal } from '@angular/core';

import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

// Componente de Input personalizado
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-group">
      @if (label) {
        <label [for]="inputId" class="form-label">{{label}}</label>
      }
      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="form-input"
        [class.error]="hasError">
        @if (hasError && errorMessage) {
          <div class="error-message">
            {{errorMessage}}
          </div>
        }
      </div>
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  styleUrls: ['./form-components.component.css']
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Input() inputId: string = '';

  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

// Componente de Select personalizado
@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-group">
      @if (label) {
        <label [for]="selectId" class="form-label">{{label}}</label>
      }
      <select
        [id]="selectId"
        [disabled]="disabled"
        [ngModel]="value"
        (change)="onChange($event)"
        class="form-select"
        [class.error]="hasError"
        (ngModelChange)="onChange($event)">
        @if (placeholder) {
          <option value="">{{placeholder}}</option>
        }
        @for (option of options; track option) {
          <option [value]="option.value">
            {{option.label}}
          </option>
        }
      </select>
      @if (hasError && errorMessage) {
        <div class="error-message">
          {{errorMessage}}
        </div>
      }
    </div>
    `,
  styleUrls: ['./form-components.component.css']
})
export class FormSelectComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Input() selectId: string = '';
  @Input() options: {value: string, label: string}[] = [];
  @Input() value: string = '';
  
  @Output() valueChange = new EventEmitter<string>();

  onChange(event: any) {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }
}

// Componente de Checkbox personalizado
@Component({
  selector: 'app-form-checkbox',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="checkbox-group">
      <label class="checkbox-container">
        <input 
          type="checkbox"
          [checked]="checked"
          [disabled]="disabled"
          (change)="onChange($event)"
          class="checkbox-input">
        <span class="checkmark"></span>
        <span class="checkbox-label">{{label}}</span>
      </label>
    </div>
  `,
  styleUrls: ['./form-components.component.css']
})
export class FormCheckboxComponent {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: any) {
    this.checked = event.target.checked;
    this.checkedChange.emit(this.checked);
  }
}

// Componente de Button personalizado
@Component({
  selector: 'app-form-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick()"
      [class]="getButtonClass()"
      class="form-button">
      @if (icon) {
        <i [class]="icon"></i>
      }
      <span>{{label}}</span>
    </button>
    `,
  styleUrls: ['./form-components.component.css']
})
export class FormButtonComponent {
  @Input() label: string = '';
  @Input() type: string = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  getButtonClass(): string {
    return `btn-${this.variant} btn-${this.size}`;
  }
}

//Componente de texto
@Component({
  selector: 'app-form-text',
  standalone: true,
  imports: [],
  styles: [`
    .wrap {
      width: 100%;
      display: grid;
      place-items: center;
      text-align: center;
    }
    .text {
      margin: 0;
      line-height: 1.3;
    }
  `],
  template: `
    <div class="wrap">
      @switch (tag) {
        @case ('h1') {
          <h1 class="text" [style.color]="color" [style.fontSize.px]="size" [style.fontWeight]="weight">{{ text }}</h1>
        }
        @case ('h2') {
          <h2 class="text" [style.color]="color" [style.fontSize.px]="size" [style.fontWeight]="weight">{{ text }}</h2>
        }
        @case ('h3') {
          <h3 class="text" [style.color]="color" [style.fontSize.px]="size" [style.fontWeight]="weight">{{ text }}</h3>
        }
        @default {
          <p  class="text" [style.color]="color" [style.fontSize.px]="size" [style.fontWeight]="weight">{{ text }}</p>
        }
      }
    </div>
  `
})
export class FormTextComponent {
  @Input() text = '';
  /** 'p' | 'h1' | 'h2' | 'h3' */
  @Input() tag: 'p'|'h1'|'h2'|'h3' = 'p';
  @Input() color = '#ffffff';
  @Input() size = 16;          // px
  @Input() weight: number|string = 500;
}

//Componente de icono

@Component({
  selector: 'app-form-svg',
  standalone: true,
  imports: [],
  styles: [`
    .wrap {
      width: 100%;
      display: grid;
      place-items: center;
      text-align: center;
    }
    .svg-asset, .svg-inline {
      display: block;
    }
  `],
  template: `
    <div class="wrap" [style.color]="color">
      <!-- Opción A: archivo en assets -->
      @if (src && !svg) {
      <img class="svg-asset"
           [src]="src"
           [alt]="alt"
           [style.width.px]="width"
           [style.height.px]="height" />
      }
      <!-- Opción B: SVG inline (usa currentColor) -->
      @if (svg) {
        <div class="svg-inline"
            [style.width.px]="width"
            [style.height.px]="height"
            [innerHTML]="safeSvg">
        </div>
      }
    </div>
  `
})
export class FormSvgComponent {
  constructor(private sanitizer: DomSanitizer) {}

  /** Ruta a assets, ej: '/assets/icons/cancel.svg' */
  @Input() src?: string;

  /** SVG inline como string (usa fill="currentColor" para heredar color) */
  @Input() set svg(v: string | undefined) {
    this._svg = v || '';
    const cleaned = this.sanitizer.sanitize(SecurityContext.HTML, this._svg) || '';
    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }
  get svg() { return this._svg; }
  private _svg = '';
  safeSvg: any;

  @Input() alt = 'icon';
  @Input() width = 48;     // px
  @Input() height = 48;    // px
  @Input() color = '#ffffff'; // funciona si el SVG usa fill="currentColor"
}

@Component({
  selector: 'app-form-subtypes',
  standalone: true,
  imports: [FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormSubtypesComponent),
    multi: true,
  }],
  styleUrls: ['./form-components.component.css'],
  template: `
    <label class="label">{{label}}</label>

    <div class="row" [class.disabled]="disabled">
      <input
        [placeholder]="placeholder"
        [(ngModel)]="draft"
        (keydown.enter)="add()"
        (blur)="onTouched()"
        [disabled]="disabled" />
      <button class="add-btn" type="button" (click)="add()" [disabled]="disabled" aria-label="Agregar">
        <!-- Ícono + -->
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z"/>
        </svg>
      </button>
    </div>

    @if (hint) { <div class="hint">{{ hint }}</div> }

    <div class="list">
      @for (s of subtypes(); track s; let i = $index) {
        <div class="item">
          <span class="item-name">{{ s }}</span>
          <button class="remove-btn" type="button" (click)="remove(i)" aria-label="Quitar">
            <!-- Ícono X -->
            <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
              <path d="M4.22 3.17 9 7.95l4.78-4.78a1 1 0 1 1 1.41 1.42L10.41 9.36l4.78 4.78a1 1 0 0 1-1.41 1.41L9 10.77l-4.78 4.78a1 1 0 0 1-1.41-1.41L7.59 9.36 2.81 4.58A1 1 0 0 1 4.22 3.17Z"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class FormSubtypesComponent implements ControlValueAccessor {
  // API visual
  @Input() label: string = '';
  @Input() placeholder: string = '';
  hint?: string;

  // estado interno
  subtypes = signal<string[]>([]);
  draft = '';
  disabled = false;

  // CVA
  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string[] | null): void {
    this.subtypes.set(Array.isArray(value) ? value : []);
  }
  registerOnChange(fn: (value: string[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  add(): void {
    const v = this.draft.trim();
    if (!v) return;
    if (this.subtypes().some(s => s.toLowerCase() === v.toLowerCase())) {
      this.draft = '';
      return; // evitar duplicados (case-insensitive)
    }
    const next = [...this.subtypes(), v];
    this.subtypes.set(next);
    this.onChange(next);
    this.draft = '';
  }

  remove(index: number): void {
    const next = this.subtypes().filter((_, i) => i !== index);
    this.subtypes.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
