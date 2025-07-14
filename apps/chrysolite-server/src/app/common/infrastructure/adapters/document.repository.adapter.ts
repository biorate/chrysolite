import { Injectable } from '@nestjs/common';
import { DocumentDrivenPort } from '../../application/ports';
import { Document } from '../../domain';
import { DocumentModel } from '../persistant';
import { propsToSnakeCase, propsToCamelCase } from '../../../shared';

@Injectable()
export class DocumentRepositoryAdapter implements DocumentDrivenPort {
  public static toModel(data: Document) {
    return new DocumentModel({
      ...propsToSnakeCase<Document, DocumentModel>(data),
    });
  }

  public static toEntity(data: DocumentModel) {
    return new Document(propsToCamelCase<DocumentModel, Document>(data.toJSON()));
  }

  public async create(data: Document) {
    const model = DocumentRepositoryAdapter.toModel(data);
    await model.save();
    return DocumentRepositoryAdapter.toEntity(model);
  }
}
