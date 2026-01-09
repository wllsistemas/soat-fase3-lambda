# soat Function Lambda

Este projeto contém o código-fonte e os arquivos de suporte para uma aplicação _serverless_ que pode ser implantada com a CLI do SAM (Serverless Application Model Command Line Interface).

Essa function faz as seguintes operações: 

1. Verifica se um CPF é válido.
2. Consulta o status de um cliente na base de dados.
3. Gera o token JWT que pode ser usado para acessar os recursos da API de oficina mecânica.

# Como isso é feito?

Para realizar uma das operações mencionadas anteriormente, uma chamada http `POST` para o seguinte endpoint deve ser feita:

Um corpo de requisição deve ser enviado com o seguinte formato:

```json
{
  "act": "...",
  "data": "..."
}
```

Sendo que para validar um CPF, o seguinte corpo deve ser enviado:

```json
{
  "act": "ACT_VALIDATE_USER_DOCUMENT",
  "data": "coloque aqui o documento para ser verificado"
}
```

Para verificar o status do cliente na base de dados, o seguinte corpo deve ser enviado:

```json
{
  "act": "ACT_VALIDATE_CUSTOMER_STATUS",
  "data": "coloque aqui o documento do cliente para ser verificado"
}
```

Para gerar um token JWT para acessar os recursos da API de oficina mecânica, o seguinte corpo deve ser enviado:

```json
{
  "act": "ACT_GENERATE_TOKEN",
  "data": {
    "email": "coloque aqui o email do usuario",
    "password": "coloque aqui a senha do usuario"
  }
}
```


# Resultado esperado

As seguintes `JSON response` são esperadas:

Para `ACT_VALIDATE_USER_DOCUMENT`:
```json
{
    "err": false,
    "msg": "status: validated",
    "data": {
        "doc": "00000000000"
    }
}
```

Para `ACT_VALIDATE_CUSTOMER_STATUS`:
```json
{
    "err": false,
    "msg": "status: OK",
    "data": {
        "uuid": "e80d4ec0-5ca0-444f-aa09-f9f019092388"
    }
}
```

Para `ACT_GENERATE_TOKEN`:
```json
{
    "err": false,
    "msg": "successfully generated token",
    "data": {
        "token": "..."
    }
}
```