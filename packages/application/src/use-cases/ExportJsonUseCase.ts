export class ExportJsonUseCase {
  execute(data: unknown): string {
    return JSON.stringify(data, null, 2);
  }
}