import { Component, Input, Output, EventEmitter, forwardRef, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

// Componente de Input personalizado
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-group">
      <label *ngIf="label" [for]="inputId" class="form-label">{{label}}</label>
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
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{errorMessage}}
      </div>
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-group">
      <label *ngIf="label" [for]="selectId" class="form-label">{{label}}</label>
      <select 
        [id]="selectId"
        [disabled]="disabled"
        [ngModel]="value"
        (change)="onChange($event)"
        class="form-select"
        [class.error]="hasError"
        (ngModelChange)="onChange($event)">
        <option value="" *ngIf="placeholder">{{placeholder}}</option>
        <option *ngFor="let option of options" [value]="option.value">
          {{option.label}}
        </option>
      </select>
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{errorMessage}}
      </div>
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
  imports: [CommonModule, FormsModule],
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
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      (click)="onClick()"
      [class]="getButtonClass()"
      class="form-button">
      <i *ngIf="icon" [class]="icon"></i>
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
  imports: [CommonModule],
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
  imports: [CommonModule],
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