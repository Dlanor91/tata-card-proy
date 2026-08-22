import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface BudgetLine {
  id: string;
  item: string;
  quantity: number;
  unitPrice: number;
}

@Component({
  selector: 'app-home-page',
  imports: [FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private static readonly INITIAL_WEEKLY_BUDGET = 1755;
  /** Clave v1; si cambia el formato, incrementar y migrar o usar otra clave. */
  private static readonly STORAGE_KEY = 'tata-card:vale-semanal:v1';

  /** Monto tope semanal (ej. 1755). */
  readonly weeklyBudget = signal(HomePageComponent.INITIAL_WEEKLY_BUDGET);

  readonly lines = signal<BudgetLine[]>([this.createEmptyLine()]);

  /** Fila pendiente de confirmación para eliminar; null si no hay diálogo abierto. */
  readonly pendingDeleteLineId = signal<string | null>(null);

  readonly pendingDeleteLine = computed(() => {
    const id = this.pendingDeleteLineId();
    if (!id) {
      return null;
    }
    return this.lines().find((row) => row.id === id) ?? null;
  });

  private readonly deleteConfirmDialog =
    viewChild<ElementRef<HTMLDialogElement>>('deleteConfirmDialog');

  constructor() {
    this.restoreFromLocalStorage();
    effect(() => {
      this.weeklyBudget();
      this.lines();
      this.persistToLocalStorage();
    });
    effect(() => {
      const id = this.pendingDeleteLineId();
      const dialog = this.deleteConfirmDialog()?.nativeElement;
      if (id && dialog && !dialog.open) {
        dialog.showModal();
      }
    });
  }

  /** Suma de (cantidad × precio unitario) por fila. */
  readonly totalUsed = computed(() =>
    this.lines().reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  );

  readonly available = computed(() => this.weeklyBudget() - this.totalUsed());

  readonly isOverBudget = computed(() => this.available() < 0);

  /** Hay al menos un ítem con datos (o más de una fila) para poder limpiar. */
  readonly canClearLines = computed(() => {
    const rows = this.lines();
    if (rows.length > 1) {
      return true;
    }
    const [row] = rows;
    return !!row && (row.item.trim() !== '' || row.quantity !== 1 || row.unitPrice !== 0);
  });

  /**
   * Hay cambios respecto al estado inicial: mostrar aviso al recargar o cerrar la pestaña.
   * Los navegadores solo permiten un diálogo genérico (no se puede personalizar el texto).
   * Safari en iPhone no dispara `beforeunload`; ahí el respaldo es `persistToLocalStorage`.
   */
  readonly hasUnsavedChanges = computed(() => {
    if (this.weeklyBudget() !== HomePageComponent.INITIAL_WEEKLY_BUDGET) {
      return true;
    }
    const rows = this.lines();
    if (rows.length !== 1) {
      return true;
    }
    const [row] = rows;
    return row.item.trim() !== '' || row.quantity !== 1 || row.unitPrice !== 0;
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.hasUnsavedChanges()) {
      return;
    }
    event.preventDefault();
    event.returnValue = '';
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  lineSubtotal(line: BudgetLine): number {
    return line.quantity * line.unitPrice;
  }

  setWeeklyBudget(raw: unknown): void {
    const n = typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.'));
    this.weeklyBudget.set(Number.isFinite(n) && n >= 0 ? n : 0);
  }

  updateLine(
    id: string,
    patch: Partial<Pick<BudgetLine, 'item' | 'quantity' | 'unitPrice'>>
  ): void {
    this.lines.update((rows) =>
      rows.map((row) => {
        if (row.id !== id) {
          return row;
        }
        const next = { ...row, ...patch };
        if ('quantity' in patch) {
          next.quantity = this.clampQty(next.quantity);
        }
        if ('unitPrice' in patch) {
          next.unitPrice = this.clampMoney(next.unitPrice);
        }
        return next;
      })
    );
  }

  addLine(): void {
    this.lines.update((rows) => [...rows, this.createEmptyLine()]);
  }

  requestRemoveLine(id: string): void {
    this.pendingDeleteLineId.set(id);
  }

  confirmRemoveLine(): void {
    const id = this.pendingDeleteLineId();
    if (!id) {
      return;
    }
    this.lines.update((rows) => {
      const filtered = rows.filter((r) => r.id !== id);
      return filtered.length > 0 ? filtered : [this.createEmptyLine()];
    });
    this.deleteConfirmDialog()?.nativeElement.close();
  }

  cancelRemoveLine(): void {
    this.deleteConfirmDialog()?.nativeElement.close();
  }

  onDeleteDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelRemoveLine();
    }
  }

  onDeleteDialogClose(): void {
    this.pendingDeleteLineId.set(null);
  }

  clearLines(): void {
    this.lines.set([this.createEmptyLine()]);
  }

  private createEmptyLine(): BudgetLine {
    return { id: crypto.randomUUID(), item: '', quantity: 1, unitPrice: 0 };
  }

  private clampQty(n: number): number {
    if (!Number.isFinite(n) || n < 0) {
      return 0;
    }
    return Math.floor(n);
  }

  private clampMoney(n: number): number {
    if (!Number.isFinite(n) || n < 0) {
      return 0;
    }
    return n;
  }

  private persistToLocalStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(
        HomePageComponent.STORAGE_KEY,
        JSON.stringify({
          weeklyBudget: this.weeklyBudget(),
          lines: this.lines(),
        })
      );
    } catch {
      /* modo privado, cuota llena, etc. */
    }
  }

  private restoreFromLocalStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    let raw: string | null;
    try {
      raw = localStorage.getItem(HomePageComponent.STORAGE_KEY);
    } catch {
      return;
    }
    if (!raw) {
      return;
    }
    try {
      const data = JSON.parse(raw) as unknown;
      if (!data || typeof data !== 'object') {
        return;
      }
      const o = data as Record<string, unknown>;
      const budget = o['weeklyBudget'];
      const lineList = o['lines'];
      if (typeof budget !== 'number' || !Number.isFinite(budget) || budget < 0) {
        return;
      }
      if (!Array.isArray(lineList)) {
        return;
      }
      const parsed = lineList
        .map((row) => this.parseStoredLine(row))
        .filter((line): line is BudgetLine => line !== null);
      if (parsed.length === 0) {
        return;
      }
      this.weeklyBudget.set(budget);
      this.lines.set(parsed);
    } catch {
      /* JSON inválido */
    }
  }

  private parseStoredLine(row: unknown): BudgetLine | null {
    if (!row || typeof row !== 'object') {
      return null;
    }
    const r = row as Record<string, unknown>;
    const id = typeof r['id'] === 'string' && r['id'].length > 0 ? r['id'] : crypto.randomUUID();
    const item = typeof r['item'] === 'string' ? r['item'] : '';
    const quantity = typeof r['quantity'] === 'number' ? this.clampQty(r['quantity']) : 1;
    const unitPrice = typeof r['unitPrice'] === 'number' ? this.clampMoney(r['unitPrice']) : 0;
    return { id, item, quantity, unitPrice };
  }
}
