import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  /** Monto tope semanal (ej. 1690). */
  readonly weeklyBudget = signal(1690);

  readonly lines = signal<BudgetLine[]>([this.createEmptyLine()]);

  /** Suma de (cantidad × precio unitario) por fila. */
  readonly totalUsed = computed(() =>
    this.lines().reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  );

  readonly available = computed(() => this.weeklyBudget() - this.totalUsed());

  readonly isOverBudget = computed(() => this.available() < 0);

  formatMoney(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
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
