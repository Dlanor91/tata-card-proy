import { ChangeDetectionStrategy, Component, HostListener, computed, signal } from '@angular/core';
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
  private static readonly INITIAL_WEEKLY_BUDGET = 1690;

  /** Monto tope semanal (ej. 1690). */
  readonly weeklyBudget = signal(HomePageComponent.INITIAL_WEEKLY_BUDGET);

  readonly lines = signal<BudgetLine[]>([this.createEmptyLine()]);

  /** Suma de (cantidad × precio unitario) por fila. */
  readonly totalUsed = computed(() =>
    this.lines().reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  );

  readonly available = computed(() => this.weeklyBudget() - this.totalUsed());

  readonly isOverBudget = computed(() => this.available() < 0);

  /**
   * Hay cambios respecto al estado inicial: mostrar aviso al recargar o cerrar la pestaña.
   * Los navegadores solo permiten un diálogo genérico (no se puede personalizar el texto).
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

  removeLine(id: string): void {
    this.lines.update((rows) => {
      const filtered = rows.filter((r) => r.id !== id);
      return filtered.length > 0 ? filtered : [this.createEmptyLine()];
    });
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
}
