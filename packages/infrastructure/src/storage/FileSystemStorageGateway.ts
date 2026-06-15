import { IStorageGateway } from "./IStorageGateway";

export class FileSystemStorageGateway implements IStorageGateway {
  async save<T>(_key: string, _data: T): Promise<void> {
    throw new Error("Not implemented");
  }

  async load<T>(_key: string): Promise<T | null> {
    throw new Error("Not implemented");
  }

  async delete(_key: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async exists(_key: string): Promise<boolean> {
    throw new Error("Not implemented");
  }
}