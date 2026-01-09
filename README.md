# SOAT FASE 03 - Lambda

_Tech challenge_ da pós tech em arquitetura de software - FIAP Fase 3

# Alunos

- Felipe
    - RM: `365154`
    - discord: `felipeoli7eira`
    - LinkedIn: [@felipeoli7eira](https://www.linkedin.com/in/felipeoli7eira)
- Nicolas
    - RM: `365746`
    - discord: `nic_hcm`
    - LinkedIn: [@Nicolas Martins](https://www.linkedin.com/in/nicolas-henrique/)
- William
    - RM: `365973`
    - discord: `wllsistemas`
    - LinkedIn: [@William Francisco Leite](https://www.linkedin.com/in/william-francisco-leite-9b3ba9269/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

## 🚀 Pipeline GitHub Actions

#### 1. Aprovação de um PR para merge com a `main`
No branch `main` são efetuados merges mediante aprovação dos PRs.

#### 2. Execução da Pipeline CI
Ao executar o merge, é disparada a pipeline `deploy.yaml` que executa:
- Executa o deploy da aplicação para Lambda AWS
- Persiste o estado do terraform no bucket S3

## 🚀 State Terraform no Bucket S3
Para persistência do estado dos recursos provisionados via terraform, é utilizado um repositório Bucket S3 na AWS, onde os arquivos de persistência foram separados por repositório (infra, database e application).

# Instruções Lambda

Este projeto contém o código-fonte e os arquivos de suporte para uma aplicação _serverless_ que pode ser implantada com a CLI do SAM (Serverless Application Model Command Line Interface).

Essa function faz as seguintes operações: 

1. Verifica se um CPF é válido.
2. Consulta o status de um cliente na base de dados.
3. Gera o token JWT que pode ser usado para acessar os recursos da API de oficina mecânica.

## 🚀 Como isso é feito?

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

## 🚀 Resultado esperado

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