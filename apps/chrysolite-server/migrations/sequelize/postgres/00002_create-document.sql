CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  text TEXT NOT NULL,
  embedding VECTOR(512) NOT NULL,
  last_stamp TIMESTAMP NOT NULL,
  creation TIMESTAMP NOT NULL DEFAULT NOW()
);

SELECT create_creation_stamp_indexes('document');

-- Для косинусной схожести
CREATE INDEX ON document USING hnsw (embedding vector_cosine_ops);
-- Для евклидова расстояния
CREATE INDEX ON document USING hnsw (embedding vector_l2_ops);
-- Для внутреннего произведения
CREATE INDEX ON document USING hnsw (embedding vector_ip_ops);

COMMENT ON COLUMN document.id
  IS 'Уникальный идентификатор';
COMMENT ON COLUMN document.text
  IS 'Текст';
COMMENT ON COLUMN document.embedding
  IS 'Вектор эмбеддинга';
COMMENT ON COLUMN document.last_stamp
  IS 'Дата обновления';
COMMENT ON COLUMN document.creation
  IS 'Дата создания';
