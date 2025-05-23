# HTTP клиент

HTTP клиент [@biorate/axios](https://www.npmjs.com/package/@biorate/axios) построен на 
библиотеке [axios](https://www.npmjs.com/package/axios), описание параметров запросов
выполнено в виде классов. Свойства классов являются конфигурационными параметрами
[axios](https://github.com/axios/axios?tab=readme-ov-file#request-config) и полностью
совпадают по названию.

### Пример запроса:

```ts
class Yandex extends Axios {
  public baseURL = 'https://ya.ru';

  public timeout = 1500;
  
  public method = 'get';
  
  public headers = {
    'X-Some-Name': 'Some Value'
  };
  
  public static fetch() {
    return this._fetch<string>();
  }
}

const { data } = await Yandex.fetch();

console.log(data); // '<!doctype html><html itemscope="" itemtype=...'
```

Статический метод **fetch** может принимать объект содержащий параметры запроса.
Защищённый статический метод **_fetch** принимает параметры [axios](https://github.com/axios/axios?tab=readme-ov-file#request-config)
для подмешивания их в итоговый конфиг, сс помощью которого будет выполнен запрос.
Приоритет подмешиваемых параметров выше определённых в свойствах. У метода **_fetch**
есть генерик, который определяет тип данных переданных в параметр **data** в ответе 
запроса.

### Пример параметризации запроса:

```ts
class SomeServiceApi extends Axios {
  public baseURL = 'https://some-service.ru';
  
  public timeout = 1500;
  
  public static fetch(data: { 
    timeout: number; 
    params: { a: number; b: number; }; 
  }) {
    return this._fetch<{ 
      foo: number; 
      bar: string; 
    }>({ 
      timeout: data.timeout, 
      params: data.params,
    });
  }
}

const { data } = await Yandex.fetch({ timeout: 5000, params: { a: 1, b: 2 } });

console.log(data); // { "foo": 1, "bar": "baz" }
```

Так же существует пакет [@biorate/axios-prometheus](https://www.npmjs.com/package/@biorate/axios-prometheus)
в котором реализованы такие метрики как количество и время выполнения запросов. 
