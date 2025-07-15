import { Injectable } from '@nestjs/common';
import { DocumentDrivenPort } from '../../application/ports';
import { Document } from '../../domain';
import { DocumentModel } from '../persistant';
import { propsToSnakeCase, propsToCamelCase } from '../../../shared';
import { QGetDocuments } from '../query';
import { IQGetDocumentsRes } from '../query/dto';

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

  public async findMany(filter: { embedding: string; threshold: number; limit: number }) {
    return (await QGetDocuments.execute(filter)).map(
      (item) => new Document(propsToCamelCase<IQGetDocumentsRes, Document>(item)),
    );
  }
}
