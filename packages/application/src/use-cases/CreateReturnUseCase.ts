export interface CreateReturnRequest {
  assessmentYear: string;
}

export interface CreateReturnResponse {
  returnId: string;
}

export class CreateReturnUseCase {
  execute(
    request: CreateReturnRequest
  ): CreateReturnResponse {
    return {
      returnId: crypto.randomUUID(),
    };
  }
}