# CPDOC Interface

Esse projeto contempla a interface estática que exibe as entrevistas do PHO/CPDOC.

Para que a interface funcione corretamente, você precisa primeiro gerar os dados com o script
`pho/pho_create_jsons.py`, que está no repositório
[cpdoc/data-science-research](https://github.com/cpdoc/data-science-research). Será gerada uma pasta
`data/pho-interface-data`, que deve ser movida para `public/data` nesse repositório.


## Configuração do Projeto

Requer docker e docker compose. Na primeira vez, basta executar:

```shell
make first
```

Para acessar o projeto com *hot-reload* (recarregamento automático), acesse [localhost:5173](http://localhost:5173).
Nas próximas execuções você só precisará:

```shell
make start
```

### Verificação de Tipos, Compilação e Minificação para Produção

```shell
make bundle
```

### Linting com [ESLint](https://eslint.org/)

```shell
# Entre no shell do container
make shell
# Então execute dentro do container
npm run lint
```

### Formatação com [Prettier](https://prettier.io/)
```sh
# Entre no shell do container
make shell
# Então execute dentro do container
npm run format
```
