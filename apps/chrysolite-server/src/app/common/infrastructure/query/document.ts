import { Transaction } from '@biorate/sequelize';
import { QCommon } from './common';
import { IQGetDocumentsReq, IQGetDocumentsRes } from './dto';

export class QGetDocuments extends QCommon {
  protected readonly query = `
    SELECT 
      id, 
      text,
      embedding,
      1 - (embedding <=> :embedding) AS similarity,
      last_stamp,
      creation
    FROM document
    WHERE 1 - (embedding <=> :embedding) > :threshold
    ORDER BY similarity DESC
    LIMIT :limit;
  `;

  public static execute(params: IQGetDocumentsReq, transaction?: Transaction) {
    return this.exec<IQGetDocumentsRes>({
      transaction,
      replacements: params,
    });
  }
}
